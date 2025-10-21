import type {
  EngagementType,
  PostViewedProperties,
  PostEngagementProperties,
  PostDwellTimeProperties,
  PostScrollDepthProperties,
} from "@/types/events";
import type { PostVariant } from "@/types/variants";

/**
 * Get PostHog instance dynamically to avoid SSR issues
 */
async function getPostHogAsync() {
  if (typeof window === "undefined") {
    return null;
  }
  
  try {
    const { getPostHog } = await import("./posthog");
    return getPostHog();
  } catch (error) {
    console.error("Failed to load PostHog:", error);
    return null;
  }
}

/**
 * Track when a post detail page is viewed
 */
export async function trackPostViewed(postId: string, variant: PostVariant): Promise<void> {
  const posthog = await getPostHogAsync();
  if (!posthog) return;
  
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
export async function trackPostEngagement(
  postId: string,
  variant: PostVariant,
  engagementType: EngagementType
): Promise<void> {
  const posthog = await getPostHogAsync();
  if (!posthog) return;
  
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
export async function trackPostDwellTime(
  postId: string,
  variant: PostVariant,
  dwellTimeSeconds: number,
  wasVisible: boolean
): Promise<void> {
  const posthog = await getPostHogAsync();
  if (!posthog) return;
  
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
export async function trackPostScrollDepth(
  postId: string,
  variant: PostVariant,
  scrollPercentage: number,
  maxScrollReached: number
): Promise<void> {
  const posthog = await getPostHogAsync();
  if (!posthog) return;
  
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
 * Set up dwell time tracking with Page Visibility API
 * Returns cleanup function
 */
export function setupDwellTimeTracking(
  postId: string,
  variant: PostVariant,
  enabled: boolean = true
): () => void {
  if (!enabled || typeof window === "undefined") {
    return () => {};
  }

  const startTime = Date.now();
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

  const handleBeforeUnload = async () => {
    const now = Date.now();
    if (wasVisible) {
      totalVisibleTime += now - lastVisibilityChange;
    }
    const totalTime = (now - startTime) / 1000;
    const visibleTime = totalVisibleTime / 1000;
    
    // Track dwell time
    await trackPostDwellTime(postId, variant, totalTime, visibleTime > totalTime * 0.5);
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
 * Set up scroll depth tracking
 * Returns cleanup function
 */
export function setupScrollDepthTracking(
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

  const sendScrollDepth = async () => {
    const currentScroll = calculateScrollPercentage();
    await trackPostScrollDepth(postId, variant, currentScroll, maxScrollDepth);
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

