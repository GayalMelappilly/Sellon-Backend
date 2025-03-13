import admin from 'firebase-admin'
import path from 'path'

const serviceAccount = require(path.join(__dirname, '../firebase-config/sellon-5beb3-firebase-adminsdk-fbsvc-e5a6f6c9ec.json'))

if(!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
}

export default admin