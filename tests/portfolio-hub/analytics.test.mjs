import assert from 'node:assert/strict';
import test from 'node:test';
import { ANALYTICS_EVENTS, createAnalytics, getAnalyticsConfig, getPageProperties } from '../../apps/portfolio-hub/src/analytics.js';

const configuredEnv = { VITE_POSTHOG_KEY: 'phc_test', VITE_POSTHOG_HOST: 'https://us.i.posthog.com' };
const location = { pathname: '/review', search: '?utm_source=github&utm_medium=referral&email=not-captured@example.com' };

test('analytics is disabled safely without complete HTTPS configuration', async () => {
  let loaded = false;
  const analytics = createAnalytics({ env: { VITE_POSTHOG_KEY: 'phc_test' }, loadClient: () => { loaded = true; } });

  await analytics.initialize();
  await analytics.capture(ANALYTICS_EVENTS.CTA_CLICKED, { cta_name: 'review_work' });

  assert.equal(loaded, false);
  assert.equal(getAnalyticsConfig({ VITE_POSTHOG_KEY: 'phc_test', VITE_POSTHOG_HOST: 'http://localhost' }), null);
});

test('analytics initializes once and captures one manual pageview per document load', async () => {
  const calls = [];
  const posthog = { init: (...args) => calls.push(['init', ...args]), capture: (...args) => calls.push(['capture', ...args]) };
  const analytics = createAnalytics({ env: configuredEnv, location, referrer: 'https://github.com/atomicdjt', loadClient: () => ({ default: posthog }) });

  await Promise.all([analytics.initialize(), analytics.initialize()]);
  await analytics.capturePageView();
  await analytics.capturePageView();

  assert.equal(calls.filter(([method]) => method === 'init').length, 1);
  assert.equal(calls.filter(([method, event]) => method === 'capture' && event === '$pageview').length, 1);
  const [, , options] = calls.find(([method]) => method === 'init');
  assert.deepEqual(options, {
    api_host: 'https://us.i.posthog.com', autocapture: false, capture_exceptions: false, capture_pageleave: false,
    capture_pageview: false, disable_capture_url_hashes: true, disable_session_recording: true, disable_surveys: true,
    persistence: 'memory', person_profiles: 'never', property_denylist: ['$current_url', '$referrer', '$referring_domain', '$email', '$name', 'email', 'name'], respect_dnt: true,
  });
});

test('explicit project and CTA events contain only allowlisted page context', async () => {
  const calls = [];
  const posthog = { init: () => {}, capture: (...args) => calls.push(args) };
  const analytics = createAnalytics({ env: configuredEnv, location, referrer: 'https://github.com/atomicdjt/example?private=value', loadClient: () => ({ default: posthog }) });

  await analytics.capture(ANALYTICS_EVENTS.PROJECT_VIEWED, { project_slug: 'validation-ledger', project_name: 'Validation Ledger', surface: 'flagship_card' });
  await analytics.capture(ANALYTICS_EVENTS.CTA_CLICKED, { cta_name: 'review_work', destination_type: 'technical_review', surface: 'home' });

  assert.deepEqual(calls[0], [ANALYTICS_EVENTS.PROJECT_VIEWED, {
    page_path: '/review', utm_source: 'github', utm_medium: 'referral', referrer_origin: 'https://github.com',
    project_slug: 'validation-ledger', project_name: 'Validation Ledger', surface: 'flagship_card',
  }]);
  assert.equal(calls[1][0], ANALYTICS_EVENTS.CTA_CLICKED);
  assert.equal(calls[1][1].email, undefined);
  assert.equal(calls[1][1].referrer_origin, 'https://github.com');
  assert.deepEqual(getPageProperties(location, 'not a URL'), { page_path: '/review', utm_source: 'github', utm_medium: 'referral' });
});

test('analytics failures do not reject user-triggered capture', async () => {
  const analytics = createAnalytics({ env: configuredEnv, loadClient: () => ({ default: { init: () => {}, capture: () => { throw new Error('blocked'); } } }) });
  await assert.doesNotReject(analytics.capture(ANALYTICS_EVENTS.DEMO_STARTED, { project_slug: 'buildworld-ai' }));
  await assert.doesNotReject(createAnalytics({ env: configuredEnv, loadClient: () => { throw new Error('blocked'); } }).initialize());
});
