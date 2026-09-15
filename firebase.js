/* =========================================
   EMERGENCY SOS SYSTEM - FIREBASE.JS
========================================= */

import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    limit,
    onSnapshot
} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* =========================================
   FIREBASE CONFIG
========================================= */

const firebaseConfig = {

    apiKey: "AIzaSyBTGjmpUk_21vRazMncTdNGd1g0r1l20Bg",

    authDomain:
        "emergency-sos-system-2717b.firebaseapp.com",

    projectId:
        "emergency-sos-system-2717b",

    storageBucket:
        "emergency-sos-system-2717b.firebasestorage.app",

    messagingSenderId:
        "831859323537",

    appId:
        "1:831859323537:web:8627060a5cda348fd48530",

    measurementId:
        "G-FXQ7W4Z1Z3"
};


/* =========================================
   INITIALIZE FIREBASE
========================================= */

const app = initializeApp(firebaseConfig);


/* =========================================
   AUTH
========================================= */

const auth = getAuth(app);


/* =========================================
   FIRESTORE
========================================= */

const db = getFirestore(app);


/* =========================================
   CURRENT USER
========================================= */

let currentUser = null;

onAuthStateChanged(auth, (user) => {

    currentUser = user || null;

    window.firebaseUser = currentUser;

    if (currentUser) {

        console.log("✅ User logged in:", currentUser.email);

    } else {

        console.log("ℹ️ No user logged in");

    }

});


/* =========================================
   MAKE FIREBASE AVAILABLE
========================================= */

window.firebaseDB = db;

window.firebaseAuth = auth;

window.firebaseFunctions = {

    collection,
    addDoc,
    serverTimestamp,

    query,
    orderBy,
    limit,
    onSnapshot

};


console.log("✅ Firebase initialized successfully");
