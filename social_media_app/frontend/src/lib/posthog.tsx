"use client";

import { useEffect, useState } from "react";

// Lazy load PostHog to avoid SSR issues
let posthog: any = null;
let PostHogProvider: any = null;

/**
 * Initialize PostHog client-side only
 */
export async function initPostHog() {
  if (typeof window === "undefined") {
    return null;
  }

  if (posthog) {
    return posthog;
  }

  try {
    // Dynamic import to avoid SSR issues
    const { default: posthogModule } = await import("posthog-js");
    posthog = posthogModule;

    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (posthogKey && posthogHost) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: "identified_only",
        capture_pageview: false, // We'll handle this manually
        capture_pageleave: true,
        loaded: (ph: any) => {
          if (process.env.NODE_ENV === "development") {
            console.log("PostHog initialized");
          }
        },
      });
    } else {
      console.warn("PostHog credentials not found in environment variables");
    }
  } catch (error) {
    console.error("Failed to initialize PostHog:", error);
  }

  return posthog;
}

/**
 * PostHog Provider component for Next.js App Router
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initPostHog().then(() => {
      setIsInitialized(true);
    });
  }, []);

  // Render children directly without PostHog provider wrapper
  // PostHog works globally once initialized
  return <>{children}</>;
}

/**
 * Get PostHog client instance
 */
export function getPostHog() {
  if (typeof window === "undefined") {
    // Return mock object for SSR
    return {
      capture: () => {},
      init: () => {},
    };
  }
  return posthog || { capture: () => {}, init: () => {} };
}

