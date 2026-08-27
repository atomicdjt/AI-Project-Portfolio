const POSTHOG_DENYLIST = ['$current_url', '$referrer', '$referring_domain', '$email', '$name', 'email', 'name'];
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
const EMAIL_LIKE_VALUE = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/i;

export const ANALYTICS_EVENTS = {
  CTA_CLICKED: 'cta_clicked',
  DEMO_STARTED: 'demo_started',
  GITHUB_CLICKED: 'github_clicked',
  PROJECT_VIEWED: 'project_viewed',
};

const normalizeValue = (value) => typeof value === 'string' && value.trim() ? value.trim().slice(0, 120) : undefined;

export function getAnalyticsConfig(env = {}) {
  const key = normalizeValue(env.VITE_POSTHOG_KEY);
  const host = normalizeValue(env.VITE_POSTHOG_HOST);
  return key && host?.startsWith('https://') ? { key, host } : null;
}

export function getPageProperties(location = globalThis.location, referrer = globalThis.document?.referrer) {
  const properties = { page_path: location?.pathname || '/' };

  try {
    const params = new URLSearchParams(location?.search || '');
    for (const key of UTM_KEYS) {
      const value = normalizeValue(params.get(key));
      if (value && !EMAIL_LIKE_VALUE.test(value)) properties[key] = value;
    }
  } catch {
    // Analytics must never make an invalid browser URL operationally significant.
  }

  try {
    if (referrer) properties.referrer_origin = new URL(referrer).origin;
  } catch {
    // Referrer data is optional and deliberately reduced to an origin when valid.
  }

  return properties;
}

const posthogOptions = (host) => ({
  api_host: host,
  autocapture: false,
  capture_exceptions: false,
  capture_pageleave: false,
  capture_pageview: false,
  disable_capture_url_hashes: true,
  disable_session_recording: true,
  disable_surveys: true,
  persistence: 'memory',
  person_profiles: 'never',
  property_denylist: POSTHOG_DENYLIST,
  respect_dnt: true,
});

export function createAnalytics({ env, loadClient, location, referrer } = {}) {
  const config = getAnalyticsConfig(env);
  const getLocation = () => location || globalThis.location;
  const getReferrer = () => referrer ?? globalThis.document?.referrer;
  let clientPromise;
  let pageviewCaptured = false;

  const client = () => {
    if (!config) return Promise.resolve(null);
    if (!clientPromise) {
      clientPromise = Promise.resolve().then(loadClient).then(({ default: posthog }) => {
        posthog.init(config.key, posthogOptions(config.host));
        return posthog;
      }).catch(() => null);
    }
    return clientPromise;
  };

  const capture = (event, properties = {}) => client().then((posthog) => {
    if (!posthog) return;
    try {
      posthog.capture(event, { ...getPageProperties(getLocation(), getReferrer()), ...properties });
    } catch {
      // Analytics is observational: a blocked or failing SDK cannot break a user action.
    }
  });

  return {
    initialize: () => client(),
    capture,
    capturePageView: () => {
      if (pageviewCaptured) return Promise.resolve();
      pageviewCaptured = true;
      return capture('$pageview');
    },
  };
}

const analytics = createAnalytics({
  env: import.meta.env,
  loadClient: () => import('posthog-js'),
});

export const initializeAnalytics = () => analytics.initialize();
export const capturePageView = () => analytics.capturePageView();
export const trackCtaClicked = (properties) => analytics.capture(ANALYTICS_EVENTS.CTA_CLICKED, properties);
export const trackDemoStarted = (properties) => analytics.capture(ANALYTICS_EVENTS.DEMO_STARTED, properties);
export const trackGithubClicked = (properties) => analytics.capture(ANALYTICS_EVENTS.GITHUB_CLICKED, properties);
export const trackProjectViewed = (properties) => analytics.capture(ANALYTICS_EVENTS.PROJECT_VIEWED, properties);
