import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import globalStore, {
  overViewStore,
  poisStore,
  scheduleStore,
} from "../store/store";
import { getUidFromLocal } from "./util";

const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: firebaseApiKey,
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

export const nativeSignUp = async ({ name, email, password }) => {
  const auth = getAuth();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const nativeSignIn = async ({ email, password }) => {
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

export const db = {
  getDoc: async (pathType) => {
    const { uid, database } = globalStore.getState();
    const pathOptions = {
      userInfo: [database, "users", uid || getUidFromLocal()],
    };

    const docRef = doc(...pathOptions[pathType]);

    const result = await getDoc(docRef);

    return result.data();
  },
  getDocWithParams: async (pathType, params) => {
    const { uid, database } = globalStore.getState();
    const overviewUid = overViewStore.getState().uid;
    const pathOptions = {
      categories: [database, "users", overviewUid, "pointOfInterests", params],
      trip: [database, "users", uid, "trips", params],
    };
    const docRef = doc(...pathOptions[pathType]);
    const result = await getDoc(docRef);
    return result.data();
  },
  setNewDoc: async (pathType, newDocData) => {
    const { uid, database } = globalStore.getState();
    const pathOptions = {
      trips: [database, "users", uid, "trips"],
    };
    const colRef = collection(...pathOptions[pathType]);
    const docRef = doc(colRef);

    await setDoc(docRef, newDocData);

    return docRef.id;
  },
  setNewDocByAssignedId: async (pathType, id, newDocData) => {
    const { database } = globalStore.getState();
    const pathOptions = {
      newUser: [database, "users", id],
    };
    const docRef = doc(...pathOptions[pathType]);
    await setDoc(docRef, newDocData, { merge: true });
  },
  updateDoc: async (pathType, newDocData) => {
    const { database, uid } = globalStore.getState();
    const { currentLoadingTripId } = scheduleStore.getState();
    const { poisItemDetailInfo } = poisStore.getState();

    const pathOptions = {
      currentTrip: [database, "users", uid, "trips", currentLoadingTripId],
      removeFromPois: [
        database,
        "users",
        uid,
        "pointOfInterests",
        poisItemDetailInfo?.id,
      ],
    };
    const docRef = doc(...pathOptions[pathType]);
    await setDoc(docRef, newDocData, { merge: true });
  },
  updateDocWithParams: async (pathType, newDocData, params) => {
    const { uid, database } = globalStore.getState();
    const pathOptions = {
      trips: [database, "users", uid, "trips", params],
    };
    const docRef = doc(...pathOptions[pathType]);
    await updateDoc(docRef, newDocData);
    return docRef.id;
  },
  getDocsAccrossCollections: async (pathType) => {
    const { database } = globalStore.getState();
    const pathOptions = {
      allTrips: [database, "trips"],
    };
    const colRef = query(collectionGroup(...pathOptions[pathType]));
    const querySnapshot = await getDocs(colRef);
    return querySnapshot;
  },
  getDocs: async (pathType) => {
    const { database, uid } = globalStore.getState();
    const pathOptions = {
      trips: [database, "users", uid, "trips"],
    };
    const colRef = collection(...pathOptions[pathType]);
    const querySnapshot = await getDocs(colRef);
    return querySnapshot;
  },
  getDocsByCityFiler: async () => {
    const { selectedCity } = poisStore.getState();
    const { database, uid } = globalStore.getState();
    const poisColRef = collection(database, "users", uid, "pointOfInterests");
    let q;
    if (selectedCity === "顯示全部縣市" || selectedCity === "") {
      q = query(poisColRef);
    } else {
      q = query(poisColRef, where("city", "==", selectedCity));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  },
  deleteDoc: async (pathType) => {
    const { database, uid } = globalStore.getState();
    const { currentLoadingTripId } = scheduleStore.getState();

    const pathOptions = {
      currentTrip: [database, "users", uid, "trips", currentLoadingTripId],
    };
    const docRef = doc(...pathOptions[pathType]);
    await deleteDoc(docRef);
  },
};
