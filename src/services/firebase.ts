import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBD5AzGqRKHwyBuRE_j_YhY-oBbgFT9X4k",
  authDomain: "kaandzone.firebaseapp.com",
  projectId: "kaandzone",
  storageBucket: "kaandzone.firebasestorage.app",
  messagingSenderId: "1080752463224",
  appId: "1:1080752463224:web:22da95250f00756a22fc8d",
  measurementId: "G-XXVPBKXLXS"
};

export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const authInstance = getAuth(app);
export const db = getFirestore(app);
