const fs = require('fs');
const path = require('path');

const cfg = {
  apiKey: process.env.VITE_API_KEY || '',
  authDomain: process.env.VITE_AUTH_DOMAIN || '',
  projectId: process.env.VITE_PROJECT_ID || '',
  storageBucket: process.env.VITE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_APP_ID || '',
  measurementId: process.env.VITE_MEASUREMENT_ID || ''
};

const missing = Object.entries(cfg)
  .filter(([_, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  console.warn('[generate-firebase-config] Missing Firebase env vars:', missing.join(', '));
}

const out = `window.FIREBASE_CONFIG = ${JSON.stringify(cfg)};`;
const outPath = path.resolve(process.cwd(), 'firebase-config.js');
fs.writeFileSync(outPath, out);
console.log('[generate-firebase-config] Wrote', outPath);

