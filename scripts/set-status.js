const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

/**
 * This script updates the status of a specific service for a specific environment in Firestore.
 *
 * It requires 4 arguments:
 * 1. ENVIRONMENT: The name of the document in Firestore (e.g., 'staging', 'production')
 * 2. SERVICE: The name of the map field to update (e.g., 'fastapi', 'frontend')
 * 3. STATUS: The new status string (e.g., 'maintenance', 'online', 'error')
 * 4. MESSAGE: The new message string (e.g., "API deployment in progress...")
 *
 * It also requires one environment variable:
 * - FIREBASE_SERVICE_ACCOUNT: The Base64-encoded service account key.
 */
async function updateStatus() {
  const [env, service, status, message] = process.argv.slice(2);

  if (!env || !service || !status || !message) {
    console.error('Missing arguments! Usage:');
    console.error('node set-status.js <environment> <service> <status> <message>');
    process.exit(1);
  }

  // 1. Get the Service Account Key from the GitHub Secret
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.error('FIREBASE_SERVICE_ACCOUNT secret is not set.');
    process.exit(1);
  }

  let serviceAccount;
  try {
    // The key is expected to be Base64 encoded
    serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf-8')
    );
  } catch (e) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT. Is it Base64 encoded?', e);
    process.exit(1);
  }

  // 2. Initialize Firebase
  try {
    initializeApp({
      credential: cert(serviceAccount)
    });
  } catch (e) {
    // Ignore "already initialized" errors if script runs multiple times in one job
    if (e.code !== 'app/duplicate-app') {
      console.error('Firebase init error:', e);
      process.exit(1);
    }
  }

  const db = getFirestore();

  // 3. Define the path and data to update
  const docRef = db.collection('systemStatus').doc(env);
  const fieldToUpdate = `${service}.status`;
  const messageToUpdate = `${service}.message`;

  console.log(`Updating Firestore: /systemStatus/${env}`);
  console.log(`Setting ${service} -> status: ${status}, message: ${message}`);

  // 4. Run the update
  try {
    await docRef.update({
      [fieldToUpdate]: status,
      [messageToUpdate]: message
    });
    console.log('✅ Firestore update successful.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Firestore update failed:', err);
    process.exit(1);
  }
}

updateStatus();