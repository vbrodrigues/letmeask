// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  onValue,
  push,
  update,
  query,
  equalTo,
  orderByChild,
  onChildAdded,
  limitToFirst,
} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const authProvider = new GoogleAuthProvider();
export const authLogin = signInWithPopup;
export const authLogout = signOut;

const database = getDatabase(app);

export {
  onAuthStateChanged,
  database,
  ref,
  set,
  get,
  child,
  onValue,
  push,
  update,
  query,
  equalTo,
  orderByChild,
  onChildAdded,
  limitToFirst,
};
