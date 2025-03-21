import admin from 'firebase-admin';
import { configDotenv } from 'dotenv';
configDotenv();

if (!admin.apps.length) {
    try {
        const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (!serviceAccountStr) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
        }
        
        const serviceAccount = JSON.parse(serviceAccountStr);
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}

export default admin;