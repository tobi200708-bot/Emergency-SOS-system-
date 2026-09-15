import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "PASTE_YOUR_API_KEY",

    authDomain:
        "emergency-sos-system-2717b.firebaseapp.com",

    projectId:
        "emergency-sos-system-2717b",

    storageBucket:
        "emergency-sos-system-2717b.firebasestorage.app",

    messagingSenderId:
        "831859323537",

    appId: "PASTE_YOUR_APP_ID"

};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export async function saveSOSAlert(
    latitude,
    longitude
) {

    const mapURL =
        `https://www.google.com/maps?q=${latitude},${longitude}`;

    const alertData = {

        type: "SOS",

        status: "ACTIVE",

        latitude: latitude,

        longitude: longitude,

        mapURL: mapURL,

        message: "Emergency SOS activated",

        createdAt: serverTimestamp()

    };


    const docRef = await addDoc(
        collection(db, "emergencyAlerts"),
        alertData
    );

    console.log(
        "SOS Alert ID:",
        docRef.id
    );

    return docRef.id;
}
