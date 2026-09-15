/* =========================================================
   EMERGENCY SOS SYSTEM
   SCRIPT.JS
   ========================================================= */


/* =========================================================
   FIREBASE HELPER
   ========================================================= */

function firebaseReady() {
    return (
        window.firebaseDB &&
        window.firebaseFunctions
    );
}


/* =========================================================
   FIREBASE EVENT LOGGER
   ========================================================= */

async function logSystemEvent(eventName, extraData = {}) {

    if (!firebaseReady()) {
        console.log("Firebase is not ready.");
        return;
    }

    try {

        const {
            collection,
            addDoc,
            serverTimestamp
        } = window.firebaseFunctions;

        await addDoc(
            collection(
                window.firebaseDB,
                "systemEvents"
            ),
            {
                event: eventName,
                page: "landing-page",
                ...extraData,
                createdAt: serverTimestamp()
            }
        );

    } catch (error) {

        console.error(
            "Firebase event error:",
            error
        );

    }
}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.getElementById("navMenu");

    const navLinks =
        document.querySelectorAll(".nav-link");


    if (menuToggle && navMenu) {

        menuToggle.addEventListener(
            "click",
            () => {

                navMenu.classList.toggle("active");

            }
        );

    }


    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            function () {

                if (navMenu) {
                    navMenu.classList.remove("active");
                }

                navLinks.forEach(item => {
                    item.classList.remove("active");
                });

                this.classList.add("active");

            }
        );

    });

});


/* =========================================================
   NORMAL SOS MODAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const sosButton =
        document.getElementById("sosButton");

    const mobileSOS =
        document.getElementById("mobileSOS");

    const heroSOS =
        document.getElementById("heroSOS");

    const sosModal =
        document.getElementById("sosModal");

    const closeModal =
        document.getElementById("closeModal");

    const cancelSOS =
        document.getElementById("cancelSOS");

    const confirmSOS =
        document.getElementById("confirmSOS");


    function openSOSModal() {

        if (sosModal) {
            sosModal.classList.add("show");
        }

    }


    function closeSOSModal() {

        if (sosModal) {
            sosModal.classList.remove("show");
        }

    }


    if (sosButton) {
        sosButton.addEventListener(
            "click",
            openSOSModal
        );
    }


    if (mobileSOS) {
        mobileSOS.addEventListener(
            "click",
            openSOSModal
        );
    }


    if (heroSOS) {
        heroSOS.addEventListener(
            "click",
            openSOSModal
        );
    }


    if (closeModal) {
        closeModal.addEventListener(
            "click",
            closeSOSModal
        );
    }


    if (cancelSOS) {
        cancelSOS.addEventListener(
            "click",
            closeSOSModal
        );
    }


    if (sosModal) {

        sosModal.addEventListener(
            "click",
            event => {

                if (
                    event.target === sosModal
                ) {
                    closeSOSModal();
                }

            }
        );

    }


    /* ---------------------------------------------------------
       SEND SOS
       --------------------------------------------------------- */

    if (confirmSOS) {

        confirmSOS.addEventListener(
            "click",
            async () => {

                const originalText =
                    confirmSOS.textContent;

                confirmSOS.disabled = true;

                confirmSOS.textContent =
                    "SENDING...";


                try {

                    const user =
                        window.firebaseUser;


                    if (!user) {

                        alert(
                            "Please login before activating Emergency SOS."
                        );

                        confirmSOS.disabled =
                            false;

                        confirmSOS.textContent =
                            originalText;

                        return;

                    }


                    if (!firebaseReady()) {

                        throw new Error(
                            "Firebase is not initialized."
                        );

                    }


                    const {
                        collection,
                        addDoc,
                        serverTimestamp
                    } =
                        window.firebaseFunctions;


                    const location =
                        await getCurrentLocation();


                    const emergencyData = {

                        userId:
                            user.uid,

                        type:
                            "SOS",

                        status:
                            "ACTIVE",

                        message:
                            "Emergency SOS activated",

                        location:
                            location,

                        source:
                            "sos-button",

                        createdAt:
                            serverTimestamp()

                    };


                    const reference =
                        await addDoc(

                            collection(
                                window.firebaseDB,
                                "emergencyAlerts"
                            ),

                            emergencyData

                        );


                    console.log(
                        "SOS Alert ID:",
                        reference.id
                    );


                    alert(
                        "🚨 EMERGENCY SOS ACTIVATED!\n\nYour emergency alert has been sent."
                    );


                    confirmSOS.textContent =
                        "SOS SENT ✓";


                    await logSystemEvent(
                        "sos_activated",
                        {
                            section:
                                "sos-system"
                        }
                    );


                    closeSOSModal();


                } catch (error) {

                    console.error(
                        "SOS Error:",
                        error
                    );

                    alert(
                        "Unable to send SOS. Please try again."
                    );

                }


                confirmSOS.disabled =
                    false;

                confirmSOS.textContent =
                    originalText;

            }
        );

    }


    function closeSOSModal() {

        if (sosModal) {
            sosModal.classList.remove("show");
        }

    }

});


