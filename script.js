/* =========================================
   EMERGENCY SOS SYSTEM
   SCRIPT.JS
========================================= */

import { saveSOSAlert } from "./firebase.js";


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const sosButton = document.getElementById("sosButton");
    const emergencyButton = document.getElementById("emergencyButton");

    const statusMessage = document.getElementById("statusMessage");
    const locationStatus = document.getElementById("locationStatus");

    const contactName = document.getElementById("contactName");
    const contactPhone = document.getElementById("contactPhone");

    const saveContactButton =
        document.getElementById("saveContactButton");

    const contactStatus =
        document.getElementById("contactStatus");


    /* =====================================
       CHECK HTML
    ===================================== */

    if (!sosButton) {
        console.error("SOS button not found!");
        return;
    }

    console.log("Emergency SOS System loaded.");


    /* =====================================
       EMERGENCY CONTACT
    ===================================== */

    let emergencyContact = {
        name: "",
        phone: ""
    };


    /* =====================================
       LOAD SAVED CONTACT
    ===================================== */

    function loadContact() {

        const saved =
            localStorage.getItem("emergencyContact");

        if (!saved) return;

        try {

            emergencyContact = JSON.parse(saved);

            if (contactName) {
                contactName.value =
                    emergencyContact.name || "";
            }

            if (contactPhone) {
                contactPhone.value =
                    emergencyContact.phone || "";
            }

        } catch (error) {

            console.error("Contact loading error:", error);

        }
    }


    /* =====================================
       SAVE CONTACT
    ===================================== */

    if (saveContactButton) {

        saveContactButton.addEventListener("click", () => {

            const name =
                contactName?.value.trim() || "";

            const phone =
                contactPhone?.value.trim() || "";


            if (!name || !phone) {

                if (contactStatus) {

                    contactStatus.textContent =
                        "Please enter contact name and phone number.";

                    contactStatus.style.color = "#f87171";
                }

                return;
            }


            emergencyContact = {
                name: name,
                phone: phone
            };


            localStorage.setItem(
                "emergencyContact",
                JSON.stringify(emergencyContact)
            );


            if (contactStatus) {

                contactStatus.textContent =
                    "Emergency contact saved successfully.";

                contactStatus.style.color = "#86efac";
            }

        });
    }


    /* =====================================
       GET CURRENT LOCATION
    ===================================== */

    function getCurrentLocation() {

        return new Promise((resolve, reject) => {

            if (!navigator.geolocation) {

                reject(
                    new Error(
                        "Geolocation is not supported by this browser."
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

        });
    }


    /* =====================================
       GOOGLE MAP LINK
    ===================================== */

    function createMapLink(latitude, longitude) {

        return (
            "https://www.google.com/maps?q=" +
            latitude +
            "," +
            longitude
        );
    }


    /* =====================================
       SOS MESSAGE
    ===================================== */

    function createSOSMessage(latitude, longitude) {

        const mapLink =
            createMapLink(latitude, longitude);

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

        console.log("SOS BUTTON CLICKED");


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

            /* GET LOCATION */

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


            /* LOCATION STATUS */

            if (locationStatus) {

                locationStatus.textContent =
                    "Available";
            }


            /* CREATE MESSAGE */

            const message =
                createSOSMessage(
                    latitude,
                    longitude
                );


            /* FIREBASE */

            try {

                await saveSOSAlert(
                    latitude,
                    longitude,
                    message
                );

                console.log(
                    "SOS saved to Firebase."
                );

            } catch (firebaseError) {

                console.error(
                    "Firebase error:",
                    firebaseError
                );

            }


            /* SUCCESS */

            sosButton.textContent =
                "🚨 SOS READY";


            if (statusMessage) {

                statusMessage.innerHTML =
                    "🚨 <strong>SOS prepared successfully!</strong><br>" +
                    "Location captured.";
            }


            /* SHOW SOS OPTIONS */

            showSOSOptions(
                message,
                latitude,
                longitude
            );


        } catch (error) {

            console.error(
                "Location error:",
                error
            );


            if (locationStatus) {

                locationStatus.textContent =
                    "Unavailable";
            }


            if (statusMessage) {

                statusMessage.innerHTML =
                    "❌ Unable to get location.<br>" +
                    "Please allow location permission.";
            }


            sosButton.textContent =
                "🚨 SEND SOS";
        }


        /* ENABLE BUTTON */

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


        /* CONTACT CHECK */

        if (
            !emergencyContact.phone
        ) {

            const openMap =
                confirm(
                    "🚨 SOS LOCATION READY!\n\n" +
                    "Your location was captured.\n\n" +
                    "No emergency contact is saved.\n\n" +
                    "Open Google Maps?"
                );


            if (openMap) {

                window.open(
                    mapLink,
                    "_blank"
                );
            }


            return;
        }


        /* SEND SMS */

        const sendSMS =
            confirm(
                "🚨 EMERGENCY SOS\n\n" +
                "Location captured successfully.\n\n" +
                "Send SOS message
