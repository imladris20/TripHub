// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_7TzcS2_S3GHkAWE5b_A3f8hhEw3qJ3g",
  authDomain: "triphub-d397b.firebaseapp.com",
  projectId: "triphub-d397b",
  storageBucket: "triphub-d397b.appspot.com",
  messagingSenderId: "1060495883109",
  appId: "1:1060495883109:web:8d36f3774557f0bce6bf8c",
  measurementId: "G-H99YCKKVH9",
};

// Initialize Firebase

export const initFirebase = () => {
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);
  const auth = getAuth();
  return { db, auth };
};

export const nativeSignUp = async (email, password) => {
  const auth = getAuth();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};

export const nativeSignIn = async (email, password) => {
  const auth = getAuth();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};

export const nativeSignOut = async () => {
  const auth = getAuth();
  const result = await signOut(auth);
  return result;
};