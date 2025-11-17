# Example: Integration with Vue.js App

This example shows how to integrate the real-time status updates into a Vue.js application.

## Installation

```bash
npm install firebase
```

## Setup Firebase

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

## Vue 3 Composition API

```vue
<!-- src/components/StatusBanner.vue -->
<template>
  <div v-if="status && status.status !== 'online'" :class="bannerClass">
    <div class="banner-content">
      <span class="banner-icon">
        {{ status.status === 'maintenance' ? '🔧' : '⚠️' }}
      </span>
      <span class="banner-message">{{ status.message }}</span>
      <span class="banner-time">
        Last updated: {{ formatTime(status.lastUpdate) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const status = ref(null);
const loading = ref(true);
let unsubscribe = null;

const bannerClass = computed(() => {
  if (!status.value) return '';
  
  switch (status.value.status) {
    case 'maintenance':
      return 'banner banner-warning';
    case 'error':
      return 'banner banner-error';
    default:
      return '';
  }
});

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};

onMounted(() => {
  unsubscribe = onSnapshot(
    doc(db, 'system-status', 'current'),
    (doc) => {
      if (doc.exists()) {
        status.value = doc.data();
      }
      loading.value = false;
    },
    (error) => {
      console.error('Error fetching status:', error);
      loading.value = false;
    }
  );
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
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
</style>
```

## Vue 3 Options API

```vue
<!-- src/components/StatusBanner.vue -->
<template>
  <div v-if="status && status.status !== 'online'" :class="bannerClass">
    <div class="banner-content">
      <span class="banner-icon">
        {{ status.status === 'maintenance' ? '🔧' : '⚠️' }}
      </span>
      <span class="banner-message">{{ status.message }}</span>
      <span class="banner-time">
        Last updated: {{ formatTime(status.lastUpdate) }}
      </span>
    </div>
  </div>
</template>

<script>
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default {
  name: 'StatusBanner',
  data() {
    return {
      status: null,
      loading: true,
      unsubscribe: null
    };
  },
  computed: {
    bannerClass() {
      if (!this.status) return '';
      
      switch (this.status.status) {
        case 'maintenance':
          return 'banner banner-warning';
        case 'error':
          return 'banner banner-error';
        default:
          return '';
      }
    }
  },
  methods: {
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    }
  },
  mounted() {
    this.unsubscribe = onSnapshot(
      doc(db, 'system-status', 'current'),
      (doc) => {
        if (doc.exists()) {
          this.status = doc.data();
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching status:', error);
        this.loading = false;
      }
    );
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
};
</script>

<style scoped>
/* Same styles as Composition API version */
</style>
```

## Use in Your App

```vue
<!-- src/App.vue -->
<template>
  <div id="app">
    <StatusBanner />
    <!-- Your app content -->
  </div>
</template>

<script setup>
import StatusBanner from './components/StatusBanner.vue';
</script>
```

## TypeScript Version

```vue
<!-- src/components/StatusBanner.vue -->
<template>
  <div v-if="status && status.status !== 'online'" :class="bannerClass">
    <div class="banner-content">
      <span class="banner-icon">
        {{ status.status === 'maintenance' ? '🔧' : '⚠️' }}
      </span>
      <span class="banner-message">{{ status.message }}</span>
      <span class="banner-time">
        Last updated: {{ formatTime(status.lastUpdate) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '../firebase';

interface SystemStatus {
  status: 'maintenance' | 'online' | 'error';
  message: string;
  lastUpdate: string;
  timestamp?: any;
}

const status = ref<SystemStatus | null>(null);
const loading = ref(true);
let unsubscribe: Unsubscribe | null = null;

const bannerClass = computed(() => {
  if (!status.value) return '';
  
  switch (status.value.status) {
    case 'maintenance':
      return 'banner banner-warning';
    case 'error':
      return 'banner banner-error';
    default:
      return '';
  }
});

const formatTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString();
};

onMounted(() => {
  unsubscribe = onSnapshot(
    doc(db, 'system-status', 'current'),
    (doc) => {
      if (doc.exists()) {
        status.value = doc.data() as SystemStatus;
      }
      loading.value = false;
    },
    (error) => {
      console.error('Error fetching status:', error);
      loading.value = false;
    }
  );
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
/* Same styles as before */
</style>
```

## Composable for Reusability

```typescript
// src/composables/useSystemStatus.ts
import { ref, onMounted, onUnmounted } from 'vue';
import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '../firebase';

interface SystemStatus {
  status: 'maintenance' | 'online' | 'error';
  message: string;
  lastUpdate: string;
  timestamp?: any;
}

export function useSystemStatus() {
  const status = ref<SystemStatus | null>(null);
  const loading = ref(true);
  const error = ref<Error | null>(null);
  let unsubscribe: Unsubscribe | null = null;

  onMounted(() => {
    unsubscribe = onSnapshot(
      doc(db, 'system-status', 'current'),
      (doc) => {
        if (doc.exists()) {
          status.value = doc.data() as SystemStatus;
        }
        loading.value = false;
      },
      (err) => {
        console.error('Error fetching status:', err);
        error.value = err as Error;
        loading.value = false;
      }
    );
  });

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return {
    status,
    loading,
    error
  };
}
```

Usage with composable:

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useSystemStatus } from '../composables/useSystemStatus';

const { status, loading, error } = useSystemStatus();

const bannerClass = computed(() => {
  if (!status.value) return '';
  // ... same logic
});
</script>
```

## Nuxt 3 Version

```vue
<!-- components/StatusBanner.vue -->
<template>
  <div v-if="status && status.status !== 'online'" :class="bannerClass">
    <!-- Same template as Vue version -->
  </div>
</template>

<script setup lang="ts">
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '~/lib/firebase';

// Same implementation as Vue 3 Composition API
</script>
```

Then use it in your layout:

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <StatusBanner />
    <slot />
  </div>
</template>

<script setup>
// No imports needed, auto-imported
</script>
```
