// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBir3lYt6NUPUmCGFA6fzqrnvwMUFkb68c",
    authDomain: "autosquare-prod.firebaseapp.com",
    projectId: "autosquare-prod",
    storageBucket: "autosquare-prod.firebasestorage.app",
    messagingSenderId: "446953879113",
    appId: "1:446953879113:web:c50837a8e9cbf30244f198"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
