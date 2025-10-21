import { getPostHog } from "./posthog";
import type {
  EngagementType,
  PostViewedProperties,
  PostEngagementProperties,
  PostDwellTimeProperties,
  PostScrollDepthProperties,
} from "@/types/events";
import type { PostVariant } from "@/types/variants";

/**
 * Track when a post detail page is viewed
 */
export function trackPostViewed(postId: string, variant: PostVariant): void {
  if (typeof window === "undefined") return;
  
  const posthog = getPostHog();
  if (!posthog || !posthog.capture) return;
  
  const properties: PostViewedProperties = {
    post_id: postId,
    variant,
    timestamp: new Date().toISOString(),
  };

  posthog.capture("post_viewed", properties);
}

/**
 * Track engagement events (like, comment, share, etc.)
 */
export function trackPostEngagement(
  postId: string,
  variant: PostVariant,
  engagementType: EngagementType
): void {
  if (typeof window === "undefined") return;
  
  const posthog = getPostHog();
  if (!posthog || !posthog.capture) return;
  
  const isPositive = ["like", "comment", "share", "profile_click"].includes(engagementType);
  
  const properties: PostEngagementProperties = {
    post_id: postId,
    variant,
    engagement_type: engagementType,
    is_positive: isPositive,
    timestamp: new Date().toISOString(),
  };

  posthog.capture("post_engagement", properties);
}

/**
 * Track dwell time on post detail page
 */
export function trackPostDwellTime(
  postId: string,
  variant: PostVariant,
  dwellTimeSeconds: number,
  wasVisible: boolean
): void {
  if (typeof window === "undefined") return;
  
  const posthog = getPostHog();
  if (!posthog || !posthog.capture) return;
  
  const properties: PostDwellTimeProperties = {
    post_id: postId,
    variant,
    dwell_time_seconds: Math.round(dwellTimeSeconds),
    was_visible: wasVisible,
    timestamp: new Date().toISOString(),
  };

  posthog.capture("post_dwell_time", properties);
}

/**
 * Track scroll depth on post detail page
 */
export function trackPostScrollDepth(
  postId: string,
  variant: PostVariant,
  scrollPercentage: number,
  maxScrollReached: number
): void {
  if (typeof window === "undefined") return;
  
  const posthog = getPostHog();
  if (!posthog || !posthog.capture) return;
  
  const properties: PostScrollDepthProperties = {
    post_id: postId,
    variant,
    scroll_percentage: Math.min(100, Math.max(0, Math.round(scrollPercentage))),
    max_scroll_reached: Math.min(100, Math.max(0, Math.round(maxScrollReached))),
    timestamp: new Date().toISOString(),
  };

  posthog.capture("post_scroll_depth", properties);
}

/**
 * Hook for tracking dwell time with Page Visibility API
 * Returns cleanup function
 */
export function useDwellTimeTracking(
  postId: string,
  variant: PostVariant,
  enabled: boolean = true
): () => void {
  if (!enabled || typeof window === "undefined") {
    return () => {};
  }

  let startTime = Date.now();
  let totalVisibleTime = 0;
  let wasVisible = !document.hidden;
  let lastVisibilityChange = Date.now();

  const handleVisibilityChange = () => {
    const now = Date.now();
    if (!document.hidden && !wasVisible) {
      // Page became visible
      lastVisibilityChange = now;
      wasVisible = true;
    } else if (document.hidden && wasVisible) {
      // Page became hidden
      totalVisibleTime += now - lastVisibilityChange;
      wasVisible = false;
    }
  };

  const handleBeforeUnload = () => {
    const now = Date.now();
    if (wasVisible) {
      totalVisibleTime += now - lastVisibilityChange;
    }
    const totalTime = (now - startTime) / 1000;
    const visibleTime = totalVisibleTime / 1000;
    
    // Track dwell time
    trackPostDwellTime(postId, variant, totalTime, visibleTime > totalTime * 0.5);
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("beforeunload", handleBeforeUnload);
    
    // Send final dwell time on cleanup
    const now = Date.now();
    if (wasVisible) {
      totalVisibleTime += now - lastVisibilityChange;
    }
    const totalTime = (now - startTime) / 1000;
    const visibleTime = totalVisibleTime / 1000;
    trackPostDwellTime(postId, variant, totalTime, visibleTime > totalTime * 0.5);
  };
}

/**
 * Hook for tracking scroll depth with IntersectionObserver
 * Returns cleanup function
 */
export function useScrollDepthTracking(
  postId: string,
  variant: PostVariant,
  enabled: boolean = true
): () => void {
  if (!enabled || typeof window === "undefined") {
    return () => {};
  }

  let maxScrollDepth = 0;
  let scrollCheckInterval: NodeJS.Timeout | null = null;

  const calculateScrollPercentage = (): number => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if (documentHeight <= windowHeight) {
      return 100;
    }
    
    return (scrollTop / (documentHeight - windowHeight)) * 100;
  };

  const handleScroll = () => {
    const currentScroll = calculateScrollPercentage();
    maxScrollDepth = Math.max(maxScrollDepth, currentScroll);
  };

  const sendScrollDepth = () => {
    const currentScroll = calculateScrollPercentage();
    trackPostScrollDepth(postId, variant, currentScroll, maxScrollDepth);
  };

  // Track scroll events
  window.addEventListener("scroll", handleScroll, { passive: true });
  
  // Send scroll depth periodically (every 5 seconds)
  scrollCheckInterval = setInterval(sendScrollDepth, 5000);
  
  // Send on page exit
  window.addEventListener("beforeunload", sendScrollDepth);

  return () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("beforeunload", sendScrollDepth);
    if (scrollCheckInterval) {
      clearInterval(scrollCheckInterval);
    }
    sendScrollDepth(); // Send final scroll depth
  };
}

