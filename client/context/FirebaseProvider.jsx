import React, { createContext, useContext, useEffect, useState } from "react";
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
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  startAfter,
  arrayRemove,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCDS1M946CIs2M5nvQZa0ookXcKbXwoDqw",
  authDomain: "delancer-a0a85.firebaseapp.com",
  projectId: "delancer-a0a85",
  storageBucket: "delancer-a0a85.appspot.com",
  messagingSenderId: "888855229580",
  appId: "1:888855229580:web:af225ff6be75ce83c8f7a9",
  measurementId: "G-ZZQXC9X2S9",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const FirebaseContext = createContext();
function FirebaseProvider({ children }) {
  // firebase functions may be moved to another file later on
  const addCategory = async (newCategory) => {
    try {
      const docRef = await addDoc(collection(db, "categories"), {
        category: newCategory,
        subCategories: [],
      });
    } catch (error) {
      throw error;
    }
  };
  const addSubCategory = async (category, subCategory) => {
    try {
      const docRef = query(
        collection(db, "categories"),
        where("category", "==", category)
      );
      const docSnap = await getDocs(docRef);
      let res = [];
      docSnap.forEach((doc) => {
        res.push(doc);
      });
      console.log(res[0].id);
      if (res[0].id) {
        const firebaseRes = await updateDoc(doc(db, "categories", res[0].id), {
          subCategories: arrayUnion(subCategory),
        });
        console.log(firebaseRes);
      }
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
        res.push(doc.data());
      });

      return res;
    } catch (error) {
      throw error;
    }
  };
  const createGig = async (
    ipfsHash,
    category,
    subCategory,
    address,
    price,
    rating = 0,
    biddersArray = [],
    approvedClients = []
  ) => {
    try {
      const docRef = await addDoc(collection(db, "gigs"), {
        ipfsHash,
        category,
        subCategory,
        address,
        price,
        rating,
        biddersArray,
        approvedClients,
        timestamp: Date.now(),
      });
    } catch (error) {
      throw error;
    }
  };
  const updateGig = async (gigId, dataObject) => {
    try {
      const docRef = doc(db, "gigs", gigId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const firebaseRes = await updateDoc(docRef, dataObject);
        return firebaseRes;
      }
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
        res.push(doc);
      });

      return {
        data: res.map((doc) => {
          return { ...doc.data(), id: doc.id };
        }),
        lastVisible: res[res.length - 1],
      };
    } catch (error) {
      throw error;
    }
  };
  const createOrder = async (
    ipfsHash,
    category,
    subCategory,
    address,
    budget,
    rating = 0,
    biddersArray = []
  ) => {
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ipfsHash,
        category,
        subCategory,
        address,
        budget,
        rating,
        biddersArray,
        timestamp: Date.now(),
      });
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
        res.push(doc);
      });
      return {
        data: res.map((doc) => {
          return { ...doc.data(), id: doc.id };
        }),
        lastVisible: res[res.length - 1],
      };
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
  const editProfile = async (address, dataObject) => {
    try {
      const docRef = doc(db, "profiles", address);
      const docSnap = await getDoc(docRef);
      let firebaseRes;
      if (docSnap.exists()) {
        firebaseRes = await updateDoc(docRef, dataObject);
      } else {
        firebaseRes = await setDoc(docRef, {
          ...dataObject,
          clientRating: 0,
          sellerRating: 0,
          clientReviewers: [],
          sellerReviewers: [],
        });
      }
    } catch (error) {
      throw error;
    }
  };
  const getUserProfile = async (address) => {
    try {
      const docRef = doc(db, "profiles", address);
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
  const fetchOrderDetails = async (orderId) => {
    try {
      const docRef = doc(db, "orders", orderId);
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
  const updateOrder = async (orderId, dataObject) => {
    try {
      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const firebaseRes = await updateDoc(docRef, dataObject);
        return firebaseRes;
      }
    } catch (error) {
      throw error;
    }
  };
  const deleteGig = async (gigId) => {
    try {
      const docRef = doc(db, "gigs", gigId);
      const res = await deleteDoc(docRef);
      return res;
    } catch (error) {
      throw error;
    }
  };
  const deleteOrder = async (orderId) => {
    try {
      const docRef = doc(db, "orders", orderId);
      const res = await deleteDoc(docRef);
      return res;
    } catch (error) {
      throw error;
    }
  };
  const addNewProject = async (collection, gigOrderId, projectId) => {
    try {
      const docRef = doc(db, collection, gigOrderId, "projects", projectId);
      const firebaseRes = await setDoc(docRef, { milestones: [], projectId });
    } catch (error) {
      throw error;
    }
  };
  const addMilestoneToProject = async (
    collection,
    gigOrderId,
    projectId,
    milestoneData
  ) => {
    try {
      const docRef = doc(db, collection, gigOrderId, "projects", projectId);
      await updateDoc(docRef, {
        milestones: arrayUnion(milestoneData),
      });
    } catch (error) {
      throw error;
    }
  };
  const getAllProjects = async (collectionName, gigOrderId, lim = 10) => {
    try {
      const docRef = query(
        collection(db, collectionName, gigOrderId, "projects"),
        orderBy("projectId"),
        limit(lim)
      );
      const docSnap = await getDocs(docRef);
      let res = [];
      docSnap.forEach((doc) => {
        res.push({ ...doc.data() });
      });
      return res;
    } catch (error) {
      throw error;
    }
  };
  const getProjectDetails = async (collection, gigOrderId, projectId) => {
    try {
      const docRef = doc(db, collection, gigOrderId, "projects", projectId);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    } catch (error) {
      throw error;
    }
  };
  const addToFirebaseArray = async (
    collection,
    gig_OrderId,
    arrayField,
    parameter
  ) => {
    try {
      const docRef = doc(db, collection, gig_OrderId);
      await updateDoc(docRef, {
        [arrayField]: arrayUnion(parameter),
      });
    } catch (error) {
      throw error;
    }
  };
  const approveClient = async (gigId, clientAddress) => {
    try {
      const docRef = doc(db, "gigs", gigId);
      await addToFirebaseArray("gigs", gigId, "approvedClients", clientAddress);
      await updateDoc(docRef, {
        biddersArray: arrayRemove(clientAddress),
      });
    } catch (error) {
      throw error;
    }
  };
  const getMoreGigs = async (
    lastVisible,
    order = "rating",
    lim = 10,
    condition = null
  ) => {
    try {
      let docRef;
      if (condition == null) {
        docRef = query(
          collection(db, "gigs"),
          orderBy(order),
          startAfter(lastVisible),
          limit(lim)
        );
      } else {
        docRef = query(
          collection(db, "gigs"),
          orderBy(order),
          where(condition[0], condition[1], condition[2]),
          startAfter(lastVisible),
          limit(lim)
        );
      }
      const docSnap = await getDocs(docRef);
      let res = [];
      docSnap.forEach((doc) => {
        res.push(doc);
      });
      console.log("okay now", res, docSnap);
      return {
        data: res.map((doc) => {
          return { ...doc.data(), id: doc.id };
        }),
        lastVisible: res[res.length - 1],
      };
    } catch (error) {
      throw error;
    }
  };
  const getMoreOrders = async (
    lastVisible,
    order = "timestamp",
    lim = 10,
    condition = null
  ) => {
    try {
      let docRef;
      if (condition == null) {
        docRef = query(
          collection(db, "orders"),
          orderBy(order),
          startAfter(lastVisible),
          limit(lim)
        );
      } else {
        docRef = query(
          collection(db, "orders"),
          orderBy(order),
          where(condition[0], condition[1], condition[2]),
          startAfter(lastVisible),
          limit(lim)
        );
      }
      const docSnap = await getDocs(docRef);
      let res = [];
      docSnap.forEach((doc) => {
        res.push(doc);
      });
      return {
        data: res.map((doc) => {
          return { ...doc.data(), id: doc.id };
        }),
        lastVisible: res[res.length - 1],
      };
    } catch (error) {
      throw error;
    }
  };
  const [categories, setCategories] = useState([]);
  const data = {
    db,
    addCategory,
    getCategories,
    categories,
    createGig,
    getGigs,
    updateGig,
    createOrder,
    getOrders,
    fetchGigDetails,
    editProfile,
    getUserProfile,
    fetchOrderDetails,
    updateOrder,
    deleteGig,
    deleteOrder,
    addToFirebaseArray,
    getMoreGigs,
    getMoreOrders,
    addNewProject,
    addMilestoneToProject,
    getAllProjects,
    getProjectDetails,
    approveClient,
    addSubCategory,
  };

  useEffect(() => {
    getCategories().then((res) => setCategories(res));
  }, []);

  return (
    <FirebaseContext.Provider value={data}>{children}</FirebaseContext.Provider>
  );
}

export default FirebaseProvider;
