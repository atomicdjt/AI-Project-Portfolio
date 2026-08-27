import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { capturePageView, initializeAnalytics } from './analytics.js';
import './styles.css';
import './vercel-status.css';

void initializeAnalytics();
void capturePageView();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
