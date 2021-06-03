import "firebase/analytics";
import firebase from "firebase/app";
import app from "./firebase";

export const analytics = firebase.analytics;

export const logPage = (url: string) => {
    const a = analytics();
    a.setCurrentScreen(url);
    a.logEvent("screen_view");
};

export default analytics;
