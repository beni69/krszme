import { getApps, initializeApp, getApp } from "firebase/app";

const config = {
    apiKey: "AIzaSyDx2VXjSakAWoV7JszU6PYZgfJX5OZKOME",
    authDomain: "krszme.firebaseapp.com",
    projectId: "krszme",
    storageBucket: "krszme.appspot.com",
    messagingSenderId: "1002758976981",
    appId: "1:1002758976981:web:b2c10e4a823e3fcb4d795c",
    measurementId: "G-V0F4B0H7M9",
};

export const app = getApps().length ? getApp() : initializeApp(config);

export default app;
