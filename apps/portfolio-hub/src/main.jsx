import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { capturePageView, initializeAnalytics } from './analytics.js';
import './styles.css';
import './vercel-status.css';

void initializeAnalytics();
void capturePageView();

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <App pathname={window.location.pathname} />
  </StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
