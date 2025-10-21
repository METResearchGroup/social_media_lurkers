import { renderHook, act, waitFor } from "@testing-library/react";
import { usePostVariant } from "../usePostVariant";
import { VARIANT_OVERRIDE_KEY, type PostVariant } from "@/types/variants";
import { getPostHog } from "@/lib/posthog";

// Mock posthog module
jest.mock("@/lib/posthog");

const mockGetPostHog = getPostHog as jest.MockedFunction<typeof getPostHog>;

describe("usePostVariant", () => {
  let localStorageMock: { [key: string]: string };
  let mockPostHogClient: { getFeatureFlag: jest.Mock; capture: jest.Mock };

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

    // Mock PostHog client
    mockPostHogClient = {
      getFeatureFlag: jest.fn(),
      capture: jest.fn(),
    };
    
    mockGetPostHog.mockReturnValue(mockPostHogClient);

    jest.clearAllMocks();
  });

  describe("variant assignment priority", () => {
    it("should return control variant by default", async () => {
      mockPostHogClient.getFeatureFlag.mockReturnValue(undefined);
      
      const { result } = renderHook(() => usePostVariant());
      
      await waitFor(() => {
        expect(result.current.variant).toBe("control");
      });
    });

    it("should use PostHog feature flag variant when no override exists", async () => {
      mockPostHogClient.getFeatureFlag.mockReturnValue("treatment");
      
      const { result } = renderHook(() => usePostVariant());
      
      await waitFor(() => {
        expect(result.current.variant).toBe("treatment");
      });
    });

    it("should prioritize manual override over feature flag", async () => {
      mockPostHogClient.getFeatureFlag.mockReturnValue("treatment");
      localStorageMock[VARIANT_OVERRIDE_KEY] = "comparison";
      
      const { result } = renderHook(() => usePostVariant());
      
      await waitFor(() => {
        expect(result.current.variant).toBe("comparison");
      });
    });

    it("should ignore invalid variant values from feature flag", async () => {
      mockPostHogClient.getFeatureFlag.mockReturnValue("invalid_variant");
      
      const { result } = renderHook(() => usePostVariant());
      
      await waitFor(() => {
        expect(result.current.variant).toBe("control");
      });
    });

    it("should ignore invalid variant values from localStorage", async () => {
      mockPostHogClient.getFeatureFlag.mockReturnValue("treatment");
      localStorageMock[VARIANT_OVERRIDE_KEY] = "invalid_variant";
      
      const { result } = renderHook(() => usePostVariant());
      
      await waitFor(() => {
        expect(result.current.variant).toBe("treatment");
      });
    });
  });

  describe("manual override functionality", () => {
    it("should set manual override in localStorage", async () => {
      mockPostHogClient.getFeatureFlag.mockReturnValue("control");
      
      const { result } = renderHook(() => usePostVariant());
      
      act(() => {
        result.current.setManualOverride("comparison");
      });
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        VARIANT_OVERRIDE_KEY,
        "comparison"
      );
      
      await waitFor(() => {
        expect(result.current.variant).toBe("comparison");
      });
    });

    it("should clear override when set to null", async () => {
      localStorageMock[VARIANT_OVERRIDE_KEY] = "comparison";
      mockPostHogClient.getFeatureFlag.mockReturnValue("treatment");
      
      const { result } = renderHook(() => usePostVariant());
      
      act(() => {
        result.current.setManualOverride(null);
      });
      
      expect(localStorage.removeItem).toHaveBeenCalledWith(VARIANT_OVERRIDE_KEY);
    });

    it("should clear override using clearOverride method", async () => {
      localStorageMock[VARIANT_OVERRIDE_KEY] = "comparison";
      mockPostHogClient.getFeatureFlag.mockReturnValue("treatment");
      
      const { result } = renderHook(() => usePostVariant());
      
      act(() => {
        result.current.clearOverride();
      });
      
      expect(localStorage.removeItem).toHaveBeenCalledWith(VARIANT_OVERRIDE_KEY);
    });
  });

  describe("loading state", () => {
    it("should initially be loading before client-side init", () => {
      mockPostHogClient.getFeatureFlag.mockReturnValue("control");
      
      const { result } = renderHook(() => usePostVariant());
      
      expect(result.current.isLoading).toBeDefined();
    });
  });

  describe("valid variant values", () => {
    it.each(["control", "treatment", "comparison"])(
      "should accept %s as valid variant from feature flag",
      async (variant) => {
        mockPostHogClient.getFeatureFlag.mockReturnValue(variant);
        
        const { result } = renderHook(() => usePostVariant());
        
        await waitFor(() => {
          expect(result.current.variant).toBe(variant);
        });
      }
    );

    it.each(["control", "treatment", "comparison"])(
      "should accept %s as valid manual override",
      async (variant) => {
        mockPostHogClient.getFeatureFlag.mockReturnValue("control");
        
        const { result } = renderHook(() => usePostVariant());
        
        act(() => {
          result.current.setManualOverride(variant as PostVariant);
        });
        
        await waitFor(() => {
          expect(result.current.variant).toBe(variant);
        });
      }
    );
  });
});
