import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { LoadingProvider, ToastProvider } from '@/store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoadingProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </LoadingProvider>
  </React.StrictMode>,
);