// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgNwXzuAvz4bbA3CXI0j2TMm3m4IME6dk",
  authDomain: "invoice-app-b784d.firebaseapp.com",
  projectId: "invoice-app-b784d",
  storageBucket: "invoice-app-b784d.appspot.com",
  messagingSenderId: "1096413114796",
  appId: "1:1096413114796:web:c71588b55e070e45168a09",
  measurementId: "G-52T0JGQZ4Y"
};

// Firebase init
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
