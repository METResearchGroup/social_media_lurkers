/**
 * Audience Statistics Types for A/B Testing Variants
 */

/**
 * Political breakdown of post viewers
 */
export interface PoliticalBreakdown {
  liberal: number; // Percentage (0-100)
  moderate: number; // Percentage (0-100)
  conservative: number; // Percentage (0-100)
}

/**
 * Attitude breakdown on post topic
 */
export interface AttitudeBreakdown {
  support: number; // Percentage (0-100)
  neutral: number; // Percentage (0-100)
  oppose: number; // Percentage (0-100)
}

/**
 * Complete audience statistics for a post
 */
export interface AudienceStatistics {
  viewerCount: number; // Total number of viewers
  political: PoliticalBreakdown;
  attitudes: AttitudeBreakdown;
  commenterAttitudes: AttitudeBreakdown; // Attitudes of only those who commented
  lastUpdated: string; // ISO timestamp
}

/**
 * Interface for future real data source
 * This allows easy swapping between mock and real data
 */
export interface AudienceDataSource {
  getAudienceStats(postId: string): Promise<AudienceStatistics>;
  isAvailable(): boolean;
}

