// Firebase client SDK — initialised once and shared across contact form + admin dashboard.
// Config values come from Vercel env vars (PUBLIC_FIREBASE_*) so they are safely embedded at build time.
// Firestore security rules (set in the Firebase console) enforce the real auth boundary:
//   match /contact_submissions/{doc} {
//     allow create: if true;
//     allow read, update, delete: if request.auth != null;
//   }

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const CONTACT_COLLECTION = 'contact_submissions';
