import {
    getAuth,
    User,
    GithubAuthProvider,
    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider,
} from "firebase/auth";
import type { auth as uiAuth } from "firebaseui";
import router from "next/router";
import { createContext } from "react";
import app from "./firebase";
export { default as withAuth } from "../components/HOC/withAuth";

export const auth = getAuth(app);

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

let USER: User = undefined;

auth.onAuthStateChanged(async u => {
    USER = u;

    console.log(u ? "signed in" : "signed out");

    if (u) {
        console.debug(`jwt token: ${await u.getIdToken()}`);
    }
});

export const AuthContext = createContext<User>(auth.currentUser);

export const uiConfig: uiAuth.Config = {
    signInOptions: [
        {
            provider: GoogleAuthProvider.PROVIDER_ID,
            scopes: ["profile", "email"],
        },
        {
            provider: FacebookAuthProvider.PROVIDER_ID,
            scopes: ["public_profile", "email"],
        },
        GithubAuthProvider.PROVIDER_ID,
        TwitterAuthProvider.PROVIDER_ID,
        // {
        //     provider: EmailAuthProvider.PROVIDER_ID,
        //     signInMethod:
        //         EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        // },
    ],
    signInFlow: "redirect",
    signInSuccessUrl: "/profile",
};

export default auth;
