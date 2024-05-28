// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6eT3UVz46-dDyRZp1Wi0XLx1mXjLt7Mk",
  authDomain: "homehive-a1589.firebaseapp.com",
  projectId: "homehive-a1589",
  storageBucket: "homehive-a1589.appspot.com",
  messagingSenderId: "507472290681",
  appId: "1:507472290681:web:14488e551f249e475085a8"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()