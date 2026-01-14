import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log('DataSwift: Initializing application...');

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