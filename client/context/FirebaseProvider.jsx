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
} from "firebase/firestore";
import { UtilitiesContext } from "./UtilitiesProvider";

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
function FirebaseProvider({ children }) {
  const { makeToast } = useContext(UtilitiesContext);
  // firebase functions may be moved to another file later on
  const addCategory = async (newCategory) => {
    try {
      const docRef = await addDoc(collection(db, "categories"), {
        category: newCategory,
      });
      makeToast(
        "Firebase Success",
        `Successfully added new category with id ${docRef.id}`,
        "success"
      );
    } catch (error) {
      makeToast("Firebase Error", "Error adding new category", "error");
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
      makeToast(
        "Firebase Success",
        `Successfully got all categories`,
        "success"
      );
      return res;
    } catch (error) {
      makeToast("Firebase Error", "Error getting categories", "error");
    }
  };
  const createGig = async (
    ipfsHash,
    category,
    address,
    price,
    rating = 0,
    orderArray = []
  ) => {
    try {
      const docRef = await addDoc(collection(db, "gigs"), {
        ipfsHash,
        category,
        address,
        price,
        rating,
        orderArray,
        timestamp: Date.now(),
      });
      makeToast(
        "Firebase Success",
        `Successfully created new gig with id ${docRef.id}`,
        "success"
      );
    } catch (error) {
      makeToast("Firebase Error", "Error creating gig", "error");
    }
  };
  const updateGig = async (gigId, dataObject) => {
    try {
      const docRef = doc(db, "gigs", gigId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const firebaseRes = await updateDoc(docRef, dataObject);
        makeToast("Firebase Success", `Successfully updated gig`, "success");
        return firebaseRes;
      }
    } catch (error) {
      makeToast("Firebase Error", "Error updating Gig", "error");
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
      makeToast(
        "Firebase Success",
        `Successfully retrieved all gigs`,
        "success"
      );
      return res;
    } catch (error) {
      makeToast("Firebase Error", "Error getting gigs", "error");
    }
  };
  const createOrder = async (
    ipfsHash,
    category,
    address,
    budget,
    rating = 0,
    biddersArray = []
  ) => {
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ipfsHash,
        category,
        address,
        budget,
        rating,
        biddersArray,
        timestamp: Date.now(),
      });
      makeToast(
        "Firebase Success",
        `Successfully added new order with id ${docRef.id}`,
        "success"
      );
    } catch (error) {
      makeToast("Firebase Error", "Error creating order", "error");
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
      makeToast(
        "Firebase Success",
        `Successfully retrieved all orders`,
        "success"
      );
      return res;
    } catch (error) {
      makeToast("Firebase Error", "Error getting orders", "error");
    }
  };
  const fetchGigDetails = async (gigId) => {
    try {
      console.log("gigId:", gigId);
      const docRef = doc(db, "gigs", gigId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        makeToast(
          "Firebase Success",
          `Successfully fetched gig details`,
          "success"
        );
        return docSnap.data();
      } else {
        makeToast("Firebase Warning", `Document does not exist`, "warning");
        return {};
      }
    } catch (error) {
      makeToast("Firebase Error", "Error fetching gig details", "error");
    }
  };
  const editProfile = async (address, dataObject) => {
    try {
      const docRef = doc(db, "profiles", address);
      const docSnap = await getDoc(docRef);
      let firebaseRes;
      if (docSnap.exists()) {
        firebaseRes = await updateDoc(docRef, dataObject);
        makeToast(
          "Firebase Success",
          `Successfully updated profile`,
          "success"
        );
      } else {
        firebaseRes = await setDoc(docRef, {
          ...dataObject,
          clientRating: 0,
          sellerRating: 0,
          clientReviewers: [],
          sellerReviewers: [],
        });
        makeToast(
          "Firebase Success",
          `Successfully created new profile`,
          "success"
        );
      }
    } catch (error) {
      makeToast("Firebase Error", "Error editing profile", "error");
    }
  };
  const getUserProfile = async (address) => {
    try {
      const docRef = doc(db, "profiles", address);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        makeToast(
          "Firebase Success",
          `Successfully retrieved user profile`,
          "success"
        );
        return docSnap.data();
      } else {
        makeToast("Firebase Warning", `Document does not exist`, "warning");
        return {};
      }
    } catch (error) {
      makeToast("Firebase Error", "Error getting user profile", "error");
    }
  };
  const fetchOrderDetails = async (orderId) => {
    try {
      console.log("orderId:", orderId);
      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        makeToast(
          "Firebase Success",
          `Successfully fetched order details`,
          "success"
        );
        return docSnap.data();
      } else {
        makeToast("Firebase Warning", `Document does not exist`, "warning");
        return {};
      }
    } catch (error) {
      makeToast("Firebase Error", "Error fetching order details", "error");
    }
  };
  const updateOrder = async (orderId, dataObject) => {
    try {
      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const firebaseRes = await updateDoc(docRef, dataObject);
        makeToast("Firebase Success", `Successfully updated order`, "success");
        return firebaseRes;
      }
    } catch (error) {
      makeToast("Firebase Error", "Error updating order", "error");
    }
  };
  const deleteGig = async (gigId) => {
    try {
      const docRef = doc(db, "gigs", gigId);
      const res = await deleteDoc(docRef);
      makeToast("Firebase Success", `Successfully deleted gig`, "success");
      return res;
    } catch (error) {
      makeToast("Firebase Error", "Error deleting gig", "error");
    }
  };
  const deleteOrder = async (orderId) => {
    try {
      const docRef = doc(db, "orders", orderId);
      const res = await deleteDoc(docRef);
      makeToast("Firebase Success", `Successfully deleted order`, "success");
      return res;
    } catch (error) {
      makeToast("Firebase Error", "Error deleting order", "error");
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
  const getAllProjects = async (collection, gigOrderId, lim = 10) => {
    try {
      const docRef = query(
        collection(db, collection, gigOrderId, "projects"),
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
    orderId,
    arrayField,
    parameter
  ) => {
    try {
      const docRef = doc(db, collection, orderId);
      await updateDoc(docRef, {
        [arrayField]: arrayUnion(parameter),
      });
      makeToast(
        "Firebase Success",
        `Successfully added to ${arrayField} list`,
        "success"
      );
    } catch (error) {
      console.log(error);
      makeToast(
        "Firebase Error",
        `Error adding to ${arrayField} array`,
        "error"
      );
    }
  };
  const getMoreGigs = async (lastVisible) => {
    try {
      const docRef = query(
        collection(db, "gigs"),
        orderBy("rating"),
        startAfter(lastVisible),
        limit(25)
      );
      const docSnap = await getDocs(docRef);
      let res = [];
      docSnap.forEach((doc) => {
        res.push({ ...doc.data(), id: doc.id });
      });
      return res;
    } catch (error) {
      makeToast("Firebase Error", "Couldn't fetch more gigs", "error");
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
    addNewProject,
    addMilestoneToProject,
  };

  useEffect(() => {
    getCategories().then((res) => setCategories(res));
  }, []);

  return (
    <FirebaseContext.Provider value={data}>{children}</FirebaseContext.Provider>
  );
}

export default FirebaseProvider;
