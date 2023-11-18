import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyBg5yCrmeCg32gU2NcfuNo3w26tgsgtMFA",
    authDomain: "login-383e1.firebaseapp.com",
    projectId: "login-383e1",
    storageBucket: "login-383e1.appspot.com",
    messagingSenderId: "493393656735",
    appId: "1:493393656735:web:9f66b04aea78a2aa9edbaa",
    measurementId: "G-32X2T4NPS0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export {auth,provider};