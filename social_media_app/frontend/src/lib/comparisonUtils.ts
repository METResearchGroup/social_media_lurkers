import type { AttitudeBreakdown } from "@/types/audienceStats";

/**
 * Calculate the absolute difference between two attitude breakdowns
 */
export function calculateDivergence(
  attitudes1: AttitudeBreakdown,
  attitudes2: AttitudeBreakdown
): number {
  const supportDiff = Math.abs(attitudes1.support - attitudes2.support);
  const neutralDiff = Math.abs(attitudes1.neutral - attitudes2.neutral);
  const opposeDiff = Math.abs(attitudes1.oppose - attitudes2.oppose);

  // Average absolute difference across all categories
  return (supportDiff + neutralDiff + opposeDiff) / 3;
}

/**
 * Determine if there is significant divergence between attitudes
 * Threshold: average difference > 15%
 */
export function hasSignificantDivergence(
  commenterAttitudes: AttitudeBreakdown,
  viewerAttitudes: AttitudeBreakdown
): boolean {
  const divergence = calculateDivergence(commenterAttitudes, viewerAttitudes);
  return divergence > 15;
}

/**
 * Get divergence level description
 */
export function getDivergenceLevel(divergence: number): "low" | "moderate" | "high" {
  if (divergence < 10) return "low";
  if (divergence < 20) return "moderate";
  return "high";
}

/**
 * Get the dominant attitude (highest percentage)
 */
export function getDominantAttitude(
  attitudes: AttitudeBreakdown
): "support" | "neutral" | "oppose" {
  const { support, neutral, oppose } = attitudes;

  if (support > neutral && support > oppose) return "support";
  if (oppose > neutral && oppose > support) return "oppose";
  return "neutral";
}

/**
 * Compare dominant attitudes between commenters and viewers
 */
export function compareDominantAttitudes(
  commenterAttitudes: AttitudeBreakdown,
  viewerAttitudes: AttitudeBreakdown
): {
  commenters: "support" | "neutral" | "oppose";
  viewers: "support" | "neutral" | "oppose";
  areDifferent: boolean;
} {
  const commenters = getDominantAttitude(commenterAttitudes);
  const viewers = getDominantAttitude(viewerAttitudes);

  return {
    commenters,
    viewers,
    areDifferent: commenters !== viewers,
  };
}

/**
 * Get warning message based on divergence level
 */
export function getWarningMessage(divergence: number): string {
  const level = getDivergenceLevel(divergence);

  switch (level) {
    case "high":
      return "⚠️ Strong divergence detected: The visible comments are significantly different from the overall audience views.";
    case "moderate":
      return "⚠️ Moderate divergence: The comments may not fully represent all viewers.";
    case "low":
      return "ℹ️ Low divergence: The comments generally align with overall viewer attitudes.";
  }
}
