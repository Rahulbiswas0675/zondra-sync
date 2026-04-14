import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getRemoteConfig } from "firebase/remote-config";

// These values should be replaced with actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyC6YhGsA1K1taKIvgv0th-S6DwaSIDT4GE",
  authDomain: "think-big-f8c31.firebaseapp.com",
  databaseURL: "https://think-big-f8c31-default-rtdb.firebaseio.com",
  projectId: "think-big-f8c31",
  storageBucket: "think-big-f8c31.firebasestorage.app",
  messagingSenderId: "85344977465",
  appId: "1:85344977465:web:31658299c86bd047e9c3e8",
  measurementId: "G-8GEM9196KB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const remoteConfig = getRemoteConfig(app);
