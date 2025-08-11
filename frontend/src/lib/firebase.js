// Firebase initialization for QuickCourt frontend
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyCgivYbeamLBKbL2JcNZPoVozQ3KZPlf6k',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'quickcourt-8b8d0.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'quickcourt-8b8d0',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'quickcourt-8b8d0.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '487823318151',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:487823318151:web:1f2e26f835b66942b96c22',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-3JVMEMXX8E',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
// Ensure sessions persist locally across reloads
setPersistence(auth, browserLocalPersistence).catch(() => {});
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };


