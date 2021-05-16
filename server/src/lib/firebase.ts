import chalk from "chalk";
import { config as configENV } from "dotenv";
import * as admin from "firebase-admin";
configENV();

export const app = admin.apps.length ? admin.app() : initApp();
export const auth = app.auth();

export async function verifyUser(t: string) {
    return await auth.verifyIdToken(t).catch(err => {
        console.error(err);
        return null;
    });
}

function initApp() {
    const appinit = admin.initializeApp();
    console.log(
        chalk.bold`Firebase app initialized: {redBright ${appinit.name}}`
    );
    return appinit;
}

export default admin;
