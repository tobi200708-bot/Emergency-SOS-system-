const sosButton = document.getElementById("sosButton");
const status = document.getElementById("status");
const locationStatus = document.getElementById("locationStatus");

sosButton.addEventListener("click", () => {

    status.textContent = "🚨 SOS Activated";
    locationStatus.textContent = "📍 Getting location...";

    if (!navigator.geolocation) {
        locationStatus.textContent = "GPS not supported";
        return;
    }

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const mapURL =
                `https://www.google.com/maps?q=${latitude},${longitude}`;

            locationStatus.innerHTML =
                `📍 Location Found<br>
                <a href="${mapURL}" target="_blank">
                Open Location
                </a>`;

            status.textContent =
                "✅ Emergency Location Ready";

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
