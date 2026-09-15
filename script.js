/* =========================================
   EMERGENCY SOS SYSTEM
   SCRIPT.JS
========================================= */

import {
    saveSOSAlert
} from "./firebase.js";


/* =========================================
   ELEMENTS
========================================= */

const sosButton =
    document.getElementById("sosButton");

const status =
    document.getElementById("status");

const locationStatus =
    document.getElementById("locationStatus");

const mapLink =
    document.getElementById("mapLink");

const qrButton =
    document.getElementById("qrButton");

const qrCode =
    document.getElementById("qrcode");


/* =========================================
   EMERGENCY NUMBER
========================================= */

// உங்கள் emergency contact number இங்கே போடுங்கள்.
// Example:
// const emergencyNumber = "9876543210";

const emergencyNumber =
    "YOUR_EMERGENCY_NUMBER";


/* =========================================
   WEBSITE URL FOR QR
========================================= */

const websiteURL =
    "https://tobi200708-bot.github.io/Emergency-SOS-system-/";


/* =========================================
   GENERATE QR CODE
========================================= */

function generateQRCode() {

    qrCode.innerHTML = "";

    new QRCode(
        qrCode,
        {
            text: websiteURL,
            width: 220,
            height: 220,
            correctLevel:
                QRCode.CorrectLevel.H
        }
    );
}


/* =========================================
   QR BUTTON
========================================= */

qrButton.addEventListener(
    "click",
    generateQRCode
);


/* =========================================
   AUTO QR
========================================= */

window.addEventListener(
    "load",
    generateQRCode
);


/* =========================================
   SOS BUTTON
========================================= */

sosButton.addEventListener(
    "click",
    startSOS
);


/* =========================================
   START SOS
========================================= */

function startSOS() {

    status.textContent =
        "🚨 SOS ACTIVATED";

    locationStatus.textContent =
        "📍 Getting your location...";

    sosButton.disabled = true;


    if (!navigator.geolocation) {

        status.textContent =
            "GPS is not supported.";

        sosButton.disabled = false;

        return;
    }


    navigator.geolocation.getCurrentPosition(

        handleLocation,

        handleLocationError,

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );
}


/* =========================================
   LOCATION SUCCESS
========================================= */

async function handleLocation(position) {

    const latitude =
        position.coords.latitude;

    const longitude =
        position.coords.longitude;


    console.log(
        "Latitude:",
        latitude
    );

    console.log(
        "Longitude:",
        longitude
    );


    /* GOOGLE MAPS */

    const mapsURL =
        `https://www.google.com/maps?q=${latitude},${longitude}`;


    locationStatus.textContent =
        "📍 Location found successfully.";


    mapLink.href =
        mapsURL;

    mapLink.style.display =
        "inline-block";


    /* =====================================
       FIREBASE
    ===================================== */

    try {

        const alertID =
            await saveSOSAlert(
                latitude,
                longitude
            );


        console.log(
            "Firebase Alert ID:",
            alertID
        );


        status.textContent =
            "✅ Emergency Alert Saved";


    } catch (error) {

        console.error(error);

        status.textContent =
            "⚠️ Alert could not be saved.";
    }


    /* =====================================
       SMS
    ===================================== */

    sendSMS(
        mapsURL
    );


    sosButton.disabled =
        false;
}


/* =========================================
   SMS
========================================= */

function sendSMS(mapsURL) {

    if (
        emergencyNumber ===
        "YOUR_EMERGENCY_NUMBER"
    ) {

        console.log(
            "Please add emergency number."
        );

        return;
    }


    const message =
        `🚨 EMERGENCY SOS ALERT!\n\n` +
        `I need help immediately.\n\n` +
        `My current location:\n` +
        `${mapsURL}`;


    const smsURL =
        `sms:${emergencyNumber}` +
        `?body=${encodeURIComponent(message)}`;


    window.location.href =
        smsURL;
}


/* =========================================
   LOCATION ERROR
========================================= */

function handleLocationError(error) {

    console.error(
        "Location Error:",
        error
    );


    sosButton.disabled =
        false;


    if (error.code === 1) {

        status.textContent =
            "❌ Location permission denied.";

        locationStatus.textContent =
            "Please allow location permission.";

    } else if (error.code === 2) {

        status.textContent =
            "❌ Location unavailable.";

        locationStatus.textContent =
            "Please turn ON GPS.";

    } else if (error.code === 3) {

        status.textContent =
            "❌ Location timeout.";

        locationStatus.textContent =
            "Try again.";

    } else {

        status.textContent =
            "❌ Location error.";
    }
}
