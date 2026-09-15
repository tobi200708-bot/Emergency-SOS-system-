import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain:
        "emergency-sos-system-2717b.firebaseapp.com",

    projectId:
        "emergency-sos-system-2717b.firebaseapp.com".replace(
            ".firebaseapp.com",
            ""
        ),

    storageBucket:
        "emergency-sos-system-2717b.firebasestorage.app",

    messagingSenderId:
        "831859323537",

    appId: "YOUR_APP_ID",

    measurementId:
        "G-T8V9F5B3Q8"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


let currentUser = null;

onAuthStateChanged(auth, (user) => {
    currentUser = user;
});


signInAnonymously(auth)
    .then(() => {
        console.log("Firebase login successful");
    })
    .catch((error) => {
        console.error("Firebase login error:", error);
    });


export async function saveAutomaticAlert(
    latitude,
    longitude,
    accuracy,
    acceleration
) {

    const alert = {

        type: "AUTOMATIC_SOS",

        status: "ACTIVE",

        source: "MOTION_SENSOR",

        message:
            "Emergency detected automatically by device sensor.",

        userId:
            currentUser
                ? currentUser.uid
                : "anonymous",

        location: {

            latitude: latitude ?? null,

            longitude: longitude ?? null,

            accuracy: accuracy ?? null
        },

        sensor: {

            acceleration:
                acceleration ?? null
        },

        createdAt:
            serverTimestamp()
    };


    const result = await addDoc(
        collection(db, "emergencyAlerts"),
        alert
    );


    return result.id;
}


export async function saveManualAlert(
    latitude,
    longitude,
    accuracy
) {

    const alert = {

        type: "MANUAL_SOS",

        status: "ACTIVE",

        source: "SOS_BUTTON",

        message:
            "Emergency SOS activated manually.",

        userId:
            currentUser
                ? currentUser.uid
                : "anonymous",

        location: {

            latitude: latitude ?? null,

            longitude: longitude ?? null,

            accuracy: accuracy ?? null
        },

        createdAt:
            serverTimestamp()
    };


    const result = await addDoc(
        collection(db, "emergencyAlerts"),
        alert
    );


    return result.id;
}
