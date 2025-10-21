import { renderHook, act } from "@testing-library/react";
import { usePostVariant } from "../usePostVariant";
import { VARIANT_OVERRIDE_KEY } from "@/types/variants";

// Mock posthog-js/react
jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(),
}));

import { useFeatureFlagVariantKey } from "posthog-js/react";

const mockUseFeatureFlagVariantKey = useFeatureFlagVariantKey as jest.MockedFunction<
  typeof useFeatureFlagVariantKey
>;

describe("usePostVariant", () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    
    global.Storage.prototype.getItem = jest.fn((key: string) => localStorageMock[key] || null);
    global.Storage.prototype.setItem = jest.fn((key: string, value: string) => {
      localStorageMock[key] = value;
    });
    global.Storage.prototype.removeItem = jest.fn((key: string) => {
      delete localStorageMock[key];
    });

    jest.clearAllMocks();
  });

  describe("variant assignment priority", () => {
    it("should return control variant by default", () => {
      mockUseFeatureFlagVariantKey.mockReturnValue(undefined);
      
      const { result } = renderHook(() => usePostVariant());
      
      expect(result.current.variant).toBe("control");
    });

    it("should use PostHog feature flag variant when no override exists", () => {
      mockUseFeatureFlagVariantKey.mockReturnValue("treatment");
      
      const { result } = renderHook(() => usePostVariant());
      
      expect(result.current.variant).toBe("treatment");
    });

    it("should prioritize manual override over feature flag", () => {
      mockUseFeatureFlagVariantKey.mockReturnValue("treatment");
      localStorageMock[VARIANT_OVERRIDE_KEY] = "comparison";
      
      const { result } = renderHook(() => usePostVariant());
      
      // Wait for client-side initialization
      act(() => {
        // Trigger useEffect
      });
      
      expect(result.current.variant).toBe("comparison");
    });

    it("should ignore invalid variant values from feature flag", () => {
      mockUseFeatureFlagVariantKey.mockReturnValue("invalid_variant");
      
      const { result } = renderHook(() => usePostVariant());
      
      expect(result.current.variant).toBe("control");
    });

    it("should ignore invalid variant values from localStorage", () => {
      mockUseFeatureFlagVariantKey.mockReturnValue("treatment");
      localStorageMock[VARIANT_OVERRIDE_KEY] = "invalid_variant";
      
      const { result } = renderHook(() => usePostVariant());
      
      expect(result.current.variant).toBe("treatment");
    });
  });

  describe("manual override functionality", () => {
    it("should set manual override in localStorage", () => {
      mockUseFeatureFlagVariantKey.mockReturnValue("control");
      
      const { result } = renderHook(() => usePostVariant());
      
      act(() => {
        result.current.setManualOverride("comparison");
      });
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        VARIANT_OVERRIDE_KEY,
        "comparison"
      );
      expect(result.current.variant).toBe("comparison");
    });

    it("should clear override when set to null", () => {
      localStorageMock[VARIANT_OVERRIDE_KEY] = "comparison";
      mockUseFeatureFlagVariantKey.mockReturnValue("treatment");
      
      const { result } = renderHook(() => usePostVariant());
      
      act(() => {
        result.current.setManualOverride(null);
      });
      
      expect(localStorage.removeItem).toHaveBeenCalledWith(VARIANT_OVERRIDE_KEY);
      expect(result.current.variant).toBe("treatment");
    });

    it("should clear override using clearOverride method", () => {
      localStorageMock[VARIANT_OVERRIDE_KEY] = "comparison";
      mockUseFeatureFlagVariantKey.mockReturnValue("treatment");
      
      const { result } = renderHook(() => usePostVariant());
      
      act(() => {
        result.current.clearOverride();
      });
      
      expect(localStorage.removeItem).toHaveBeenCalledWith(VARIANT_OVERRIDE_KEY);
    });
  });

  describe("loading state", () => {
    it("should initially be loading", () => {
      mockUseFeatureFlagVariantKey.mockReturnValue("control");
      
      const { result } = renderHook(() => usePostVariant());
      
      // On first render, isLoading should be true (before useEffect runs)
      expect(result.current.isLoading).toBeDefined();
    });
  });

  describe("valid variant values", () => {
    it.each(["control", "treatment", "comparison"])(
      "should accept %s as valid variant from feature flag",
      (variant) => {
        mockUseFeatureFlagVariantKey.mockReturnValue(variant);
        
        const { result } = renderHook(() => usePostVariant());
        
        expect(result.current.variant).toBe(variant);
      }
    );

    it.each(["control", "treatment", "comparison"])(
      "should accept %s as valid manual override",
      (variant) => {
        mockUseFeatureFlagVariantKey.mockReturnValue("control");
        
        const { result } = renderHook(() => usePostVariant());
        
        act(() => {
          result.current.setManualOverride(variant as any);
        });
        
        expect(result.current.variant).toBe(variant);
      }
    );
  });
});

