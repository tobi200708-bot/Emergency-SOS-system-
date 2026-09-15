/* =========================================
   EMERGENCY SOS SYSTEM
   SCRIPT.JS
========================================= */


/* =========================================
   YOUR WEBSITE URL
========================================= */

// IMPORTANT:
// Replace this with your GitHub Pages URL.

const websiteURL =
    "https://tobi200708-bot.github.io/Emergency-SOS-system-/";


/* =========================================
   ELEMENTS
========================================= */

const sosButton = document.getElementById("sosButton");
const status = document.getElementById("status");
const locationStatus = document.getElementById("locationStatus");
const generateQR = document.getElementById("generateQR");
const qrContainer = document.getElementById("qrcode");


/* =========================================
   GENERATE QR CODE
========================================= */

function createQRCode() {

    // Clear old QR
    qrContainer.innerHTML = "";

    new QRCode(qrContainer, {
        text: websiteURL,
        width: 220,
        height: 220,
        correctLevel: QRCode.CorrectLevel.H
    });

    status.textContent = "QR Code Generated ✓";
}


/* =========================================
   QR BUTTON
========================================= */

generateQR.addEventListener("click", () => {

    createQRCode();

});


/* =========================================
   AUTOMATIC QR GENERATION
========================================= */

window.addEventListener("load", () => {

    createQRCode();

});


/* =========================================
   SOS BUTTON
========================================= */

sosButton.addEventListener("click", () => {

    status.textContent = "Getting location...";
    locationStatus.textContent = "Location: Requesting permission...";


    if (!navigator.geolocation) {

        status.textContent =
            "Geolocation is not supported.";

        locationStatus.textContent =
            "Location unavailable.";

        return;
    }


    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            const mapsURL =
                `https://www.google.com/maps?q=${latitude},${longitude}`;


            locationStatus.innerHTML =
                `Location: <a href="${mapsURL}" target="_blank">
                View Location
                </a>`;


            status.textContent =
                "Emergency SOS Activated 🚨";


            /*
              Demo SMS link.

              This opens the phone's SMS application.
              The actual SMS sending requires an SMS
              service/backend.
            */

            const phoneNumber = "YOUR_EMERGENCY_NUMBER";

            const message =
                `EMERGENCY SOS ALERT!\n` +
                `I need help immediately.\n` +
                `My location:\n${mapsURL}`;


            const smsURL =
                `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;


            window.location.href = smsURL;

        },


        (error) => {

            status.textContent =
                "Unable to get location.";

            locationStatus.textContent =
                "Please allow location permission.";

            console.log(error);

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );

});
