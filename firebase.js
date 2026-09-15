/* =========================================
   FIREBASE.JS
   EMERGENCY SOS SYSTEM
========================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* =========================================
   FIREBASE CONFIG
========================================= */

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain:
        "emergency-sos-system-2717b.firebaseapp.com",

    projectId:
        "emergency-sos-system-2717b",

    storageBucket:
        "emergency-sos-system-2717b.firebasestorage.app",

    messagingSenderId:
        "831859323537",

    appId:
        "YOUR_APP_ID"

};


/* =========================================
   INITIALIZE FIREBASE
========================================= */

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


/* =========================================
   SAVE SOS ALERT
========================================= */

export async function saveSOSAlert(
    latitude,
    longitude
) {

    try {

        const alertData = {

            type: "SOS",

            status: "ACTIVE",

            latitude: latitude,

            longitude: longitude,

            location:
                `https://www.google.com/maps?q=${latitude},${longitude}`,

            message:
                "Emergency SOS activated",

            createdAt:
                serverTimestamp()

        };


        const docRef =
            await addDoc(
                collection(db, "emergencyAlerts"),
                alertData
            );


        console.log(
            "SOS Alert saved:",
            docRef.id
        );


        return docRef.id;

    }

    catch (error) {

        console.error(
            "Firebase error:",
            error
        );

        throw error;

    }

}
