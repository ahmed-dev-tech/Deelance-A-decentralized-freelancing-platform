import React, { createContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  getFirestore,
  orderBy,
  limit,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwhe7bu3jE1IZcXWMjn6w_h_vT3XfO0Lo",
  authDomain: "deelance-c6840.firebaseapp.com",
  projectId: "deelance-c6840",
  storageBucket: "deelance-c6840.appspot.com",
  messagingSenderId: "409641671389",
  appId: "1:409641671389:web:c8446a72078b671c159934",
  measurementId: "G-ERD28JV8ZG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const FirebaseContext = createContext();

// firebase functions may be moved to another file later on
const addCategory = async (newCategory) => {
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      category: newCategory,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    throw error;
  }
};
const getCategories = async () => {
  try {
    const docRef = query(
      collection(db, "categories"),
      where("category", "!=", "")
    );
    const docSnap = await getDocs(docRef);
    let res = [];
    docSnap.forEach((doc) => {
      res.push(doc.data().category);
    });
    return res;
  } catch (error) {
    throw error;
  }
};
const createGig = async (
  ipfsHash,
  category,
  address,
  rating = 0,
  orderArray = []
) => {
  try {
    const docRef = await addDoc(collection(db, "gigs"), {
      ipfsHash,
      category,
      address,
      rating,
      orderArray,
      timestamp: Date.now(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    throw error;
  }
};
const getGigs = async (order = "rating", lim = 10, condition = null) => {
  try {
    let docRef;
    if (condition == null) {
      docRef = query(collection(db, "gigs"), orderBy(order), limit(lim));
    } else {
      docRef = query(
        collection(db, "gigs"),
        where(condition[0], condition[1], condition[2]),
        orderBy(order),
        limit(lim)
      );
    }
    const docSnap = await getDocs(docRef);
    let res = [];
    docSnap.forEach((doc) => {
      res.push({ ...doc.data(), id: doc.id });
    });
    console.log(res);
    return res;
  } catch (error) {
    throw error;
  }
};
const createOrder = async (
  ipfsHash,
  category,
  address,
  rating = 0,
  biddersArray = []
) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ipfsHash,
      category,
      address,
      rating,
      biddersArray,
      timestamp: Date.now(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    throw error;
  }
};
const getOrders = async (order = "timestamp", lim = 10, condition = null) => {
  try {
    let docRef;
    if (condition == null) {
      docRef = query(collection(db, "orders"), orderBy(order), limit(lim));
    } else {
      docRef = query(
        collection(db, "orders"),
        where(condition[0], condition[1], condition[2]),
        orderBy(order),
        limit(lim)
      );
    }
    const docSnap = await getDocs(docRef);
    let res = [];
    docSnap.forEach((doc) => {
      res.push({ ...doc.data(), id: doc.id });
    });
    console.log(res);
    return res;
  } catch (error) {
    throw error;
  }
};
const fetchGigDetails = async (gigId) => {
  try {
    const docRef = doc(db, "gigs", gigId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return {};
    }
  } catch (error) {
    throw error;
  }
};
function FirebaseProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const data = {
    db,
    addCategory,
    getCategories,
    categories,
    createGig,
    getGigs,
    createOrder,
    getOrders,
    fetchGigDetails,
  };

  useEffect(() => {
    getCategories().then((res) => setCategories(res));
  }, []);

  return (
    <FirebaseContext.Provider value={data}>{children}</FirebaseContext.Provider>
  );
}

export default FirebaseProvider;
