import chalk from "chalk";
import { config as configENV } from "dotenv";
import * as admin from "firebase-admin";
configENV();

export const app = admin.apps.length ? admin.app() : initApp();
export const auth = app.auth();

export async function verifyUser(t?: string) {
    if (!t) return null;
    return await auth.verifyIdToken(t).catch(err => null);
}

function initApp() {
    const appinit = admin.initializeApp();
    console.log(
        chalk.bold`Firebase app initialized: {redBright ${appinit.name}}`
    );
    return appinit;
}

export default admin;
