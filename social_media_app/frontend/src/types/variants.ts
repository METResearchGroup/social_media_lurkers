/**
 * PostHog A/B Test Variants for Post Detail Page
 */
export type PostVariant = "control" | "treatment" | "comparison";

export const POST_VARIANTS: PostVariant[] = ["control", "treatment", "comparison"];

export const VARIANT_DISPLAY_NAMES: Record<PostVariant, string> = {
  control: "Control (Current Design)",
  treatment: "Treatment (Audience Statistics)",
  comparison: "Comparison (Representation)",
};

export const FEATURE_FLAG_KEY = "post_detail_variant_test";
export const VARIANT_OVERRIDE_KEY = "posthog_variant_override";

