# Firebase setup — FRONTIER (Spark / free plan)

A concise, step-by-step guide to stand up Auth + Firestore at zero cost
and get your web config keys.

## 1. Create the project
1. Go to the [Firebase console](https://console.firebase.google.com/) and click **Add project**.
2. Name it (e.g. `frontier-prod`). Disable Google Analytics if you want the simplest setup.
3. On the plan prompt, stay on the **Spark (free)** plan — no card required.

## 2. Register a Web app & get the config
1. In the project, click the **Web** icon (`</>`) under "Get started by adding an app".
2. Give it a nickname (e.g. `frontier-web`). **Do not** enable Hosting yet (we deploy the UI via GitHub Pages).
3. Firebase shows a `firebaseConfig` object — copy those 6 values.
4. Paste them into `frontend/js/firebase-init.js` → `FIREBASE_CONFIG`.
   *(These are public identifiers, not secrets — safe to commit.)*

## 3. Enable Authentication
1. Left nav → **Build → Authentication → Get started**.
2. Enable **Email/Password** (Sign-in method tab).
3. Add yourself: **Users → Add user** (email + password) — this is your admin login.

## 4. Create the Firestore database
1. Left nav → **Build → Firestore Database → Create database**.
2. Start in **Production mode** (we ship real rules).
3. Pick a region close to Brazil (e.g. `southamerica-east1`).

## 5. Publish the security rules
- Copy the contents of [`firestore.rules`](../firestore.rules) into
  **Firestore → Rules** and click **Publish**, **or** use the CLI:
  ```bash
  npm i -g firebase-tools
  firebase login
  firebase deploy --only firestore:rules
  ```

## 6. Make yourself an admin
The rules treat admins as users with the custom claim `{ admin: true }`.
Set it once with a tiny Admin SDK script (run locally with a service-account key):
```js
// setAdmin.js — run: node setAdmin.js
const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.applicationDefault() });
admin.auth().setCustomUserClaims("YOUR_ADMIN_UID", { admin: true })
  .then(() => console.log("Admin claim set. Sign out/in to refresh the token."));
```
*(Fallback if you skip claims: create `users/{yourUid}` with `role: "admin"` —
`isAdmin()` in `firebase-init.js` checks that too.)*

## 7. Verify
- Open `frontend/admin.html`, sign in with your admin user → the command
  center loads. Non-admins are bounced to the app.

---

### Notes
- **Mercado Pago** (later): the `users/{uid}.subscription` shape in
  `firebase-init.js` is already prepared for it (`provider: "mercadopago"`).
- Keep service-account JSON keys **out of the repo** (they're in `.gitignore`).
