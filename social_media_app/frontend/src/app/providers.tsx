"use client";

import { useEffect } from "react";

// PostHog instance tracking
let posthogLoaded = false;
let isInitializing = false;

/**
 * Initialize PostHog on client side only
 */
function initPostHog() {
  if (typeof window === "undefined" || posthogLoaded || isInitializing) return;

  isInitializing = true;

  // Load PostHog script dynamically
  const script = document.createElement("script");
  script.src = "https://us-assets.i.posthog.com/static/array.js";
  script.async = true;
  script.onload = () => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    interface WindowWithPostHog extends Window {
      posthog?: {
        init: (key: string, config: Record<string, unknown>) => void;
        __loaded?: boolean;
      };
    }

    const windowWithPH = window as WindowWithPostHog;

    if (posthogKey && posthogHost && windowWithPH.posthog && !windowWithPH.posthog.__loaded) {
      windowWithPH.posthog.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: "identified_only",
        capture_pageview: false,
        capture_pageleave: true,
        loaded: () => {
          if (process.env.NODE_ENV === "development") {
            console.log("PostHog initialized");
          }
          posthogLoaded = true;
          isInitializing = false;
        },
      });
    } else {
      isInitializing = false;
    }
  };
  
  script.onerror = () => {
    console.error("Failed to load PostHog script");
    isInitializing = false;
  };
  
  document.head.appendChild(script);
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return <>{children}</>;
}

