# Firebase: Auth + Firestore — состояние настройки

Backend — **Firebase** (проект `habitrix-3a04b`, номер `959464884714`).
Клиент — `@react-native-firebase`.

## Что уже настроено (сделано через Firebase CLI)

- **Apple (iOS) приложение** зарегистрировано в проекте:
  - App ID: `1:959464884714:ios:6b9968056c5170b8aaca93`
  - Bundle ID: `com.scientix.habitrix` (проставлен и в Xcode-проекте)
- **Authentication** включена:
  - Email/Password
  - Google (support email: `yerlanaubakirovvv@gmail.com`)
- **Firestore** создан: Standard edition, регион `europe-west1`.
  Правила безопасности (`firestore.rules`) задеплоены — каждый пользователь
  имеет доступ только к своему документу `users/{uid}`.
- **Конфиг-файлы и ключи проставлены в коде:**
  - `ios/habitrix/GoogleService-Info.plist` (скачан через CLI, подключён к Xcode
    как ресурс)
  - `REVERSED_CLIENT_ID` → `ios/habitrix/Info.plist` (URL-схема для Google)
  - `WEB_CLIENT_ID` → `src/config/authConfig.ts`
  - `FirebaseApp.configure()` в `ios/habitrix/AppDelegate.swift`
  - Android: плагин `google-services` в Gradle, флаг `$RNFirebaseAsStaticFramework`
    в `ios/Podfile`

## Код

- `src/services/authService.ts` — email/пароль, Google, сброс пароля, выход.
- `src/services/firestoreService.ts` — профиль `users/{uid}` + облачный бэкап
  данных (цель, привычки, отметки).
- `src/hooks/useFirebaseAuthSync.ts` — Firebase как источник правды о сессии.
- `src/hooks/useCloudSync.ts` — двусторонняя синхронизация локальных стора и
  Firestore (на входе подтягивает облако, дальше пушит изменения).
- `src/screens/EmailAuthScreen.tsx`, `src/screens/AuthScreen.tsx` — UI входа.

## Что осталось сделать вручную

1. **Собрать нативно:**
   ```
   cd ios && pod install
   npx react-native run-ios
   ```
   Если `pod install` упадёт с ошибкой про modular headers Firebase — добавь в
   `ios/Podfile` внутри `target 'habitrix'` строку
   `use_frameworks! :linkage => :static` и повтори.

2. **Android (если нужен):** зарегистрируй Android-приложение в проекте, скачай
   `google-services.json` в `android/app/`, добавь SHA-1
   (`cd android && ./gradlew signingReport`) в настройки Android-приложения в
   Firebase Console — иначе Google-вход на Android не заработает.

3. **Apple Sign-In** — появится, когда будет Apple Developer Program (вход через
   Firebase, провайдер `apple.com`). Сейчас кнопка Apple показывает «скоро».

## Проверка после запуска

- Регистрация/вход по email → в Firebase Console → Authentication появится
  пользователь.
- Вход через Google → там же появится пользователь с провайдером Google.
- Firestore Console → коллекция `users` → документ с твоим `uid`, полями
  профиля и `appData`.
