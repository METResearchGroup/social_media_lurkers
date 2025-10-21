/**
 * PostHog client interface
 */
interface PostHogClient {
  capture: (event: string, properties?: unknown) => void;
  getFeatureFlag: (key: string) => string | boolean | undefined;
}

/**
 * Window interface with PostHog
 */
interface WindowWithPostHog extends Window {
  posthog?: PostHogClient;
}

declare const window: WindowWithPostHog;

/**
 * Get PostHog client instance from window object
 * PostHog is loaded via script tag in providers.tsx to avoid SSR bundling issues
 */
export function getPostHog(): PostHogClient {
  if (typeof window === "undefined") {
    // SSR mock
    return { capture: () => {}, getFeatureFlag: () => undefined };
  }
  
  return window.posthog || { capture: () => {}, getFeatureFlag: () => undefined };
}

