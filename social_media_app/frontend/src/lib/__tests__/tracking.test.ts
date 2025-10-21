import {
  trackPostViewed,
  trackPostEngagement,
  trackPostDwellTime,
  trackPostScrollDepth,
  setupDwellTimeTracking,
  setupScrollDepthTracking,
} from "../tracking";
import { getPostHog } from "../posthog";

// Mock posthog
jest.mock("../posthog", () => ({
  getPostHog: jest.fn(),
}));

const mockGetPostHog = getPostHog as jest.MockedFunction<typeof getPostHog>;

describe("Event Tracking Utilities", () => {
  let mockPostHog: { capture: jest.Mock; getFeatureFlag: jest.Mock };

  beforeEach(() => {
    mockPostHog = {
      capture: jest.fn(),
      getFeatureFlag: jest.fn(),
    };
    mockGetPostHog.mockReturnValue(mockPostHog);
    jest.clearAllMocks();
  });

  describe("trackPostViewed", () => {
    it("should track post viewed event with correct properties", () => {
      const expected = {
        post_id: "test-post-123",
        variant: "control",
      };

      trackPostViewed("test-post-123", "control");

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_viewed",
        expect.objectContaining(expected)
      );
      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_viewed",
        expect.objectContaining({
          timestamp: expect.any(String),
        })
      );
    });

    it("should track with treatment variant", () => {
      trackPostViewed("post-456", "treatment");

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_viewed",
        expect.objectContaining({
          post_id: "post-456",
          variant: "treatment",
        })
      );
    });
  });

  describe("trackPostEngagement", () => {
    it("should track like engagement as positive", () => {
      const expected = {
        post_id: "test-post",
        variant: "comparison",
        engagement_type: "like",
        is_positive: true,
      };

      trackPostEngagement("test-post", "comparison", "like");

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_engagement",
        expect.objectContaining(expected)
      );
    });

    it("should track comment engagement as positive", () => {
      trackPostEngagement("test-post", "control", "comment");

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_engagement",
        expect.objectContaining({
          engagement_type: "comment",
          is_positive: true,
        })
      );
    });

    it("should track share engagement as positive", () => {
      trackPostEngagement("test-post", "control", "share");

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_engagement",
        expect.objectContaining({
          engagement_type: "share",
          is_positive: true,
        })
      );
    });

    it("should track profile click as positive", () => {
      trackPostEngagement("test-post", "control", "profile_click");

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_engagement",
        expect.objectContaining({
          engagement_type: "profile_click",
          is_positive: true,
        })
      );
    });

    it("should track back button as negative engagement", () => {
      trackPostEngagement("test-post", "control", "back_button");

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_engagement",
        expect.objectContaining({
          engagement_type: "back_button",
          is_positive: false,
        })
      );
    });
  });

  describe("trackPostDwellTime", () => {
    it("should track dwell time with correct properties", () => {
      const expected = {
        post_id: "test-post",
        variant: "treatment",
        dwell_time_seconds: 45,
        was_visible: true,
      };

      trackPostDwellTime("test-post", "treatment", 45, true);

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_dwell_time",
        expect.objectContaining(expected)
      );
    });

    it("should round dwell time to nearest second", () => {
      trackPostDwellTime("test-post", "control", 45.7, true);

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_dwell_time",
        expect.objectContaining({
          dwell_time_seconds: 46,
        })
      );
    });

    it("should track when page was not visible", () => {
      trackPostDwellTime("test-post", "control", 30, false);

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_dwell_time",
        expect.objectContaining({
          was_visible: false,
        })
      );
    });
  });

  describe("trackPostScrollDepth", () => {
    it("should track scroll depth with correct properties", () => {
      const expected = {
        post_id: "test-post",
        variant: "comparison",
        scroll_percentage: 75,
        max_scroll_reached: 85,
      };

      trackPostScrollDepth("test-post", "comparison", 75, 85);

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_scroll_depth",
        expect.objectContaining(expected)
      );
    });

    it("should round scroll percentages", () => {
      trackPostScrollDepth("test-post", "control", 45.7, 67.3);

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_scroll_depth",
        expect.objectContaining({
          scroll_percentage: 46,
          max_scroll_reached: 67,
        })
      );
    });

    it("should clamp scroll percentage to 0-100 range", () => {
      trackPostScrollDepth("test-post", "control", 150, -10);

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_scroll_depth",
        expect.objectContaining({
          scroll_percentage: 100,
          max_scroll_reached: 0,
        })
      );
    });
  });

  describe("setupDwellTimeTracking", () => {
    let addEventListenerSpy: jest.SpyInstance;
    let removeEventListenerSpy: jest.SpyInstance;

    beforeEach(() => {
      addEventListenerSpy = jest.spyOn(document, "addEventListener");
      removeEventListenerSpy = jest.spyOn(document, "removeEventListener");
      jest.spyOn(window, "addEventListener");
      jest.spyOn(window, "removeEventListener");
    });

    afterEach(() => {
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it("should set up event listeners when enabled", () => {
      const cleanup = setupDwellTimeTracking("test-post", "control", true);

      expect(document.addEventListener).toHaveBeenCalledWith(
        "visibilitychange",
        expect.any(Function)
      );
      expect(window.addEventListener).toHaveBeenCalledWith(
        "beforeunload",
        expect.any(Function)
      );

      cleanup();
    });

    it("should not set up listeners when disabled", () => {
      const cleanup = setupDwellTimeTracking("test-post", "control", false);

      expect(document.addEventListener).not.toHaveBeenCalled();
      expect(window.addEventListener).not.toHaveBeenCalled();

      cleanup();
    });

    it("should track dwell time on cleanup", () => {
      const cleanup = setupDwellTimeTracking("test-post", "control", true);
      
      cleanup();

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_dwell_time",
        expect.objectContaining({
          post_id: "test-post",
          variant: "control",
        })
      );
    });

    it("should clean up event listeners", () => {
      const cleanup = setupDwellTimeTracking("test-post", "control", true);
      
      cleanup();

      expect(document.removeEventListener).toHaveBeenCalledWith(
        "visibilitychange",
        expect.any(Function)
      );
      expect(window.removeEventListener).toHaveBeenCalledWith(
        "beforeunload",
        expect.any(Function)
      );
    });
  });

  describe("setupScrollDepthTracking", () => {
    let setIntervalSpy: jest.SpyInstance;
    let clearIntervalSpy: jest.SpyInstance;

    beforeEach(() => {
      setIntervalSpy = jest.spyOn(global, "setInterval");
      clearIntervalSpy = jest.spyOn(global, "clearInterval");
      jest.spyOn(window, "addEventListener");
      jest.spyOn(window, "removeEventListener");
    });

    afterEach(() => {
      setIntervalSpy.mockRestore();
      clearIntervalSpy.mockRestore();
    });

    it("should set up scroll tracking when enabled", () => {
      const cleanup = setupScrollDepthTracking("test-post", "treatment", true);

      expect(window.addEventListener).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        { passive: true }
      );
      expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 5000);

      cleanup();
    });

    it("should not set up tracking when disabled", () => {
      const cleanup = setupScrollDepthTracking("test-post", "treatment", false);

      expect(window.addEventListener).not.toHaveBeenCalled();
      expect(setInterval).not.toHaveBeenCalled();

      cleanup();
    });

    it("should track scroll depth on cleanup", () => {
      const cleanup = setupScrollDepthTracking("test-post", "treatment", true);
      
      cleanup();

      expect(mockPostHog.capture).toHaveBeenCalledWith(
        "post_scroll_depth",
        expect.objectContaining({
          post_id: "test-post",
          variant: "treatment",
        })
      );
    });

    it("should clean up event listeners and interval", () => {
      const cleanup = setupScrollDepthTracking("test-post", "treatment", true);
      
      cleanup();

      expect(window.removeEventListener).toHaveBeenCalled();
      expect(clearInterval).toHaveBeenCalled();
    });
  });
});

