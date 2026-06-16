import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest does not enable Testing Library's global cleanup hook automatically.
afterEach(() => cleanup());
