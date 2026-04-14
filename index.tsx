import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress "Failed to fetch" errors globally
const suppressFetchErrors = (event: ErrorEvent | PromiseRejectionEvent) => {
  const error = 'error' in event ? event.error : event.reason;
  const errMsg = typeof error === 'string' ? error : (error?.message || '');
  
  if (errMsg.includes('Failed to fetch') || errMsg.includes('fetch failed') || errMsg.includes('Network Error') || errMsg.includes('Lock broken')) {
    event.preventDefault(); // Prevent the error from being reported to the console/overlay
    console.warn('Suppressed global network error:', errMsg);
  }
};

window.addEventListener('error', suppressFetchErrors);
window.addEventListener('unhandledrejection', suppressFetchErrors);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);