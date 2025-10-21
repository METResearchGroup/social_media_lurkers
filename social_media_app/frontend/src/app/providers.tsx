"use client";

import { useEffect } from "react";

// PostHog instance
let posthogLoaded = false;

/**
 * Initialize PostHog on client side only
 */
function initPostHog() {
  if (typeof window === "undefined" || posthogLoaded) return;

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
      };
    }

    if (posthogKey && posthogHost && (window as WindowWithPostHog).posthog) {
      (window as WindowWithPostHog).posthog!.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: "identified_only",
        capture_pageview: false,
        capture_pageleave: true,
        loaded: () => {
          if (process.env.NODE_ENV === "development") {
            console.log("PostHog initialized");
          }
        },
      });
      posthogLoaded = true;
    }
  };
  
  document.head.appendChild(script);
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return <>{children}</>;
}

