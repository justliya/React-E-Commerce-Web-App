// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCNMyM6b4IL65ceCIhzv4MU1E_R-UMAOSI",
    authDomain: "eccommerce-web-app.firebaseapp.com",
    projectId: "eccommerce-web-app",
    storageBucket: "eccommerce-web-app.firebasestorage.app",
    messagingSenderId: "54236987304",
    appId: "1:54236987304:web:66e6ae77999477be80279d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

export { auth };