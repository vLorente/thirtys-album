import type { ServiceAccount } from 'firebase-admin'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

const activeApps = getApps()

// const privateKey = Buffer.from(import.meta.env.FIREBASE_PRIVATE_KEY_BASE64, 'base64').toString(
// 	'utf-8',
// )
// console.error('PRIVATE KEY', privateKey)
// console.error('PRIVATE KEY BASE', import.meta.env.FIREBASE_PRIVATE_KEY)
const serviceAccount = {
	type: 'service_account',
	project_id: import.meta.env.FIREBASE_PROJECT_ID,
	private_key_id: import.meta.env.FIREBASE_PRIVATE_KEY_ID,
	// private_key: privateKey.toString(),
	private_key: import.meta.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	client_email: import.meta.env.FIREBASE_CLIENT_EMAIL,
	client_id: import.meta.env.FIREBASE_CLIENT_ID,
	auth_uri: import.meta.env.FIREBASE_AUTH_URI,
	token_uri: import.meta.env.FIREBASE_TOKEN_URI,
	auth_provider_x509_cert_url: import.meta.env.FIREBASE_AUTH_CERT_URL,
	client_x509_cert_url: import.meta.env.FIREBASE_CLIENT_CERT_URL,
}

const initApp = () => {
	console.info('Loading service account from env.')
	return initializeApp({
		credential: cert(serviceAccount as ServiceAccount),
		storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
		projectId: import.meta.env.FIREBASE_PROJECT_ID,
	})
}

const app = activeApps.length === 0 ? initApp() : activeApps[0]
const storage = getStorage(app)
const db = getFirestore(app)
const collectionRef = db.collection(import.meta.env.FIREBASE_FIRESTORE_DATABASE)

export { app, collectionRef, db, storage }
