import {
  generateMockAudienceStats,
  validateBreakdown,
  MockAudienceDataSource,
  mockDataSource,
} from "../mockData";
import type { AudienceStatistics } from "@/types/audienceStats";

describe("Mock Data System", () => {
  describe("generateMockAudienceStats", () => {
    it("should generate complete audience statistics", () => {
      const result = generateMockAudienceStats("test-post-1");

      expect(result).toHaveProperty("viewerCount");
      expect(result).toHaveProperty("political");
      expect(result).toHaveProperty("attitudes");
      expect(result).toHaveProperty("commenterAttitudes");
      expect(result).toHaveProperty("lastUpdated");
    });

    it("should generate viewer count in valid range", () => {
      const result = generateMockAudienceStats("test-post-1");

      expect(result.viewerCount).toBeGreaterThanOrEqual(100);
      expect(result.viewerCount).toBeLessThanOrEqual(500);
      expect(Number.isInteger(result.viewerCount)).toBe(true);
    });

    it("should generate valid political breakdown", () => {
      const result = generateMockAudienceStats("test-post-1");

      expect(result.political).toHaveProperty("liberal");
      expect(result.political).toHaveProperty("moderate");
      expect(result.political).toHaveProperty("conservative");
      
      expect(result.political.liberal).toBeGreaterThanOrEqual(0);
      expect(result.political.moderate).toBeGreaterThanOrEqual(0);
      expect(result.political.conservative).toBeGreaterThanOrEqual(0);
      
      expect(validateBreakdown(result.political)).toBe(true);
    });

    it("should generate valid attitude breakdown", () => {
      const result = generateMockAudienceStats("test-post-1");

      expect(result.attitudes).toHaveProperty("support");
      expect(result.attitudes).toHaveProperty("neutral");
      expect(result.attitudes).toHaveProperty("oppose");
      
      expect(validateBreakdown(result.attitudes)).toBe(true);
    });

    it("should generate valid commenter attitude breakdown", () => {
      const result = generateMockAudienceStats("test-post-1");

      expect(result.commenterAttitudes).toHaveProperty("support");
      expect(result.commenterAttitudes).toHaveProperty("neutral");
      expect(result.commenterAttitudes).toHaveProperty("oppose");
      
      expect(validateBreakdown(result.commenterAttitudes)).toBe(true);
    });

    it("should include ISO timestamp", () => {
      const result = generateMockAudienceStats("test-post-1");

      expect(result.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(new Date(result.lastUpdated).toString()).not.toBe("Invalid Date");
    });

    it("should generate different data for different posts", () => {
      const result1 = generateMockAudienceStats("post-1");
      const result2 = generateMockAudienceStats("post-2");

      // At least one value should be different (statistically extremely likely)
      const isDifferent =
        result1.viewerCount !== result2.viewerCount ||
        result1.political.liberal !== result2.political.liberal ||
        result1.attitudes.support !== result2.attitudes.support;
      
      expect(isDifferent).toBe(true);
    });

    it("should generate randomized data on multiple calls", () => {
      const results = Array.from({ length: 5 }, () =>
        generateMockAudienceStats(`post-${Math.random()}`)
      );

      // All results should have different viewer counts (statistically likely)
      const viewerCounts = results.map((r) => r.viewerCount);
      const uniqueCounts = new Set(viewerCounts);
      
      expect(uniqueCounts.size).toBeGreaterThan(1);
    });
  });

  describe("validateBreakdown", () => {
    it("should validate correct political breakdown", () => {
      const expected = true;
      
      const breakdown = {
        liberal: 40,
        moderate: 30,
        conservative: 30,
      };

      const result = validateBreakdown(breakdown);
      expect(result).toBe(expected);
    });

    it("should validate correct attitude breakdown", () => {
      const expected = true;
      
      const breakdown = {
        support: 50,
        neutral: 25,
        oppose: 25,
      };

      const result = validateBreakdown(breakdown);
      expect(result).toBe(expected);
    });

    it("should reject breakdown that does not sum to 100", () => {
      const expected = false;
      
      const breakdown = {
        liberal: 40,
        moderate: 30,
        conservative: 25, // Sums to 95
      };

      const result = validateBreakdown(breakdown);
      expect(result).toBe(expected);
    });

    it("should reject breakdown that sums above 100", () => {
      const expected = false;
      
      const breakdown = {
        support: 50,
        neutral: 30,
        oppose: 25, // Sums to 105
      };

      const result = validateBreakdown(breakdown);
      expect(result).toBe(expected);
    });

    it("should handle floating point precision errors", () => {
      const expected = true;
      
      const breakdown = {
        liberal: 33.33,
        moderate: 33.33,
        conservative: 33.34, // Sums to 100.00
      };

      const result = validateBreakdown(breakdown);
      expect(result).toBe(expected);
    });
  });

  describe("MockAudienceDataSource", () => {
    let dataSource: MockAudienceDataSource;

    beforeEach(() => {
      dataSource = new MockAudienceDataSource();
    });

    it("should be available", () => {
      expect(dataSource.isAvailable()).toBe(true);
    });

    it("should return audience statistics", async () => {
      const result = await dataSource.getAudienceStats("test-post");

      expect(result).toHaveProperty("viewerCount");
      expect(result).toHaveProperty("political");
      expect(result).toHaveProperty("attitudes");
    });

    it("should cache results for same post ID", async () => {
      const result1 = await dataSource.getAudienceStats("test-post");
      const result2 = await dataSource.getAudienceStats("test-post");

      expect(result1).toEqual(result2);
      expect(result1.viewerCount).toBe(result2.viewerCount);
      expect(result1.lastUpdated).toBe(result2.lastUpdated);
    });

    it("should return different results for different post IDs", async () => {
      const result1 = await dataSource.getAudienceStats("post-1");
      const result2 = await dataSource.getAudienceStats("post-2");

      const isDifferent =
        result1.viewerCount !== result2.viewerCount ||
        result1.political.liberal !== result2.political.liberal;
      
      expect(isDifferent).toBe(true);
    });

    it("should clear cache when requested", async () => {
      const result1 = await dataSource.getAudienceStats("test-post");
      
      dataSource.clearCache();
      
      const result2 = await dataSource.getAudienceStats("test-post");

      // After cache clear, should get new data (likely different)
      const isDifferent =
        result1.viewerCount !== result2.viewerCount ||
        result1.lastUpdated !== result2.lastUpdated;
      
      expect(isDifferent).toBe(true);
    });
  });

  describe("mockDataSource singleton", () => {
    it("should be an instance of MockAudienceDataSource", () => {
      expect(mockDataSource).toBeInstanceOf(MockAudienceDataSource);
    });

    it("should return valid data", async () => {
      const result = await mockDataSource.getAudienceStats("singleton-test");

      expect(result).toHaveProperty("viewerCount");
      expect(validateBreakdown(result.political)).toBe(true);
      expect(validateBreakdown(result.attitudes)).toBe(true);
    });
  });

  describe("data quality validation", () => {
    it("should generate all percentages as integers", () => {
      const result = generateMockAudienceStats("test-post");

      expect(Number.isInteger(result.political.liberal)).toBe(true);
      expect(Number.isInteger(result.political.moderate)).toBe(true);
      expect(Number.isInteger(result.political.conservative)).toBe(true);
      expect(Number.isInteger(result.attitudes.support)).toBe(true);
      expect(Number.isInteger(result.attitudes.neutral)).toBe(true);
      expect(Number.isInteger(result.attitudes.oppose)).toBe(true);
    });

    it("should ensure minimum percentages for visibility", () => {
      // Generate multiple samples to check minimums
      const samples = Array.from({ length: 10 }, () =>
        generateMockAudienceStats(`post-${Math.random()}`)
      );

      samples.forEach((sample) => {
        // All categories should have at least some percentage
        expect(sample.political.liberal).toBeGreaterThan(0);
        expect(sample.political.moderate).toBeGreaterThan(0);
        expect(sample.political.conservative).toBeGreaterThan(0);
        expect(sample.attitudes.support).toBeGreaterThan(0);
        expect(sample.attitudes.neutral).toBeGreaterThan(0);
        expect(sample.attitudes.oppose).toBeGreaterThan(0);
      });
    });

    it("should create divergence between viewer and commenter attitudes", () => {
      const samples = Array.from({ length: 10 }, () =>
        generateMockAudienceStats(`post-${Math.random()}`)
      );

      // At least some samples should show divergence
      const hasDivergence = samples.some((sample) => {
        const supportDiff = Math.abs(
          sample.attitudes.support - sample.commenterAttitudes.support
        );
        return supportDiff > 5; // More than 5% difference
      });

      expect(hasDivergence).toBe(true);
    });
  });
});

