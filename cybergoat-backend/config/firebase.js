import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// On GCP Cloud Run, initializeApp() automatically inherits default ambient Service Account credentials
if (!getApps().length) {
  initializeApp();
}

export const db = getFirestore();
