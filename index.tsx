import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log('DataSwift: Initializing application...');

/**
 * PWA Service Worker Registration
 * We use an absolute URL derived from the current origin to prevent
 * origin mismatch errors in sandboxed environments.
 */
if ('serviceWorker' in navigator && (window.isSecureContext || window.location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    // Construct an absolute URL for the service worker to avoid origin confusion
    const swPath = `${window.location.origin}${window.location.pathname.replace(/\/$/, '')}/sw.js`;
    
    navigator.serviceWorker.register(swPath)
      .then(reg => {
        console.log('DataSwift: Service Worker registered successfully with scope:', reg.scope);
      })
      .catch(err => {
        // We log as a warning because SW might be blocked by browser settings or sandboxing
        console.warn('DataSwift: Service Worker registration skipped or failed:', err.message);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("DataSwift: Could not find root element to mount to");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('DataSwift: Application mounted successfully.');
} catch (error) {
  console.error('DataSwift: Fatal mount error:', error);
}