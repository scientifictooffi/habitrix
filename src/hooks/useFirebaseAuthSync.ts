import { useEffect } from 'react';
import { subscribeToAuthState } from '../services/authService';
import { useSessionStore } from '../store/sessionStore';

/**
 * Bridges Firebase Auth state into the local session store.
 *
 * Firebase is the source of truth for authenticated users: it restores the
 * signed-in user on launch and emits changes (sign-in, sign-out, token refresh,
 * account deletion). We mirror that into the Zustand session store so the rest
 * of the app can stay Firebase-agnostic.
 *
 * Guest sessions (Skip) are untouched: `signOut()` only clears the auth fields
 * and keeps `hasEnteredApp`, so a guest who never signed in stays in the app.
 */
export function useFirebaseAuthSync() {
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(user => {
      const { setAuthenticated, signOut, isAuthenticated } =
        useSessionStore.getState();
      if (user) {
        setAuthenticated({
          userId: user.userId,
          provider: user.provider,
          email: user.email,
          fullName: user.fullName,
        });
      } else if (isAuthenticated) {
        signOut();
      }
    });

    return unsubscribe;
  }, []);
}
