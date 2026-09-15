import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBTGjmpUk_21vRazMncTdNGd1g0r1l20Bg",
    authDomain: "emergency-sos-system-2717b.firebaseapp.com",
    projectId: "emergency-sos-system-2717b",
    storageBucket: "emergency-sos-system-2717b.firebasestorage.app",
    messagingSenderId: "831859323537",
    appId: "1:831859323537:web:82eedf7a92ac277ed48530",
    measurementId: "G-YJRFDFX3DT"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export async function saveSOSAlert(latitude, longitude) {

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

    console.log("SOS Alert ID:", docRef.id);

    return docRef.id;
}
