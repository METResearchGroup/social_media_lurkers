"use client";

import { useEffect, useState } from "react";
import {
  PostVariant,
  POST_VARIANTS,
  FEATURE_FLAG_KEY,
  VARIANT_OVERRIDE_KEY,
} from "@/types/variants";

/**
 * Hook to get the current post detail page variant
 * 
 * Priority:
 * 1. Manual override from localStorage (for testing)
 * 2. PostHog feature flag value
 * 3. Default to "control"
 * 
 * Implements sticky assignment - once a user is assigned a variant,
 * they stay in that variant via localStorage persistence.
 */
export function usePostVariant(): {
  variant: PostVariant;
  isLoading: boolean;
  setManualOverride: (variant: PostVariant | null) => void;
  clearOverride: () => void;
} {
  const [isClient, setIsClient] = useState(false);
  const [manualOverride, setManualOverride] = useState<PostVariant | null>(null);
  const [featureFlagVariant, setFeatureFlagVariant] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    setIsClient(true);
    
    // Check for manual override in localStorage
    if (typeof window !== "undefined") {
      const override = localStorage.getItem(VARIANT_OVERRIDE_KEY);
      if (override && isValidVariant(override)) {
        setManualOverride(override as PostVariant);
      }
      
      // Get variant from PostHog feature flag - poll until PostHog is loaded
      const checkFeatureFlag = async () => {
        const { getPostHog } = await import("@/lib/posthog");
        const posthog = getPostHog();
        if (posthog && posthog.getFeatureFlag) {
          const variant = posthog.getFeatureFlag(FEATURE_FLAG_KEY);
          // Convert variant to string or undefined
          if (typeof variant === "string") {
            setFeatureFlagVariant(variant);
          } else if (variant === false || variant === true) {
            setFeatureFlagVariant(variant.toString());
          } else {
            setFeatureFlagVariant(undefined);
          }
        } else {
          // Retry after a short delay if PostHog not loaded yet
          setTimeout(checkFeatureFlag, 100);
        }
      };
      
      checkFeatureFlag();
    }
  }, []);

  const setOverride = (variant: PostVariant | null) => {
    if (typeof window !== "undefined") {
      if (variant) {
        localStorage.setItem(VARIANT_OVERRIDE_KEY, variant);
        setManualOverride(variant);
      } else {
        localStorage.removeItem(VARIANT_OVERRIDE_KEY);
        setManualOverride(null);
      }
    }
  };

  const clearOverride = () => {
    setOverride(null);
  };

  // Determine final variant with priority order
  let variant: PostVariant = "control";
  
  if (manualOverride && isValidVariant(manualOverride)) {
    variant = manualOverride;
  } else if (featureFlagVariant && isValidVariant(featureFlagVariant)) {
    variant = featureFlagVariant as PostVariant;
  }

  return {
    variant,
    isLoading: !isClient,
    setManualOverride: setOverride,
    clearOverride,
  };
}

/**
 * Validate if a string is a valid PostVariant
 */
function isValidVariant(value: string): value is PostVariant {
  return POST_VARIANTS.includes(value as PostVariant);
}

