/**
 * Auth configuration values you must fill in from the Firebase / Google Cloud
 * console. See docs/AUTH_SETUP.md for the exact steps.
 *
 * WEB_CLIENT_ID:
 *   Firebase Console → Project settings → your project → "Web client (auto
 *   created by Google Service)" OAuth 2.0 client ID (…apps.googleusercontent.com).
 *   Required so the Google idToken has the right audience for Firebase.
 *
 * The iOS client id is read automatically from GoogleService-Info.plist, so it
 * does not need to be listed here.
 */
const WEB_CLIENT_ID_PLACEHOLDER =
  'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';

// Web OAuth client ID of the Firebase project `habitrix-3a04b`
// (auto-created when Google Sign-In was enabled).
export const WEB_CLIENT_ID: string =
  '959464884714-rva9r9jiphu556q9sqfle78nt8i27amm.apps.googleusercontent.com';

export const isGoogleConfigured =
  WEB_CLIENT_ID !== WEB_CLIENT_ID_PLACEHOLDER && WEB_CLIENT_ID.length > 0;
