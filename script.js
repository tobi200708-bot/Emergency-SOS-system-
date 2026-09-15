import {
    saveAutomaticAlert,
    saveManualAlert
} from "./firebase.js";


const ALERT_THRESHOLD = 25;

const ALERT_COOLDOWN = 30000;


let protectionActive = false;

let alertSent = false;

let lastAlertTime = 0;


const startProtection =
    document.getElementById("startProtection");

const manualSOS =
    document.getElementById("manualSOS");

const systemStatus =
    document.getElementById("systemStatus");

const sensorStatus =
    document.getElementById("sensorStatus");

const locationStatus =
    document.getElementById("locationStatus");

const alertStatus =
    document.getElementById("alertStatus");

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


/* =========================
   START PROTECTION
========================= */

startProtection.addEventListener(
    "click",
    async () => {

        try {

            if (
                typeof DeviceMotionEvent !== "undefined" &&
                typeof DeviceMotionEvent.requestPermission ===
                "function"
            ) {

                const permission =
                    await DeviceMotionEvent.requestPermission();

                if (permission !== "granted") {

                    message.textContent =
                        "Motion sensor permission denied.";

                    return;
                }
            }


            protectionActive = true;

            alertSent = false;


            systemStatus.textContent =
                "ACTIVE";

            sensorStatus.textContent =
                "ON";

            alertStatus.textContent =
                "SAFE";


            startProtection.textContent =
                "Protection Active ✓";

            startProtection.disabled =
                true;


            message.textContent =
                "Automatic protection started.";


            requestLocation();


            window.addEventListener(
                "devicemotion",
                handleMotion
            );

        }
        catch (error) {

            console.error(error);

            message.textContent =
                "Unable to start protection.";
        }
    }
);


/* =========================
   MOTION SENSOR
========================= */

function handleMotion(event) {

    if (!protectionActive) {
        return;
    }


    const data =
        event.accelerationIncludingGravity;


    if (!data) {
        return;
    }


    const x = Number(data.x) || 0;

    const y = Number(data.y) || 0;

    const z = Number(data.z) || 0;


    const total =
        Math.sqrt(
            x * x +
            y * y +
            z * z
        );


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

    if (total >= ALERT_THRESHOLD) {

        const now = Date.now();


        if (
            !alertSent &&
            now - lastAlertTime >
            ALERT_COOLDOWN
        ) {

            lastAlertTime = now;

            triggerAutomaticAlert(total);
        }
    }
}


/* =========================
   AUTOMATIC ALERT
========================= */

async function triggerAutomaticAlert(
    sensorValue
) {

    if (alertSent) {
        return;
    }


    alertSent = true;


    systemStatus.textContent =
        "EMERGENCY";


    alertStatus.textContent =
        "ALERT SENT";

    alertStatus.style.color =
        "#ff3347";


    alertBox.className =
        "danger-box";

    alertBox.textContent =
        "🚨 EMERGENCY DETECTED";


    message.textContent =
        "Getting location...";


    if (!navigator.geolocation) {

        await saveAutomaticAlert(
            null,
            null,
            null,
            sensorValue
        );

        message.textContent =
            "🚨 Emergency alert saved.";

        return;
    }


    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const accuracy =
                position.coords.accuracy;


            locationStatus.textContent =
                "READY ✓";


            try {

                await saveAutomaticAlert(

                    latitude,

                    longitude,

                    accuracy,

                    sensorValue
                );


                message.textContent =
                    "🚨 Emergency alert sent successfully.";

            }
            catch (error) {

                console.error(error);

                message.textContent =
                    "Firebase alert failed.";
            }
        },


        async (error) => {

            console.error(error);


            try {

                await saveAutomaticAlert(
                    null,
                    null,
                    null,
                    sensorValue
                );


                locationStatus.textContent =
                    "UNAVAILABLE";

                message.textContent =
                    "🚨 Alert saved without location.";

            }
            catch (firebaseError) {

                console.error(firebaseError);

                message.textContent =
                    "Unable to save alert.";
            }
        },


        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}


/* =========================
   LOCATION
========================= */

function requestLocation() {

    if (!navigator.geolocation) {

        locationStatus.textContent =
            "NOT SUPPORTED";

        return;
    }


    navigator.geolocation.getCurrentPosition(

        () => {

            locationStatus.textContent =
                "READY ✓";

        },

        () => {

            locationStatus.textContent =
                "ALLOW LOCATION";
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}


/* =========================
   MANUAL SOS
========================= */

manualSOS.addEventListener(
    "click",
    async () => {

        manualSOS.disabled = true;

        manualSOS.textContent =
            "SENDING...";


        try {

            navigator.geolocation.getCurrentPosition(

                async (position) => {

                    await saveManualAlert(

                        position.coords.latitude,

                        position.coords.longitude,

                        position.coords.accuracy
                    );


                    manualSOS.textContent =
                        "SOS SENT ✓";

                    message.textContent =
                        "Emergency alert created.";
                },


                async () => {

                    await saveManualAlert(
                        null,
                        null,
                        null
                    );


                    manualSOS.textContent =
                        "SOS SENT ✓";

                    message.textContent =
                        "Emergency alert created.";
                }
            );

        }
        catch (error) {

            console.error(error);

            manualSOS.disabled = false;

            manualSOS.textContent =
                "🚨 EMERGENCY SOS";
        }
    }
);
