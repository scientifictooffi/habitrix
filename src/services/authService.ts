import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  onAuthStateChanged,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  type User as FirebaseUser,
} from '@firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { auth } from '../config/firebaseWeb';
import { WEB_CLIENT_ID, isGoogleConfigured } from '../config/authConfig';
import type { AuthProvider } from '../store/sessionStore';

export type AppUser = {
  userId: string;
  provider: AuthProvider;
  email: string | null;
  fullName: string | null;
};

export class AuthError extends Error {
  code: 'canceled' | 'not_configured' | 'in_progress' | 'auth' | 'failed';

  constructor(code: AuthError['code'], message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

/** Call once on app start (before any Google sign-in). */
export function configureGoogleSignin() {
  if (!isGoogleConfigured) {
    return;
  }
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    offlineAccess: false,
  });
}

const providerFromFirebase = (user: FirebaseUser): AuthProvider => {
  const id = user.providerData[0]?.providerId;
  if (id === 'google.com') return 'google';
  if (id === 'apple.com') return 'apple';
  return 'password';
};

export const toAppUser = (user: FirebaseUser): AppUser => ({
  userId: user.uid,
  provider: providerFromFirebase(user),
  email: user.email ?? null,
  fullName: user.displayName ?? null,
});

/** Human-readable Russian message for a Firebase auth error code. */
const mapFirebaseError = (code?: string): string => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Некорректный email.';
    case 'auth/user-disabled':
      return 'Этот аккаунт заблокирован.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Неверный email или пароль.';
    case 'auth/email-already-in-use':
      return 'Этот email уже зарегистрирован.';
    case 'auth/weak-password':
      return 'Пароль слишком простой (минимум 6 символов).';
    case 'auth/network-request-failed':
      return 'Нет соединения. Проверь интернет.';
    case 'auth/too-many-requests':
      return 'Слишком много попыток. Попробуй позже.';
    default:
      return 'Не удалось выполнить вход. Попробуй ещё раз.';
  }
};

const wrapFirebase = (err: any): AuthError =>
  new AuthError('auth', mapFirebaseError(err?.code));

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AppUser> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    return toAppUser(cred.user);
  } catch (err) {
    throw wrapFirebase(err);
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string,
): Promise<AppUser> {
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );
    const trimmedName = fullName?.trim();
    if (trimmedName) {
      await updateProfile(cred.user, { displayName: trimmedName });
    }
    return toAppUser(auth.currentUser ?? cred.user);
  } catch (err) {
    throw wrapFirebase(err);
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (err) {
    throw wrapFirebase(err);
  }
}

export async function signInWithGoogle(): Promise<AppUser> {
  if (!isGoogleConfigured) {
    throw new AuthError(
      'not_configured',
      'Вход через Google ещё не настроен в этой сборке.',
    );
  }
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (response.type === 'cancelled') {
      throw new AuthError('canceled', 'Вход отменён.');
    }
    const idToken = response.data.idToken;
    if (!idToken) {
      throw new AuthError('failed', 'Google не вернул токен. Попробуй ещё раз.');
    }
    const credential = GoogleAuthProvider.credential(idToken);
    const cred = await signInWithCredential(auth, credential);
    return toAppUser(cred.user);
  } catch (err: any) {
    if (err instanceof AuthError) {
      throw err;
    }
    if (err?.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new AuthError('canceled', 'Вход отменён.');
    }
    if (err?.code === statusCodes.IN_PROGRESS) {
      throw new AuthError('in_progress', 'Вход уже выполняется.');
    }
    if (err?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new AuthError(
        'failed',
        'Google Play Services недоступны на этом устройстве.',
      );
    }
    if (typeof err?.code === 'string' && err.code.startsWith('auth/')) {
      throw wrapFirebase(err);
    }
    throw new AuthError('failed', 'Не удалось войти через Google.');
  }
}

export async function signOut(): Promise<void> {
  try {
    const current = auth.currentUser;
    const provider = current ? providerFromFirebase(current) : null;
    await fbSignOut(auth);
    if (provider === 'google' && isGoogleConfigured) {
      await GoogleSignin.signOut();
    }
  } catch {
    // Best-effort; the auth-state listener clears the local session anyway.
  }
}

/** Subscribe to Firebase auth state. Returns an unsubscribe function. */
export function subscribeToAuthState(
  cb: (user: AppUser | null) => void,
): () => void {
  return onAuthStateChanged(auth, user => {
    cb(user ? toAppUser(user) : null);
  });
}