/* =========================================================
   GEOLOCATION
   ========================================================= */

let emergencyLocation = null;


function getCurrentLocation() {

    return new Promise(resolve => {

        if (!navigator.geolocation) {

            resolve(null);

            return;

        }


        navigator.geolocation.getCurrentPosition(

            position => {

                emergencyLocation = {

                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude,

                    accuracy:
                        position.coords.accuracy

                };


                resolve(
                    emergencyLocation
                );

            },

            error => {

                console.warn(
                    "GPS error:",
                    error.message
                );

                resolve(null);

            },

            {

                enableHighAccuracy: true,

                timeout: 10000,

                maximumAge: 5000

            }

        );

    });

}


/* =========================================================
   HERO SOS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const heroSOSButton =
        document.getElementById(
            "heroSOSButton"
        );

    const bigSOSButton =
        document.getElementById(
            "bigSOSButton"
        );

    const heroSOSModal =
        document.getElementById(
            "heroSOSModal"
        );

    const heroModalClose =
        document.getElementById(
            "heroModalClose"
        );

    const heroModalCancel =
        document.getElementById(
            "heroModalCancel"
        );

    const heroModalConfirm =
        document.getElementById(
            "heroModalConfirm"
        );

    const locationStatus =
        document.getElementById(
            "locationStatus"
        );


    async function openHeroSOS() {

        if (heroSOSModal) {
            heroSOSModal.classList.add("show");
        }


        if (locationStatus) {

            locationStatus.textContent =
                "📍 Detecting your location...";

        }


        const location =
            await getCurrentLocation();


        if (locationStatus) {

            if (location) {

                locationStatus.textContent =
                    "📍 Location detected successfully";

            } else {

                locationStatus.textContent =
                    "⚠️ Location unavailable. SOS can still be submitted.";

            }

        }

    }


    function closeHeroSOS() {

        if (heroSOSModal) {
            heroSOSModal.classList.remove("show");
        }

    }


    if (heroSOSButton) {

        heroSOSButton.addEventListener(
            "click",
            openHeroSOS
        );

    }


    if (bigSOSButton) {

        bigSOSButton.addEventListener(
            "click",
            openHeroSOS
        );

    }


    if (heroModalClose) {

        heroModalClose.addEventListener(
            "click",
            closeHeroSOS
        );

    }


    if (heroModalCancel) {

        heroModalCancel.addEventListener(
            "click",
            closeHeroSOS
        );

    }


    if (heroSOSModal) {

        heroSOSModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    heroSOSModal
                ) {

                    closeHeroSOS();

                }

            }
        );

    }


    /* ---------------------------------------------------------
       HERO SEND SOS
       --------------------------------------------------------- */

    if (heroModalConfirm) {

        heroModalConfirm.addEventListener(
            "click",
            async () => {

                const originalText =
                    heroModalConfirm.textContent;

                heroModalConfirm.disabled =
                    true;

                heroModalConfirm.textContent =
                    "SENDING...";


                try {

                    const user =
                        window.firebaseUser;


                    if (!user) {

                        alert(
                            "Please login before activating Emergency SOS."
                        );

                        return;

                    }


                    if (!firebaseReady()) {

                        throw new Error(
                            "Firebase is not initialized."
                        );

                    }


                    const {
                        collection,
                        addDoc,
                        serverTimestamp
                    } =
                        window.firebaseFunctions;


                    if (!emergencyLocation) {

                        emergencyLocation =
                            await getCurrentLocation();

                    }


                    const emergencyData = {

                        userId:
                            user.uid,

                        type:
                            "SOS",

                        status:
                            "ACTIVE",

                        message:
                            "Emergency SOS activated",

                        location:
                            emergencyLocation,

                        source:
                            "hero-section",

                        createdAt:
                            serverTimestamp()

                    };


                    const reference =
                        await addDoc(

                            collection(
                                window.firebaseDB,
                                "emergencyAlerts"
                            ),

                            emergencyData

                        );


                    console.log(
                        "Emergency Alert ID:",
                        reference.id
                    );


                    heroModalConfirm.textContent =
                        "SOS SENT ✓";


                    if (locationStatus) {

                        locationStatus.textContent =
                            "🚨 Emergency alert successfully created";

                    }


                    await logSystemEvent(
                        "hero_sos_activated",
                        {
                            section:
                                "hero-sos"
                        }
                    );


                    setTimeout(
                        () => {

                            closeHeroSOS();

                            heroModalConfirm.disabled =
                                false;

                            heroModalConfirm.textContent =
                                originalText;

                        },
                        1800
                    );


                } catch (error) {

                    console.error(
                        "Hero SOS Error:",
                        error
                    );


                    alert(
                        "Unable to send the emergency alert. Please try again."
                    );


                    heroModalConfirm.disabled =
                        false;

                    heroModalConfirm.textContent =
                        originalText;

                }

            }
        );

    }

});


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        const sosModal =
            document.getElementById(
                "sosModal"
            );

        const heroSOSModal =
            document.getElementById(
                "heroSOSModal"
            );


        if (sosModal) {
            sosModal.classList.remove("show");
        }


        if (heroSOSModal) {
            heroSOSModal.classList.remove("show");
        }

    }
);


