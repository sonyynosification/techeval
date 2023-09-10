import admin from "firebase-admin";

import serviceAccount from "/home/sony/keys/techeval-firebase-adminsdk-zx3yn-32a58c3090.json";
import {getApp} from "firebase-admin/app";

let firebaseApp;
try {
    firebaseApp = getApp("server");
} catch (e) {
    console.error(e);
    firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    }, "server");
}

export default firebaseApp;
