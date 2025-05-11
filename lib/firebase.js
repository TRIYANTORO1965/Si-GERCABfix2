
// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDvjmK1wjxo-pHpu7tlkRm_ljR73LuAcU",
  authDomain: "si-gercabfix2-6e3a6.firebaseapp.com",
  projectId: "si-gercabfix2-6e3a6",
  storageBucket: "si-gercabfix2-6e3a6.firebasestorage.app",
  messagingSenderId: "1056492464124",
  appId: "1:1056492464124:web:d9b1e95cf091500d737479"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
