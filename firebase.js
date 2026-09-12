// =========================================
// FIREBASE CONFIGURATION
// =========================================

// Firebase App
import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

// Firestore
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// =========================================
// FIREBASE CONFIG
// =========================================

const firebaseConfig = {

    apiKey:
        "AIzaSyBTGjmpUk_21vRazMncTdNGd1g0r1l20Bg",

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


// =========================================
// INITIALIZE FIREBASE
// =========================================

const app =
    initializeApp(firebaseConfig);


// =========================================
// INITIALIZE FIRESTORE
// =========================================

const db =
    getFirestore(app);


// =========================================
// SAVE SOS ALERT
// =========================================

export async function saveSOSAlert(
    latitude,
    longitude,
    message
) {

    try {

        const sosData = {

            latitude: latitude,

            longitude: longitude,

            message: message,

            status: "ACTIVE",

            createdAt:
                serverTimestamp()
        };


        const docRef =
            await addDoc(
                collection(
                    db,
                    "sosAlerts"
                ),
                sosData
            );


        console.log(
            "SOS Alert saved successfully:",
            docRef.id
        );


        return docRef.id;

    } catch (error) {

        console.error(
            "Error saving SOS Alert:",
            error
        );

        throw error;
    }
}
