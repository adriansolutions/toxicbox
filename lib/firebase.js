import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAICZc6Q2bbwsv_UtUjRoWiQYtoxp3WB7U",
  authDomain: "toxicbox-f25b6.firebaseapp.com",
  projectId: "toxicbox-f25b6",
  storageBucket: "toxicbox-f25b6.firebasestorage.app",
  messagingSenderId: "818643014600",
  appId: "1:818643014600:web:b0b5748dd129c0b3ebe6fd",
  measurementId: "G-DY5Q68N3F3"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
