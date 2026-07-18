import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from '@react-native-firebase/firestore';

export type TeamGroup = {
  id: string;
  name: string;
  ownerUid: string;
  inviteCode: string;
  memberUids: string[];
};

export type MemberProgress = {
  uid: string;
  displayName: string | null;
  todayDone: number;
  todayTotal: number;
  streak: number;
  date: string; // YYYY-MM-DD the progress refers to
};

export class TeamError extends Error {
  code: 'not_found' | 'already_member' | 'failed';
  constructor(code: TeamError['code'], message: string) {
    super(message);
    this.name = 'TeamError';
    this.code = code;
  }
}

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous 0/O/1/I

const randomCode = (): string => {
  let s = '';
  for (let i = 0; i < 6; i++) {
    s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return s;
};

const db = () => getFirestore();

const generateUniqueCode = async (): Promise<string> => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    const snap = await getDoc(doc(db(), 'inviteCodes', code));
    if (!snap.exists()) {
      return code;
    }
  }
  // Extremely unlikely; fall back to a longer code.
  return randomCode() + randomCode();
};

/** Create a new team owned by the current user. Returns the created group. */
export async function createGroup(
  name: string,
  ownerUid: string,
): Promise<TeamGroup> {
  try {
    const code = await generateUniqueCode();
    const ref = await addDoc(collection(db(), 'groups'), {
      name: name.trim() || 'Моя команда',
      ownerUid,
      inviteCode: code,
      memberUids: [ownerUid],
      createdAt: serverTimestamp(),
    });
    await setDoc(doc(db(), 'inviteCodes', code), {
      groupId: ref.id,
      ownerUid,
      createdAt: serverTimestamp(),
    });
    return {
      id: ref.id,
      name: name.trim() || 'Моя команда',
      ownerUid,
      inviteCode: code,
      memberUids: [ownerUid],
    };
  } catch {
    throw new TeamError('failed', 'Не удалось создать команду.');
  }
}

/** Join a team by its invite code. */
export async function joinGroupByCode(
  code: string,
  uid: string,
): Promise<TeamGroup> {
  const normalized = code.trim().toUpperCase();
  let groupId: string;
  try {
    const codeSnap = await getDoc(doc(db(), 'inviteCodes', normalized));
    if (!codeSnap.exists()) {
      throw new TeamError('not_found', 'Команда с таким кодом не найдена.');
    }
    groupId = codeSnap.data()!.groupId as string;
    // arrayUnion adds the user server-side without needing to read the group.
    await updateDoc(doc(db(), 'groups', groupId), {
      memberUids: arrayUnion(uid),
    });
  } catch (err) {
    if (err instanceof TeamError) {
      throw err;
    }
    throw new TeamError('failed', 'Не удалось вступить в команду.');
  }
  const groupSnap = await getDoc(doc(db(), 'groups', groupId));
  const data = groupSnap.data();
  return {
    id: groupId,
    name: (data?.name as string) ?? 'Команда',
    ownerUid: (data?.ownerUid as string) ?? '',
    inviteCode: (data?.inviteCode as string) ?? normalized,
    memberUids: (data?.memberUids as string[]) ?? [uid],
  };
}

/** Leave a team (removes yourself and your progress card). */
export async function leaveGroup(groupId: string, uid: string): Promise<void> {
  try {
    await deleteDoc(doc(db(), 'groups', groupId, 'members', uid));
    await updateDoc(doc(db(), 'groups', groupId), {
      memberUids: arrayRemove(uid),
    });
  } catch {
    throw new TeamError('failed', 'Не удалось выйти из команды.');
  }
}

/** Publish the current user's progress card to a group. */
export async function publishProgress(
  groupId: string,
  progress: MemberProgress,
): Promise<void> {
  await setDoc(
    doc(db(), 'groups', groupId, 'members', progress.uid),
    { ...progress, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

/** Subscribe to the teams the user belongs to. Returns unsubscribe. */
export function subscribeMyGroups(
  uid: string,
  cb: (groups: TeamGroup[]) => void,
): () => void {
  const q = query(
    collection(db(), 'groups'),
    where('memberUids', 'array-contains', uid),
  );
  return onSnapshot(
    q,
    snap => {
      const groups: TeamGroup[] = snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          name: (data.name as string) ?? 'Команда',
          ownerUid: (data.ownerUid as string) ?? '',
          inviteCode: (data.inviteCode as string) ?? '',
          memberUids: (data.memberUids as string[]) ?? [],
        };
      });
      cb(groups);
    },
    () => cb([]),
  );
}

/** Subscribe to member progress cards of a group. Returns unsubscribe. */
export function subscribeGroupMembers(
  groupId: string,
  cb: (members: MemberProgress[]) => void,
): () => void {
  return onSnapshot(
    collection(db(), 'groups', groupId, 'members'),
    snap => {
      const members: MemberProgress[] = snap.docs.map(d => {
        const data = d.data();
        return {
          uid: d.id,
          displayName: (data.displayName as string) ?? null,
          todayDone: (data.todayDone as number) ?? 0,
          todayTotal: (data.todayTotal as number) ?? 0,
          streak: (data.streak as number) ?? 0,
          date: (data.date as string) ?? '',
        };
      });
      cb(members);
    },
    () => cb([]),
  );
}
