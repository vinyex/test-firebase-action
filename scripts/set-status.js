#!/usr/bin/env node

/**
 * set-status.js
 * 
 * Updates the system status in Firestore to track maintenance mode,
 * deployment status, and error states.
 * 
 * Usage:
 *   node set-status.js <status> [message]
 * 
 * Status values:
 *   - maintenance: System is in maintenance mode
 *   - online: System is online and operational
 *   - error: Deployment or operation encountered an error
 * 
 * Environment variables:
 *   - FIREBASE_SERVICE_ACCOUNT: Base64-encoded Firebase service account JSON
 *   - FIRESTORE_COLLECTION: Firestore collection name (default: 'system-status')
 *   - FIRESTORE_DOCUMENT: Firestore document ID (default: 'current')
 */

const admin = require('firebase-admin');

// Parse command-line arguments
const status = process.argv[2];
const message = process.argv[3] || '';

// Validate status argument
const validStatuses = ['maintenance', 'online', 'error'];
if (!status || !validStatuses.includes(status)) {
  console.error(`Error: Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  process.exit(1);
}

// Check for required environment variable
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccountBase64) {
  console.error('Error: FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
  console.error('Please set it to a base64-encoded Firebase service account JSON.');
  process.exit(1);
}

// Decode and parse service account
let serviceAccount;
try {
  const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
  serviceAccount = JSON.parse(serviceAccountJson);
} catch (error) {
  console.error('Error: Failed to decode or parse FIREBASE_SERVICE_ACCOUNT.');
  console.error(error.message);
  process.exit(1);
}

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✓ Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error: Failed to initialize Firebase Admin.');
  console.error(error.message);
  process.exit(1);
}

// Get Firestore collection and document from environment or use defaults
const collectionName = process.env.FIRESTORE_COLLECTION || 'system-status';
const documentId = process.env.FIRESTORE_DOCUMENT || 'current';

// Update Firestore document
async function updateStatus() {
  try {
    const db = admin.firestore();
    const docRef = db.collection(collectionName).doc(documentId);
    
    const statusData = {
      status: status,
      message: message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      lastUpdate: new Date().toISOString()
    };
    
    await docRef.set(statusData, { merge: true });
    
    console.log('✓ Status updated successfully');
    console.log(`  Collection: ${collectionName}`);
    console.log(`  Document: ${documentId}`);
    console.log(`  Status: ${status}`);
    if (message) {
      console.log(`  Message: ${message}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error: Failed to update Firestore.');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the update
updateStatus();