/* =========================================================
   LIVE RESPONSE TIME
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const responseTime =
        document.getElementById(
            "responseTime"
        );


    if (!responseTime) {
        return;
    }


    const responseValues = [
        "< 5s",
        "< 4s",
        "< 3s",
        "< 5s"
    ];


    let index = 0;


    setInterval(() => {

        index++;

        if (
            index >=
            responseValues.length
        ) {
            index = 0;
        }


        responseTime.textContent =
            responseValues[index];

    }, 3000);

});


/* =========================================================
   PROBLEM → SOLUTION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const button =
        document.getElementById(
            "showWorkflow"
        );

    const card =
        document.querySelector(
            ".workflow-card"
        );

    const status =
        document.getElementById(
            "psStatusText"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async () => {

            if (card) {

                card.classList.remove(
                    "active"
                );

                void card.offsetWidth;

                card.classList.add(
                    "active"
                );

            }


            if (status) {

                status.textContent =
                    "Emergency response workflow connected";

            }


            button.innerHTML =
                "Workflow Active ✓";


            await logSystemEvent(
                "problem_solution_interaction",
                {
                    section:
                        "problem-solution"
                }
            );


            setTimeout(() => {

                button.innerHTML =
                    'See The Difference <span>→</span>';


                if (status) {

                    status.textContent =
                        "Emergency network ready";

                }

            }, 4000);

        }
    );

});


/* =========================================================
   HOW IT WORKS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
