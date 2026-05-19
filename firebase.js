import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5_NrjhylGgUQvXkgGPcxEB_LwwFugmHM",
  authDomain: "salary-management-app-ec716.firebaseapp.com",
  projectId: "salary-management-app-ec716",
  storageBucket: "salary-management-app-ec716.firebasestorage.app",
  messagingSenderId: "203299365522",
  appId: "1:203299365522:web:730c3adb91049259fe3c4b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);