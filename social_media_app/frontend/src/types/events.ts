import { PostVariant } from "./variants";

/**
 * Event taxonomy for PostHog tracking
 */

export type EventName =
  | "post_viewed"
  | "post_engagement"
  | "post_dwell_time"
  | "post_scroll_depth";

export type EngagementType = "like" | "comment" | "share" | "profile_click" | "back_button";

/**
 * Properties for post_viewed event
 */
export interface PostViewedProperties {
  post_id: string;
  variant: PostVariant;
  timestamp: string;
}

/**
 * Properties for post_engagement event
 */
export interface PostEngagementProperties {
  post_id: string;
  variant: PostVariant;
  engagement_type: EngagementType;
  is_positive: boolean; // true for like/comment/share/profile, false for back_button
  timestamp: string;
}

/**
 * Properties for post_dwell_time event
 */
export interface PostDwellTimeProperties {
  post_id: string;
  variant: PostVariant;
  dwell_time_seconds: number;
  was_visible: boolean; // Was the page visible during measurement
  timestamp: string;
}

/**
 * Properties for post_scroll_depth event
 */
export interface PostScrollDepthProperties {
  post_id: string;
  variant: PostVariant;
  scroll_percentage: number; // 0-100
  max_scroll_reached: number; // 0-100, maximum scroll depth reached
  timestamp: string;
}

/**
 * Union type for all event properties
 */
export type EventProperties =
  | PostViewedProperties
  | PostEngagementProperties
  | PostDwellTimeProperties
  | PostScrollDepthProperties;

