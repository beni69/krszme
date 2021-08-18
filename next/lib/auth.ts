import firebase from "firebase/app";
import "firebase/auth";
import type { auth as uiAuth } from "firebaseui";
import router from "next/router";
import { createContext } from "react";
import app from "./firebase";
export { default as withAuth } from "../components/HOC/withAuth";

export const auth = app.auth();

export const getUser = () => USER;

export const getToken = (forceRefresh = false) =>
    auth.currentUser?.getIdToken(forceRefresh).catch(() => null);

export const authState = () => {
    switch (USER) {
        case undefined:
            return -1;

        case null:
            return 0;

        default:
            return 1;
    }
};

export const signOut = () => {
    router.push("/").then(() => {
        auth.signOut();
        sessionStorage.clear();
    });
};

let USER: firebase.User = undefined;

auth.onAuthStateChanged(async u => {
    USER = u;

    console.log(u ? "signed in" : "signed out");

    if (u) {
        console.debug(`jwt token: ${await u.getIdToken()}`);
    }
});

export const AuthContext = createContext<firebase.User>(auth.currentUser);

export const uiConfig: uiAuth.Config = {
    signInOptions: [
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            scopes: ["profile", "email"],
        },
        {
            provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            scopes: ["public_profile", "email"],
        },
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // {
        //     provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        //     signInMethod:
        //         firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        // },
    ],
    signInFlow: "redirect",
    signInSuccessUrl: "/profile",
};

export default auth;
