import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import type { AppUser } from './authService';

/**
 * Firestore layer. Each user owns a single document `users/{uid}` that holds
 * their profile plus an `appData` blob (goal, habits, completions). Security
 * rules restrict every document to its owner (see firestore.rules).
 */

const userDocRef = (uid: string) => doc(getFirestore(), 'users', uid);

export type CloudAppData = {
  goal: string | null;
  habits: unknown[];
  selectedHabits: string[];
  reminderTime: string;
  reminderEnabled: boolean;
  completions: Record<string, string[]>;
};

/** Create or update the user profile document on sign-in. */
export async function ensureUserProfile(user: AppUser): Promise<void> {
  const ref = userDocRef(user.userId);
  const snap = await getDoc(ref);
  const base = {
    email: user.email ?? null,
    displayName: user.fullName ?? null,
    provider: user.provider,
    lastLoginAt: serverTimestamp(),
  };
  if (snap.exists()) {
    await setDoc(ref, base, { merge: true });
  } else {
    await setDoc(ref, { ...base, createdAt: serverTimestamp() }, { merge: true });
  }
}

/** Persist the user's app data (habits, progress) to the cloud. */
export async function saveAppData(
  uid: string,
  data: CloudAppData,
): Promise<void> {
  await setDoc(
    userDocRef(uid),
    { appData: data, appDataUpdatedAt: serverTimestamp() },
    { merge: true },
  );
}

/** Load the user's app data, or null if none has been saved yet. */
export async function loadAppData(uid: string): Promise<CloudAppData | null> {
  const snap = await getDoc(userDocRef(uid));
  if (!snap.exists()) {
    return null;
  }
  const data = snap.data();
  return (data?.appData as CloudAppData | undefined) ?? null;
}
