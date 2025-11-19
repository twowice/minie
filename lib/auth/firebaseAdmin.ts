import * as admin from 'firebase-admin';

const serviceAccountJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY;

if (!serviceAccountJson) {
  throw new Error("환경 변수 FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY가 설정되지 않았습니다.");
}

const serviceAccount = JSON.parse(serviceAccountJson);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const authAdmin = admin.auth();
