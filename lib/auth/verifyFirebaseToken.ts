import { authAdmin } from "./firebaseAdmin";

export async function verifyFirebaseToken(token: string) {
  try {
    const decoded = await authAdmin.verifyIdToken(token);
    return decoded;
  } catch (error) {
    console.error("Firebase token verification failed:", error)
    return null;
  }
}