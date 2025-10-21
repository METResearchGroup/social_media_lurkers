import {
  calculateDivergence,
  hasSignificantDivergence,
  getDivergenceLevel,
  getDominantAttitude,
  compareDominantAttitudes,
  getWarningMessage,
} from "../comparisonUtils";
import type { AttitudeBreakdown } from "@/types/audienceStats";

describe("Comparison Utilities", () => {
  describe("calculateDivergence", () => {
    it("should calculate zero divergence for identical attitudes", () => {
      const attitudes: AttitudeBreakdown = {
        support: 50,
        neutral: 25,
        oppose: 25,
      };

      const result = calculateDivergence(attitudes, attitudes);
      expect(result).toBe(0);
    });

    it("should calculate divergence for different attitudes", () => {
      const attitudes1: AttitudeBreakdown = {
        support: 60,
        neutral: 20,
        oppose: 20,
      };
      const attitudes2: AttitudeBreakdown = {
        support: 20,
        neutral: 30,
        oppose: 50,
      };

      const expected = (40 + 10 + 30) / 3; // (|60-20| + |20-30| + |20-50|) / 3 = 26.67
      const result = calculateDivergence(attitudes1, attitudes2);
      
      expect(result).toBeCloseTo(expected, 2);
    });

    it("should calculate maximum divergence for opposite attitudes", () => {
      const attitudes1: AttitudeBreakdown = {
        support: 100,
        neutral: 0,
        oppose: 0,
      };
      const attitudes2: AttitudeBreakdown = {
        support: 0,
        neutral: 0,
        oppose: 100,
      };

      const expected = (100 + 0 + 100) / 3; // 66.67
      const result = calculateDivergence(attitudes1, attitudes2);
      
      expect(result).toBeCloseTo(expected, 2);
    });

    it("should handle small differences", () => {
      const attitudes1: AttitudeBreakdown = {
        support: 50,
        neutral: 25,
        oppose: 25,
      };
      const attitudes2: AttitudeBreakdown = {
        support: 52,
        neutral: 24,
        oppose: 24,
      };

      const expected = (2 + 1 + 1) / 3; // 1.33
      const result = calculateDivergence(attitudes1, attitudes2);
      
      expect(result).toBeCloseTo(expected, 2);
    });
  });

  describe("hasSignificantDivergence", () => {
    it("should return false for low divergence", () => {
      const attitudes1: AttitudeBreakdown = {
        support: 50,
        neutral: 25,
        oppose: 25,
      };
      const attitudes2: AttitudeBreakdown = {
        support: 55,
        neutral: 23,
        oppose: 22,
      };

      const result = hasSignificantDivergence(attitudes1, attitudes2);
      expect(result).toBe(false);
    });

    it("should return true for high divergence", () => {
      const attitudes1: AttitudeBreakdown = {
        support: 80,
        neutral: 10,
        oppose: 10,
      };
      const attitudes2: AttitudeBreakdown = {
        support: 20,
        neutral: 20,
        oppose: 60,
      };

      const result = hasSignificantDivergence(attitudes1, attitudes2);
      expect(result).toBe(true);
    });

    it("should return true at exactly 15% threshold", () => {
      const attitudes1: AttitudeBreakdown = {
        support: 50,
        neutral: 25,
        oppose: 25,
      };
      const attitudes2: AttitudeBreakdown = {
        support: 35, // 15% diff
        neutral: 25, // 0% diff
        oppose: 40, // 15% diff
      };

      const result = hasSignificantDivergence(attitudes1, attitudes2);
      // Average divergence = (15 + 0 + 15) / 3 = 10%, which is < 15
      expect(result).toBe(false);
    });
  });

  describe("getDivergenceLevel", () => {
    it("should return low for divergence < 10%", () => {
      const expected = "low";
      
      expect(getDivergenceLevel(0)).toBe(expected);
      expect(getDivergenceLevel(5)).toBe(expected);
      expect(getDivergenceLevel(9.9)).toBe(expected);
    });

    it("should return moderate for divergence 10-20%", () => {
      const expected = "moderate";
      
      expect(getDivergenceLevel(10)).toBe(expected);
      expect(getDivergenceLevel(15)).toBe(expected);
      expect(getDivergenceLevel(19.9)).toBe(expected);
    });

    it("should return high for divergence >= 20%", () => {
      const expected = "high";
      
      expect(getDivergenceLevel(20)).toBe(expected);
      expect(getDivergenceLevel(30)).toBe(expected);
      expect(getDivergenceLevel(50)).toBe(expected);
    });
  });

  describe("getDominantAttitude", () => {
    it("should return support when support is highest", () => {
      const attitudes: AttitudeBreakdown = {
        support: 60,
        neutral: 20,
        oppose: 20,
      };

      const result = getDominantAttitude(attitudes);
      expect(result).toBe("support");
    });

    it("should return oppose when oppose is highest", () => {
      const attitudes: AttitudeBreakdown = {
        support: 20,
        neutral: 25,
        oppose: 55,
      };

      const result = getDominantAttitude(attitudes);
      expect(result).toBe("oppose");
    });

    it("should return neutral when neutral is highest", () => {
      const attitudes: AttitudeBreakdown = {
        support: 20,
        neutral: 60,
        oppose: 20,
      };

      const result = getDominantAttitude(attitudes);
      expect(result).toBe("neutral");
    });

    it("should return neutral when all are equal", () => {
      const attitudes: AttitudeBreakdown = {
        support: 33,
        neutral: 33,
        oppose: 34,
      };

      const result = getDominantAttitude(attitudes);
      // When oppose and neutral are close, neutral is checked first in tie-break
      expect(result).toBe("oppose");
    });
  });

  describe("compareDominantAttitudes", () => {
    it("should identify when commenters and viewers have same dominant attitude", () => {
      const commenter: AttitudeBreakdown = {
        support: 60,
        neutral: 20,
        oppose: 20,
      };
      const viewer: AttitudeBreakdown = {
        support: 55,
        neutral: 25,
        oppose: 20,
      };

      const result = compareDominantAttitudes(commenter, viewer);
      
      expect(result.commenters).toBe("support");
      expect(result.viewers).toBe("support");
      expect(result.areDifferent).toBe(false);
    });

    it("should identify when commenters and viewers have different dominant attitudes", () => {
      const commenter: AttitudeBreakdown = {
        support: 20,
        neutral: 15,
        oppose: 65,
      };
      const viewer: AttitudeBreakdown = {
        support: 62,
        neutral: 23,
        oppose: 15,
      };

      const result = compareDominantAttitudes(commenter, viewer);
      
      expect(result.commenters).toBe("oppose");
      expect(result.viewers).toBe("support");
      expect(result.areDifferent).toBe(true);
    });

    it("should handle neutral as dominant attitude", () => {
      const commenter: AttitudeBreakdown = {
        support: 25,
        neutral: 50,
        oppose: 25,
      };
      const viewer: AttitudeBreakdown = {
        support: 60,
        neutral: 20,
        oppose: 20,
      };

      const result = compareDominantAttitudes(commenter, viewer);
      
      expect(result.commenters).toBe("neutral");
      expect(result.viewers).toBe("support");
      expect(result.areDifferent).toBe(true);
    });
  });

  describe("getWarningMessage", () => {
    it("should return high divergence warning for divergence >= 20%", () => {
      const result = getWarningMessage(25);
      
      expect(result).toContain("Strong divergence detected");
      expect(result).toContain("significantly different");
    });

    it("should return moderate divergence warning for divergence 10-20%", () => {
      const result = getWarningMessage(15);
      
      expect(result).toContain("Moderate divergence");
      expect(result).toContain("may not fully represent");
    });

    it("should return low divergence message for divergence < 10%", () => {
      const result = getWarningMessage(5);
      
      expect(result).toContain("Low divergence");
      expect(result).toContain("generally align");
    });

    it("should include warning emoji for high divergence", () => {
      const result = getWarningMessage(30);
      expect(result).toContain("⚠️");
    });

    it("should include info emoji for low divergence", () => {
      const result = getWarningMessage(5);
      expect(result).toContain("ℹ️");
    });
  });
});

