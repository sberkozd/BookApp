import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyC80AXQNVJyo452VN6qIiFEtwUybJkOzZQ",
  authDomain: "bookapp-e7242.firebaseapp.com",
  projectId: "bookapp-e7242",
  storageBucket: "bookapp-e7242.appspot.com",
  messagingSenderId: "540105636915",
  appId: "1:540105636915:web:120180724df70805b63746",
  measurementId: "G-7TQCEKTFWC"
};

// Initialize Firebase app and Firestore database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
