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
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBTGjmpUk_21vRazMncTdNGd1g0r1l20Bg",
    authDomain: "emergency-sos-system-2717b.firebaseapp.com",
    projectId: "emergency-sos-system-2717b",
    storageBucket: "emergency-sos-system-2717b.firebasestorage.app",
    messagingSenderId: "831859323537",
    appId: "1:831859323537:web:deba3e348bc34414d48530"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


let currentUser = null;

onAuthStateChanged(auth, (user) => {
    currentUser = user;

    if (user) {
        console.log("User logged in:", user.uid);
    } else {
        console.log("No user logged in");
    }
});


export async function saveSOSAlert(
    latitude,
    longitude,
    message
) {
    try {

        const docRef = await addDoc(
            collection(db, "sosAlerts"),
            {
                userId: currentUser
                    ? currentUser.uid
                    : "guest",

                latitude: latitude,
                longitude: longitude,
                message: message,
                status: "EMERGENCY",
                createdAt: serverTimestamp()
            }
        );

        console.log(
            "SOS saved:",
            docRef.id
        );

        return docRef.id;

    } catch (error) {

        console.error(
            "SOS save error:",
            error
        );

        throw error;
    }
}


export {
    app,
    auth,
    db
};

console.log(
    "Firebase connected successfully!"
);
