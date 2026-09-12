/* =========================================
   EMERGENCY SOS SYSTEM
   SCRIPT.JS
========================================= */

import { saveSOSAlert } from "./firebase.js";


/* =========================================
   GET HTML ELEMENTS
========================================= */

const sosButton = document.getElementById("sosButton");
const emergencyButton = document.getElementById("emergencyButton");

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


/* =========================================
   EMERGENCY CONTACT
========================================= */

let emergencyContact = {
    name: "",
    phone: ""
};


/* =========================================
   LOAD SAVED CONTACT
========================================= */

function loadContact() {

    const savedContact =
        localStorage.getItem("emergencyContact");

    if (savedContact) {

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
                "Unable to load contact:",
                error
            );

        }
    }
}


/* =========================================
   SAVE EMERGENCY CONTACT
========================================= */

if (saveContactButton) {

    saveContactButton.addEventListener(
        "click",
        function () {

            const name =
                contactName.value.trim();

            const phone =
                contactPhone.value.trim();

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
                JSON.stringify(emergencyContact)
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


/* =========================================
   GET CURRENT LOCATION
========================================= */

function getCurrentLocation() {

    return new Promise(
        function (resolve, reject) {

            if (!navigator.geolocation) {

                reject(
                    new Error(
                        "Geolocation is not supported."
                    )
                );

                return;
            }

            navigator.geolocation.getCurrentPosition(

                function (position) {

                    resolve({
                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude
                    });
                },

                function (error) {

                    reject(error);

                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        }
    );
}


/* =========================================
   GOOGLE MAPS LINK
========================================= */

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


/* =========================================
   CREATE SOS MESSAGE
========================================= */

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
        "EMERGENCY SOS ALERT!\n\n" +
        "I need emergency assistance.\n" +
        "My current location:\n" +
        mapLink
    );
}


/* =========================================
   SEND SOS
========================================= */

async function sendSOS() {

    if (sosButton) {

        sosButton.disabled = true;

        sosButton.classList.add(
            "sos-active"
        );

        sosButton.textContent =
            "📍 GETTING LOCATION...";
    }

    if (statusMessage) {

        statusMessage.textContent =
            "Getting your current location...";
    }

    if (locationStatus) {

        locationStatus.textContent =
            "Finding...";
    }


    try {

        /* GET GPS LOCATION */

        const location =
            await getCurrentLocation();

        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        /* UPDATE LOCATION STATUS */

        if (locationStatus) {

            locationStatus.textContent =
                "Available";
        }


        /* CREATE SOS MESSAGE */

        const message =
            createSOSMessage(
                latitude,
                longitude
            );


        /* SAVE TO FIREBASE */

        try {

            await saveSOSAlert(
                latitude,
                longitude,
                message
            );

            console.log(
                "SOS alert saved to Firebase."
            );

        } catch (firebaseError) {

            console.error(
                "Firebase save error:",
                firebaseError
            );

        }


        /* UPDATE BUTTON */

        if (sosButton) {

            sosButton.textContent =
                "🚨 SOS READY";
        }


        /* SHOW STATUS */

        if (statusMessage) {

            statusMessage.innerHTML =
                "🚨 <strong>Emergency SOS prepared.</strong><br>" +
                "Location captured successfully.";
        }


        /* SHOW OPTIONS */

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

            statusMessage.textContent =
                "Unable to get your location. Please allow location permission.";
        }


        if (sosButton) {

            sosButton.textContent =
                "🚨 SEND SOS";
        }

    } finally {

        if (sosButton) {

            sosButton.disabled = false;

            setTimeout(
                function () {

                    sosButton.classList.remove(
                        "sos-active"
                    );

                },
                1500
            );
        }
    }
}


/* =========================================
   SHOW SOS OPTIONS
========================================= */

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

    const contact =
        emergencyContact;

    let contactText =
        "No emergency contact saved.";

    if (
        contact.name &&
        contact.phone
    ) {

        contactText =
            "Contact: " +
            contact.name +
            "\nPhone: " +
            contact.phone;
    }


    /* OPEN MAP */

    const userConfirmed =
        confirm(
            "🚨 EMERGENCY SOS\n\n" +
            "Your location has been captured.\n\n" +
            contactText +
            "\n\n" +
            "Open your emergency location?"
        );


    if (userConfirmed) {

        window.open(
            mapLink,
            "_blank"
        );
    }


    /* SEND SMS */

    if (
        contact.phone &&
        userConfirmed
    ) {

        const sendSMS =
            confirm(
                "Send the SOS message through SMS?"
            );

        if (sendSMS) {

            sendSMSMessage(
                contact.phone,
                message
            );
        }
    }
}


/* =========================================
   SEND SMS
========================================= */

function sendSMSMessage(
    phoneNumber,
    message
) {

    const smsURL =
        "sms:" +
        encodeURIComponent(phoneNumber) +
        "?body=" +
        encodeURIComponent(message);

    window.location.href =
        smsURL;
}


/* =========================================
   EMERGENCY BUTTON
========================================= */

if (emergencyButton) {

    emergencyButton.addEventListener(
        "click",
        function () {

            sendSOS();

        }
    );
}


/* =========================================
   MAIN SOS BUTTON
========================================= */

if (sosButton) {

    sosButton.addEventListener(
        "click",
        function () {

            sendSOS();

        }
    );
}


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadContact();

        console.log(
            "Emergency SOS System loaded successfully."
        );

    }
);
function sendSMS() {
    const phone = localStorage.getItem("emergencyPhone");

    if (!phone) {
        alert("Please save emergency contact number first.");
        return;
    }

    const message =
        "🚨 EMERGENCY SOS\n" +
        "I need help immediately.\n" +
        "My emergency location has been captured.";

    const smsURL =
        "sms:" + phone + "?body=" + encodeURIComponent(message);

    window.location.href = smsURL;
}
