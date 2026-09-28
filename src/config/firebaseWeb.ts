import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from '@firebase/app';
// Import auth from the scoped package (@firebase/auth), NOT the `firebase/auth`
// wrapper: only the scoped package exposes a "react-native" export condition,
// which Metro resolves to the RN build that ships getReactNativePersistence.
// The wrapper's ./auth export has no react-native condition and would load the
// web build, causing "Component auth has not been registered yet" at runtime.
import { initializeAuth, getAuth, type Auth } from '@firebase/auth';
import { initializeFirestore } from '@firebase/firestore';

// getReactNativePersistence lives only in the RN build of @firebase/auth, which
// Metro resolves via the "react-native" export condition. The public type defs
// (default condition) don't declare it, so require() it at runtime.
const { getReactNativePersistence } = require('@firebase/auth') as {
  getReactNativePersistence: (storage: unknown) => unknown;
};

// Web config of the Firebase project `habitrix-3a04b` (Default Web App).
// Not a secret: access is governed by Firestore security rules.
const firebaseConfig = {
  apiKey: 'AIzaSyAtDA6TXecUYiMVBd5gbp-7Z6pFtIu6OPE',
  authDomain: 'habitrix-3a04b.firebaseapp.com',
  projectId: 'habitrix-3a04b',
  storageBucket: 'habitrix-3a04b.firebasestorage.app',
  messagingSenderId: '959464884714',
  appId: '1:959464884714:web:b765bd20c4596fe5aaca93',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Persist the auth session in AsyncStorage so users stay logged in.
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage) as never,
  });
} catch {
  // initializeAuth throws if called twice (e.g. Fast Refresh) — reuse it.
  auth = getAuth(app);
}

// Long polling is the reliable transport for Firestore in React Native.
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export { app, auth, db };
