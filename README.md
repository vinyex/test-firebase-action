# Real-time System Status & Maintenance Mode

This repository demonstrates a "Real-time System Status & Maintenance Mode" workflow using GitHub Actions and Firebase Firestore. It provides a reusable pattern for tracking deployment status in real-time, allowing your application to display maintenance mode banners or status indicators during deployments.

## 🎯 Features

- **Reusable Node.js script** to update Firestore with system status
- **GitHub Actions workflow** demonstrating the "sandwich" pattern:
  1. Set status to `maintenance` before deployment
  2. Run deployment steps
  3. Set status to `online` on success or `error` on failure
- **Safe guard** for testing without Firestore credentials (prints setup instructions)
- **Real-time updates** that can be consumed by your application to show maintenance banners

## 📁 Repository Structure

```
.
├── scripts/
│   ├── set-status.js      # Node.js script to update Firestore
│   └── package.json       # Dependencies (firebase-admin)
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions workflow with status updates
└── README.md
```

## 🚀 Quick Start

### 1. Set up Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Create a Firestore database
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate new private key** to download the service account JSON file

### 2. Add GitHub Secret

1. Base64 encode your service account JSON:
   ```bash
   cat service-account.json | base64 -w 0
   ```
2. Go to your GitHub repository **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Name: `FIREBASE_SERVICE_ACCOUNT`
5. Value: Paste the base64-encoded string
6. Click **Add secret**

### 3. Customize the Workflow

Edit `.github/workflows/deploy.yml` and replace the placeholder deployment step with your actual deployment commands:

```yaml
- name: Run deployment
  run: |
    # Your deployment commands here
    npm run build
    npm run deploy
```

### 4. Test Without Firebase (Optional)

You can test the workflow without setting up Firebase. The workflow will detect the missing secret and print setup instructions instead of failing.

## 📝 Usage

### The Status Update Script

The `scripts/set-status.js` script accepts two arguments:

```bash
node set-status.js <status> [message]
```

**Status values:**
- `maintenance` - System is in maintenance mode
- `online` - System is online and operational
- `error` - Deployment or operation encountered an error

**Environment variables:**
- `FIREBASE_SERVICE_ACCOUNT` (required) - Base64-encoded Firebase service account JSON
- `FIRESTORE_COLLECTION` (optional) - Collection name (default: `system-status`)
- `FIRESTORE_DOCUMENT` (optional) - Document ID (default: `current`)

**Example:**
```bash
export FIREBASE_SERVICE_ACCOUNT="<base64-encoded-json>"
node scripts/set-status.js maintenance "Deploying new version"
```

### Consuming Status in Your Application

In your application, subscribe to the Firestore document to display real-time status:

**JavaScript/TypeScript:**
```javascript
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

const db = getFirestore();
const statusRef = doc(db, 'system-status', 'current');

onSnapshot(statusRef, (doc) => {
  const data = doc.data();
  if (data.status === 'maintenance') {
    showMaintenanceBanner(data.message);
  } else if (data.status === 'error') {
    showErrorBanner(data.message);
  } else {
    hideStatusBanner();
  }
});
```

**React Example:**
```jsx
import { useEffect, useState } from 'react';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

function MaintenanceBanner() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(
      doc(db, 'system-status', 'current'),
      (doc) => setStatus(doc.data())
    );
    return unsubscribe;
  }, []);

  if (status?.status === 'maintenance') {
    return <div className="banner maintenance">{status.message}</div>;
  }
  if (status?.status === 'error') {
    return <div className="banner error">{status.message}</div>;
  }
  return null;
}
```

## 🔧 Customization

### Using Different Firestore Paths

You can customize the collection and document names by setting environment variables in your workflow:

```yaml
- name: Set status to maintenance
  env:
    FIREBASE_SERVICE_ACCOUNT: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
    FIRESTORE_COLLECTION: my-custom-collection
    FIRESTORE_DOCUMENT: my-status-doc
  run: |
    node scripts/set-status.js maintenance "Custom deployment message"
```

### Adding More Status Values

To add custom status values, edit `scripts/set-status.js` and add to the `validStatuses` array:

```javascript
const validStatuses = ['maintenance', 'online', 'error', 'deploying', 'testing'];
```

## 🛡️ Security Best Practices

- ✅ **Never commit** your Firebase service account JSON file
- ✅ Always use base64 encoding for the service account in GitHub Secrets
- ✅ Set appropriate Firestore security rules to prevent unauthorized writes:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /system-status/{document} {
        allow read: if true;
        allow write: if false; // Only server-side writes
      }
    }
  }
  ```

## 🎨 Workflow Pattern: The "Sandwich"

This workflow uses a sandwich pattern to ensure status is always updated:

1. **Top Bread** 🍞 - Set `maintenance` status before deployment
2. **Filling** 🥗 - Run your deployment steps
3. **Bottom Bread** 🍞 - Set `online` (success) or `error` (failure) status

This ensures your users always see accurate system status, even if deployment fails.

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📚 Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)