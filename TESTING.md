# Testing Locally

This guide shows you how to test the status update script locally.

## Prerequisites

- Node.js 18+ installed
- Firebase service account JSON file

## Setup

1. Install dependencies:
   ```bash
   cd scripts
   npm install
   ```

2. Prepare your Firebase service account:
   ```bash
   # Assuming you have service-account.json in the scripts directory
   export FIREBASE_SERVICE_ACCOUNT=$(cat service-account.json | base64 -w 0)
   ```

## Test Commands

### Set maintenance status:
```bash
node set-status.js maintenance "System maintenance in progress"
```

### Set online status:
```bash
node set-status.js online "System is operational"
```

### Set error status:
```bash
node set-status.js error "Deployment failed - rolling back"
```

## Custom Collection and Document

You can override the default Firestore paths:

```bash
export FIRESTORE_COLLECTION="my-status"
export FIRESTORE_DOCUMENT="prod"
node set-status.js maintenance "Custom path test"
```

## Expected Output

Successful execution:
```
✓ Firebase Admin initialized successfully
✓ Status updated successfully
  Collection: system-status
  Document: current
  Status: maintenance
  Message: System maintenance in progress
```

## Verify in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database
4. Look for the `system-status` collection
5. Check the `current` document for the updated status

## Common Errors

### Missing FIREBASE_SERVICE_ACCOUNT
```
Error: FIREBASE_SERVICE_ACCOUNT environment variable is not set.
```
**Solution:** Set the environment variable with base64-encoded service account JSON.

### Invalid status
```
Error: Invalid status. Must be one of: maintenance, online, error
```
**Solution:** Use one of the valid status values.

### Firebase Authentication Failed
```
Error: Failed to initialize Firebase Admin.
```
**Solution:** Verify your service account JSON is valid and has the correct permissions.
