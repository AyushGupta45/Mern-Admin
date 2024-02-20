import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-3c90d.firebaseapp.com",
  projectId: "mern-auth-3c90d",
  storageBucket: "mern-auth-3c90d.appspot.com",
  messagingSenderId: "171635363890",
  appId: "1:171635363890:web:c7a0183679eb18df92ec2b"
};

export const app = initializeApp(firebaseConfig);