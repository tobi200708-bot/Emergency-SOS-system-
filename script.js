/* =========================================
   EMERGENCY SOS SYSTEM
   SCRIPT.JS
========================================= */

import { saveSOSAlert } from "./firebase.js";


/* =========================================
   PAGE START
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       GET HTML ELEMENTS
    ===================================== */

    const sosButton =
        document.getElementById("sosButton");

    const emergencyButton =
        document.getElementById("emergencyButton");

    const statusMessage =
        document.getElementById("statusMessage");

    const locationStatus =
        document.getElementById("locationStatus");

    const contactName =
        document.getElementById("contactName");

    const contactPhone =
        document.getElementById("contactPhone");

    const saveContactButton =
        document.getElementById("saveContactButton");

    const contactStatus =
        document.getElementById("contactStatus");


    /* =====================================
       CHECK SOS BUTTON
    ===================================== */

    if (!sosButton) {

        console.error(
            "ERROR: sosButton not found in index.html"
        );

        return;
    }


    console.log(
        "Emergency SOS System loaded successfully."
    );


    /* =====================================
       EMERGENCY CONTACT
    ===================================== */

    let emergencyContact = {
        name: "",
        phone: ""
    };


    /* =====================================
       LOAD CONTACT
    ===================================== */

    function loadContact() {

        const savedContact =
            localStorage.getItem(
                "emergencyContact"
            );

        if (!savedContact) {
            return;
        }

        try {

            emergencyContact =
                JSON.parse(savedContact);

            if (contactName) {

                contactName.value =
                    emergencyContact.name || "";
            }

            if (contactPhone) {

                contactPhone.value =
                    emergencyContact.phone || "";
            }

        } catch (error) {

            console.error(
                "Contact loading error:",
                error
            );
        }
    }


    /* =====================================
       SAVE CONTACT
    ===================================== */

    if (saveContactButton) {

        saveContactButton.addEventListener(
            "click",
            () => {

                const name =
                    contactName
                        ? contactName.value.trim()
                        : "";

                const phone =
                    contactPhone
                        ? contactPhone.value.trim()
                        : "";


                if (!name || !phone) {

                    if (contactStatus) {

                        contactStatus.textContent =
                            "Please enter contact name and phone number.";

                        contactStatus.style.color =
                            "#f87171";
                    }

                    return;
                }


                emergencyContact = {
                    name: name,
                    phone: phone
                };


                localStorage.setItem(
                    "emergencyContact",
                    JSON.stringify(
                        emergencyContact
                    )
                );


                if (contactStatus) {

                    contactStatus.textContent =
                        "Emergency contact saved successfully.";

                    contactStatus.style.color =
                        "#86efac";
                }

            }
        );
    }


    /* =====================================
       GET CURRENT LOCATION
    ===================================== */

    function getCurrentLocation() {

        return new Promise(
            (resolve, reject) => {

                if (!navigator.geolocation) {

                    reject(
                        new Error(
                            "Geolocation is not supported."
                        )
                    );

                    return;
                }


                navigator.geolocation.getCurrentPosition(

                    (position) => {

                        resolve({

                            latitude:
                                position.coords.latitude,

                            longitude:
                                position.coords.longitude

                        });

                    },

                    (error) => {

                        reject(error);

                    },

                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 0
                    }
                );
            }
        );
    }


    /* =====================================
       CREATE GOOGLE MAP LINK
    ===================================== */

    function createMapLink(
        latitude,
        longitude
    ) {

        return (
            "https://www.google.com/maps?q=" +
            latitude +
            "," +
            longitude
        );
    }


    /* =====================================
       CREATE SOS MESSAGE
    ===================================== */

    function createSOSMessage(
        latitude,
        longitude
    ) {

        const mapLink =
            createMapLink(
                latitude,
                longitude
            );

        return (
            "🚨 EMERGENCY SOS ALERT!\n\n" +
            "I need emergency assistance.\n\n" +
            "My current location:\n" +
            mapLink
        );
    }


    /* =====================================
       SEND SOS
    ===================================== */

    async function sendSOS() {

        console.log(
            "SEND SOS button clicked."
        );


        /* BUTTON */

        sosButton.disabled = true;

        sosButton.textContent =
            "📍 GETTING LOCATION...";


        /* STATUS */

        if (statusMessage) {

            statusMessage.textContent =
                "Getting your current location...";
        }


        if (locationStatus) {

            locationStatus.textContent =
                "Finding...";
        }


        try {

            /* =============================
               GET LOCATION
            ============================= */

            const location =
                await getCurrentLocation();


            const latitude =
                location.latitude;

            const longitude =
                location.longitude;


            console.log(
                "Location:",
                latitude,
                longitude
            );


            /* =============================
               LOCATION STATUS
            ============================= */

            if (locationStatus) {

                locationStatus.textContent =
                    "Available";
            }


            /* =============================
               CREATE MESSAGE
            ============================= */

            const message =
                createSOSMessage(
                    latitude,
                    longitude
                );


            /* =============================
               FIREBASE
            ============================= */

            try {

                await saveSOSAlert(
                    latitude,
                    longitude,
                    message
                );

                console.log(
                    "SOS saved to Firebase successfully."
                );

            } catch (firebaseError) {

                console.error(
                    "Firebase Error:",
                    firebaseError
                );

                if (statusMessage) {

                    statusMessage.innerHTML =
                        "⚠️ Location captured, but Firebase save failed.<br>" +
                        "Please check Firestore rules.";
                }
            }


            /* =============================
               SUCCESS
            ============================= */

            sosButton.textContent =
                "🚨 SOS READY";


            if (statusMessage) {

                statusMessage.innerHTML =
                    "🚨 <strong>Emergency SOS prepared.</strong><br>" +
                    "Location captured successfully.";
            }


            /* =============================
               SHOW OPTIONS
            ============================= */

            showSOSOptions(
                message,
                latitude,
                longitude
            );

        } catch (error) {

            console.error(
                "Location Error:",
                error
            );


            if (locationStatus) {

                locationStatus.textContent =
                    "Unavailable";
            }


            if (statusMessage) {

                statusMessage.innerHTML =
                    "❌ Unable to get your location.<br>" +
                    "Please allow location permission.";
            }


            sosButton.textContent =
                "🚨 SEND SOS";
        }


        /* =============================
           ENABLE BUTTON
        ============================= */

        sosButton.disabled = false;

    }


    /* =====================================
       SHOW SOS OPTIONS
    ===================================== */

    function showSOSOptions(
        message,
        latitude,
        longitude
    ) {

        const mapLink =
            createMapLink(
                latitude,
                longitude
            );


        let contactText =
            "No emergency contact saved.";


        if (
            emergencyContact.name &&
            emergencyContact.phone
        ) {

            contactText =
                "Contact: " +
                emergencyContact.name +
                "\nPhone: " +
                emergencyContact.phone;
        }


        /* =============================
           OPEN MAP
        ============================= */

        const openMap =
            confirm(
                "🚨 EMERGENCY SOS\n\n" +
                "Your location has been captured.\n\n" +
                contactText +
                "\n\n" +
                "Open your emergency location?"
            );


        if (openMap) {

            window.open(
                mapLink,
                "_blank"
            );
        }


        /* =============================
           SEND SMS
        ============================= */

        if (emergencyContact.phone) {

            const sendSMS =
                confirm(
                    "🚨 Send SOS message through SMS?"
                );


            if (sendSMS) {

                sendSMSMessage(
                    emergencyContact.phone,
                    message
                );
            }

        } else {

            alert(
                "Please save an emergency contact number first."
            );
        }
    }


    /* =====================================
       SEND SMS
    ===================================== */

    function sendSMSMessage(
        phoneNumber,
        message
    ) {

        const phone =
            phoneNumber.trim();


        const smsURL =
            "sms:" +
            phone +
            "?body=" +
            encodeURIComponent(message);


        window.location.href =
            smsURL;
    }


    /* =====================================
       MAIN SOS BUTTON
    ===================================== */

    sosButton.addEventListener(
        "click",
        sendSOS
    );


    /* =====================================
       EMERGENCY BUTTON
    ===================================== */

    if (emergencyButton) {

        emergencyButton.addEventListener(
            "click",
            sendSOS
        );
    }


    /* =====================================
       LOAD SAVED CONTACT
    ===================================== */

    loadContact();

});
