# Example: Integration with React App

This example shows how to integrate the real-time status updates into a React application.

## Installation

```bash
npm install firebase
```

## Setup Firebase in Your App

```javascript
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

## Create a Status Banner Component

```javascript
// src/components/StatusBanner.jsx
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './StatusBanner.css';

export default function StatusBanner() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to status updates
    const unsubscribe = onSnapshot(
      doc(db, 'system-status', 'current'),
      (doc) => {
        if (doc.exists()) {
          setStatus(doc.data());
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching status:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return null;
  if (!status) return null;

  const getBannerClass = () => {
    switch (status.status) {
      case 'maintenance':
        return 'banner banner-warning';
      case 'error':
        return 'banner banner-error';
      case 'online':
      default:
        return null;
    }
  };

  const bannerClass = getBannerClass();
  if (!bannerClass) return null;

  return (
    <div className={bannerClass}>
      <div className="banner-content">
        <span className="banner-icon">
          {status.status === 'maintenance' ? '🔧' : '⚠️'}
        </span>
        <span className="banner-message">{status.message}</span>
        <span className="banner-time">
          Last updated: {new Date(status.lastUpdate).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
```

## Add Styling

```css
/* src/components/StatusBanner.css */
.banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  text-align: center;
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

.banner-warning {
  background-color: #ff9800;
  color: white;
}

.banner-error {
  background-color: #f44336;
  color: white;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
}

.banner-icon {
  font-size: 20px;
}

.banner-message {
  font-weight: 500;
  flex: 1;
}

.banner-time {
  font-size: 12px;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    gap: 4px;
  }
  
  .banner-time {
    font-size: 10px;
  }
}
```

## Use in Your App

```javascript
// src/App.jsx
import StatusBanner from './components/StatusBanner';

function App() {
  return (
    <div className="App">
      <StatusBanner />
      {/* Your app content */}
    </div>
  );
}

export default App;
```

## TypeScript Version

```typescript
// src/components/StatusBanner.tsx
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './StatusBanner.css';

interface SystemStatus {
  status: 'maintenance' | 'online' | 'error';
  message: string;
  lastUpdate: string;
  timestamp?: any;
}

export default function StatusBanner() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'system-status', 'current'),
      (doc) => {
        if (doc.exists()) {
          setStatus(doc.data() as SystemStatus);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching status:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return null;
  if (!status) return null;

  const getBannerClass = (): string | null => {
    switch (status.status) {
      case 'maintenance':
        return 'banner banner-warning';
      case 'error':
        return 'banner banner-error';
      case 'online':
      default:
        return null;
    }
  };

  const bannerClass = getBannerClass();
  if (!bannerClass) return null;

  return (
    <div className={bannerClass}>
      <div className="banner-content">
        <span className="banner-icon">
          {status.status === 'maintenance' ? '🔧' : '⚠️'}
        </span>
        <span className="banner-message">{status.message}</span>
        <span className="banner-time">
          Last updated: {new Date(status.lastUpdate).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
```

## Testing

You can test the integration by manually updating the status in the Firebase Console or by triggering the GitHub Actions workflow.

## Advanced: Auto-hide Success Messages

```javascript
export default function StatusBanner() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'system-status', 'current'),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setStatus(data);
          
          // Auto-hide "online" status after 10 seconds
          if (data.status === 'online') {
            setTimeout(() => setStatus(null), 10000);
          }
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ... rest of the component
}
```

## Next.js Version

```typescript
// app/components/StatusBanner.tsx
'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function StatusBanner() {
  // Same implementation as React version
}
```

Then include it in your layout:

```typescript
// app/layout.tsx
import StatusBanner from './components/StatusBanner';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StatusBanner />
        {children}
      </body>
    </html>
  );
}
```
