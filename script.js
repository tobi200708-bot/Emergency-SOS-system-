import { saveSOSAlert } from "./firebase.js";

const sosButton = document.getElementById("sosButton");
const status = document.getElementById("status");
const locationStatus = document.getElementById("locationStatus");

sosButton.addEventListener("click", () => {

    status.textContent = "🚨 SOS Activated";
    locationStatus.textContent = "📍 Getting location...";

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {

                await saveSOSAlert(
                    latitude,
                    longitude
                );

                status.textContent =
                    "✅ SOS Alert Saved";

                locationStatus.textContent =
                    "📍 Location saved successfully";

            } catch (error) {

                console.error(error);

                status.textContent =
                    "❌ Firebase Error";
            }
        },

        () => {

            status.textContent =
                "❌ Location Permission Required";

            locationStatus.textContent =
                "Please allow GPS permission.";

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
});
