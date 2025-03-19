import admin from 'firebase-admin';
import { configDotenv } from 'dotenv';
configDotenv();

if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n') as string;
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

export default admin;