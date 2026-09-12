/* =========================================
   EMERGENCY SOS SYSTEM
   FIREBASE.JS
========================================= */

import { initializeApp }
    from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
}
    from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp
}
    from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* =========================================
   FIREBASE CONFIGURATION
========================================= */

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain:
        "YOUR_PROJECT_ID.firebaseapp.com",

    projectId:
        "YOUR_PROJECT_ID",

    storageBucket:
        "YOUR_PROJECT_ID.firebasestorage.app",

    messagingSenderId:
        "YOUR_MESSAGING_SENDER_ID",

    appId:
        "YOUR_APP_ID"
};


/* =========================================
   INITIALIZE FIREBASE
========================================= */

const app =
    initializeApp(firebaseConfig);


/* =========================================
   FIREBASE AUTHENTICATION
========================================= */

const auth =
    getAuth(app);


/* =========================================
   FIRESTORE DATABASE
========================================= */

const db =
    getFirestore(app);


/* =========================================
   AUTH STATE
========================================= */

let currentUser = null;

onAuthStateChanged(
    auth,
    function (user) {

        if (user) {

            currentUser = user;

            console.log(
                "User logged in:",
                user.uid
            );

        } else {

            currentUser = null;

            console.log(
                "No user logged in."
            );
        }
    }
);


/* =========================================
   SAVE SOS ALERT
========================================= */

export async function saveSOSAlert(
    latitude,
    longitude,
    message
) {

    try {

        const sosData = {

            userId:
                currentUser
                    ? currentUser.uid
                    : "guest",

            userEmail:
                currentUser
                    ? currentUser.email
                    : "",

            latitude:
                latitude,

            longitude:
                longitude,

            message:
                message,

            status:
                "EMERGENCY",

            createdAt:
                serverTimestamp()
        };


        const document =
            await addDoc(
                collection(
                    db,
                    "sosAlerts"
                ),
                sosData
            );


        console.log(
            "SOS alert saved:",
            document.id
        );


        return document.id;

    } catch (error) {

        console.error(
            "Error saving SOS alert:",
            error
        );

        throw error;
    }
}


/* =========================================
   SAVE EMERGENCY CONTACT
========================================= */

export async function saveEmergencyContact(
    name,
    phone
) {

    try {

        const contactData = {

            userId:
                currentUser
                    ? currentUser.uid
                    : "guest",

            name:
                name,

            phone:
                phone,

            createdAt:
                serverTimestamp()
        };


        const document =
            await addDoc(
                collection(
                    db,
                    "emergencyContacts"
                ),
                contactData
            );


        console.log(
            "Emergency contact saved:",
            document.id
        );


        return document.id;

    } catch (error) {

        console.error(
            "Error saving contact:",
            error
        );

        throw error;
    }
}


/* =========================================
   GET USER SOS ALERTS
========================================= */

export async function getUserSOSAlerts() {

    try {

        if (!currentUser) {

            console.log(
                "User is not logged in."
            );

            return [];
        }


        const alertsQuery =
            query(
                collection(
                    db,
                    "sosAlerts"
                ),

                where(
                    "userId",
                    "==",
                    currentUser.uid
                )
            );


        const snapshot =
            await getDocs(
                alertsQuery
            );


        const alerts = [];


        snapshot.forEach(
            function (doc) {

                alerts.push({

                    id:
                        doc.id,

                    ...doc.data()

                });

            }
        );


        return alerts;

    } catch (error) {

        console.error(
            "Error getting SOS alerts:",
            error
        );

        return [];
    }
}


/* =========================================
   GET USER EMERGENCY CONTACTS
========================================= */

export async function getEmergencyContacts() {

    try {

        if (!currentUser) {

            return [];
        }


        const contactsQuery =
            query(
                collection(
                    db,
                    "emergencyContacts"
                ),

                where(
                    "userId",
                    "==",
                    currentUser.uid
                )
            );


        const snapshot =
            await getDocs(
                contactsQuery
            );


        const contacts = [];


        snapshot.forEach(
            function (doc) {

                contacts.push({

                    id:
                        doc.id,

                    ...doc.data()

                });

            }
        );


        return contacts;

    } catch (error) {

        console.error(
            "Error getting contacts:",
            error
        );

        return [];
    }
}


/* =========================================
   EXPORT FIREBASE OBJECTS
========================================= */

export {
    app,
    auth,
    db,
    currentUser
};


console.log(
    "🔥 Emergency SOS Firebase initialized successfully."
);
