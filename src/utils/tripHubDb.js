import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import globalStore from "../store/store";
import { getUidFromLocal } from "./util";

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
  const db = getFirestore(app);
  const auth = getAuth();
  return { db, auth };
};

//  Authentication

export const nativeSignUp = async (name, email, password) => {
  const auth = getAuth();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    const update = await updateProfile(user, {
      displayName: name,
    });

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

//  FireStore

export const setDocNewUser = async (name, email, uid, db) => {
  const docData = {
    name,
    email,
  };

  setDoc(doc(db, "users", uid), docData, { merge: true });
};

export const db = {
  getDoc: async (pathType) => {
    const { uid, database } = globalStore.getState();
    const pathOption = {
      userInfo: ["users", uid || getUidFromLocal()],
    };

    // const [path, ...rest] = pathOption[pathType]

    const docRef = doc(database, ...pathOption[pathType]);

    const result = await getDoc(docRef);

    console.log(result.data());

    return result.data();
  },
};
