import type {
  AudienceStatistics,
  PoliticalBreakdown,
  AttitudeBreakdown,
  AudienceDataSource,
} from "@/types/audienceStats";

/**
 * Generate a random percentage breakdown that sums to 100
 * 
 * @param categories Number of categories to split into
 * @param minPercentage Minimum percentage for each category
 * @returns Array of percentages that sum to 100
 */
function generateRandomBreakdown(
  categories: number,
  minPercentage: number = 5
): number[] {
  // Generate random values
  const random = Array.from({ length: categories }, () => Math.random() + 0.1);
  const sum = random.reduce((a, b) => a + b, 0);
  
  // Normalize to percentages
  let percentages = random.map((r) => Math.round((r / sum) * 100));
  
  // Ensure minimum percentage for each category
  percentages = percentages.map((p) => Math.max(p, minPercentage));
  
  // Adjust to ensure sum is exactly 100
  const currentSum = percentages.reduce((a, b) => a + b, 0);
  if (currentSum !== 100) {
    const diff = 100 - currentSum;
    // Add/subtract difference to the largest category
    const maxIndex = percentages.indexOf(Math.max(...percentages));
    percentages[maxIndex] += diff;
  }
  
  return percentages;
}

/**
 * Generate random political breakdown
 */
function generatePoliticalBreakdown(): PoliticalBreakdown {
  const [liberal, moderate, conservative] = generateRandomBreakdown(3, 10);
  return { liberal, moderate, conservative };
}

/**
 * Generate random attitude breakdown
 */
function generateAttitudeBreakdown(): AttitudeBreakdown {
  const [support, neutral, oppose] = generateRandomBreakdown(3, 8);
  return { support, neutral, oppose };
}

/**
 * Generate commenter attitudes that diverge from viewer attitudes
 * This creates interesting comparison scenarios
 */
function generateCommenterAttitudes(
  viewerAttitudes: AttitudeBreakdown
): AttitudeBreakdown {
  // Add random divergence (-20% to +20%)
  const divergence = () => (Math.random() - 0.5) * 40;
  
  let support = Math.max(5, Math.min(90, viewerAttitudes.support + divergence()));
  let oppose = Math.max(5, Math.min(90, viewerAttitudes.oppose + divergence()));
  let neutral = 100 - support - oppose;
  
  // Ensure neutral is at least 5%
  if (neutral < 5) {
    const deficit = 5 - neutral;
    neutral = 5;
    // Take from the larger of support or oppose
    if (support > oppose) {
      support -= deficit;
    } else {
      oppose -= deficit;
    }
  }
  
  // Round to integers
  support = Math.round(support);
  oppose = Math.round(oppose);
  neutral = Math.round(neutral);
  
  // Final adjustment to ensure sum is 100
  const sum = support + neutral + oppose;
  if (sum !== 100) {
    neutral += 100 - sum;
  }
  
  return { support, neutral, oppose };
}

/**
 * Generate mock audience statistics for a post
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function generateMockAudienceStats(_postId: string): AudienceStatistics {
  // Generate random viewer count (100-500)
  const viewerCount = Math.floor(Math.random() * 400) + 100;
  
  // Generate political breakdown
  const political = generatePoliticalBreakdown();
  
  // Generate viewer attitudes
  const attitudes = generateAttitudeBreakdown();
  
  // Generate commenter attitudes with divergence
  const commenterAttitudes = generateCommenterAttitudes(attitudes);
  
  return {
    viewerCount,
    political,
    attitudes,
    commenterAttitudes,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Validate that a breakdown sums to 100%
 */
export function validateBreakdown(
  breakdown: PoliticalBreakdown | AttitudeBreakdown
): boolean {
  const values = Object.values(breakdown);
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.abs(sum - 100) < 0.01; // Allow tiny floating point errors
}

/**
 * Mock data source implementation
 */
export class MockAudienceDataSource implements AudienceDataSource {
  private cache: Map<string, AudienceStatistics> = new Map();
  
  async getAudienceStats(postId: string): Promise<AudienceStatistics> {
    // Check cache for session consistency
    if (this.cache.has(postId)) {
      return this.cache.get(postId)!;
    }
    
    // Generate new stats
    const stats = generateMockAudienceStats(postId);
    this.cache.set(postId, stats);
    
    return stats;
  }
  
  isAvailable(): boolean {
    return true;
  }
  
  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Singleton instance of mock data source
 */
export const mockDataSource = new MockAudienceDataSource();

