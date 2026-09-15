/* =========================================
   SCRIPT.JS
   AUTOMATIC EMERGENCY SOS
========================================= */

import {
    saveAutomaticAlert,
    saveManualAlert
} from "./firebase.js";


/* =========================================
   VARIABLES
========================================= */

let protectionActive = false;

let sensorRunning = false;

let alertAlreadySent = false;

let lastAlertTime = 0;


/*
   Change this value carefully.

   Higher = harder to trigger.
   Lower = easier to trigger.
*/
const FALL_THRESHOLD = 25;


/* =========================================
   HTML ELEMENTS
========================================= */

const startSensorBtn =
    document.getElementById("startSensorBtn");

const manualSOS =
    document.getElementById("manualSOS");

const systemStatus =
    document.getElementById("systemStatus");

const sensorStatus =
    document.getElementById("sensorStatus");

const locationStatus =
    document.getElementById("locationStatus");

const message =
    document.getElementById("message");

const acceleration =
    document.getElementById("acceleration");

const xValue =
    document.getElementById("xValue");

const yValue =
    document.getElementById("yValue");

const zValue =
    document.getElementById("zValue");

const alertBox =
    document.getElementById("alertBox");


/* =========================================
   START AUTOMATIC PROTECTION
========================================= */

startSensorBtn.addEventListener(
    "click",
    async () => {

        try {

            /*
              Android/iPhone may require permission
              for motion sensors.
            */

            if (
                typeof DeviceMotionEvent !==
                "undefined" &&
                typeof DeviceMotionEvent
                    .requestPermission ===
                    "function"
            ) {

                const permission =
                    await DeviceMotionEvent
                        .requestPermission();

                if (permission !== "granted") {

                    message.textContent =
                        "Motion sensor permission denied.";

                    return;
                }
            }


            protectionActive = true;

            sensorRunning = true;

            alertAlreadySent = false;


            systemStatus.textContent =
                "ACTIVE";

            sensorStatus.textContent =
                "ON";

            startSensorBtn.textContent =
                "Protection Active ✓";

            message.textContent =
                "Automatic protection started.";


            /*
              Get current location permission
            */

            getLocation();


            /*
              Start motion sensor
            */

            window.addEventListener(
                "devicemotion",
                handleMotion
            );

        }

        catch (error) {

            console.error(error);

            message.textContent =
                "Unable to start sensor.";
        }

    }
);


/* =========================================
   MOTION SENSOR
========================================= */

function handleMotion(event) {

    if (!protectionActive) {
        return;
    }


    const acc =
        event.accelerationIncludingGravity;


    if (!acc) {
        return;
    }


    const x = acc.x || 0;

    const y = acc.y || 0;

    const z = acc.z || 0;


    /*
      Calculate total acceleration
    */

    const total =
        Math.sqrt(
            x * x +
            y * y +
            z * z
        );


    /*
      Show sensor values
    */

    xValue.textContent =
        x.toFixed(2);

    yValue.textContent =
        y.toFixed(2);

    zValue.textContent =
        z.toFixed(2);

    acceleration.textContent =
        total.toFixed(2);


    /*
      Automatic emergency detection
    */

    if (
        total >= FALL_THRESHOLD &&
        !alertAlreadySent
    ) {

        const now =
            Date.now();


        /*
          Prevent repeated alerts
        */

        if (
            now - lastAlertTime >
            30000
        ) {

            lastAlertTime = now;

            triggerAutomaticSOS();
        }
    }

}


/* =========================================
   AUTOMATIC SOS
========================================= */

async function triggerAutomaticSOS() {

    if (alertAlreadySent) {
        return;
    }


    alertAlreadySent = true;


    systemStatus.textContent =
        "EMERGENCY DETECTED";


    alertBox.textContent =
        "🚨 EMERGENCY DETECTED";


    alertBox.style.background =
        "#d71931";


    message.textContent =
        "Sending automatic emergency alert...";


    /*
      Get location
    */

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const accuracy =
                position.coords.accuracy;


            locationStatus.textContent =
                "Location Ready";


            try {

                await saveAutomaticAlert(
                    latitude,
                    longitude,
                    accuracy
                );


                message.textContent =
                    "🚨 Automatic emergency alert sent successfully.";

            }

            catch (error) {

                message.textContent =
                    "Emergency detected, but Firebase save failed.";

                console.error(error);
            }

        },

        async (error) => {

            console.error(error);


            try {

                await saveAutomaticAlert();

                message.textContent =
                    "🚨 Alert sent without location.";

            }

            catch (firebaseError) {

                console.error(
                    firebaseError
                );

                message.textContent =
                    "Alert could not be saved.";
            }

        },

        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}


/* =========================================
   MANUAL SOS BUTTON
========================================= */

manualSOS.addEventListener(
    "click",
    async () => {

        manualSOS.disabled = true;

        manualSOS.textContent =
            "SENDING...";


        getLocationForManualSOS();

    }
);


/* =========================================
   MANUAL LOCATION
========================================= */

function getLocationForManualSOS() {

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            try {

                await saveManualAlert(

                    position.coords.latitude,

                    position.coords.longitude,

                    position.coords.accuracy

                );


                manualSOS.textContent =
                    "SOS SENT ✓";

                message.textContent =
                    "Emergency alert created.";

            }

            catch (error) {

                console.error(error);

                manualSOS.disabled = false;

                manualSOS.textContent =
                    "🚨 EMERGENCY SOS";

                message.textContent =
                    "Failed to create alert.";
            }

        },

        async () => {

            try {

                await saveManualAlert();

                manualSOS.textContent =
                    "SOS SENT ✓";

            }

            catch (error) {

                console.error(error);

                manualSOS.disabled = false;

                manualSOS.textContent =
                    "🚨 EMERGENCY SOS";
            }

        }

    );

}


/* =========================================
   GET LOCATION
========================================= */

function getLocation() {

    if (!navigator.geolocation) {

        locationStatus.textContent =
            "Not Supported";

        return;
    }


    navigator.geolocation.getCurrentPosition(

        () => {

            locationStatus.textContent =
                "Ready ✓";

        },

        () => {

            locationStatus.textContent =
                "Permission Required";

        },

        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}
