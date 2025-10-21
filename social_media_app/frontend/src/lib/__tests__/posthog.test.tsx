import { render } from "@testing-library/react";
import { initPostHog, PostHogProvider, getPostHog } from "../posthog";
import posthog from "posthog-js";

// Mock posthog-js
jest.mock("posthog-js", () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    capture: jest.fn(),
  },
}));

// Mock posthog-js/react
jest.mock("posthog-js/react", () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="posthog-provider">{children}</div>
  ),
}));

describe("PostHog Integration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("initPostHog", () => {
    it("should initialize PostHog with correct configuration", () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = "test-key";
      process.env.NEXT_PUBLIC_POSTHOG_HOST = "https://test.posthog.com";

      initPostHog();

      expect(posthog.init).toHaveBeenCalledWith("test-key", {
        api_host: "https://test.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false,
        capture_pageleave: true,
        loaded: expect.any(Function),
      });
    });

    it("should not initialize PostHog when credentials are missing", () => {
      delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
      delete process.env.NEXT_PUBLIC_POSTHOG_HOST;

      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      initPostHog();

      expect(posthog.init).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        "PostHog credentials not found in environment variables"
      );

      consoleSpy.mockRestore();
    });

    it("should return posthog instance", () => {
      const result = initPostHog();
      expect(result).toBe(posthog);
    });
  });

  describe("PostHogProvider", () => {
    it("should render children within PostHog provider", () => {
      const { getByText, getByTestId } = render(
        <PostHogProvider>
          <div>Test Content</div>
        </PostHogProvider>
      );

      expect(getByTestId("posthog-provider")).toBeInTheDocument();
      expect(getByText("Test Content")).toBeInTheDocument();
    });

    it("should initialize PostHog on mount", () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = "test-key";
      process.env.NEXT_PUBLIC_POSTHOG_HOST = "https://test.posthog.com";

      render(
        <PostHogProvider>
          <div>Test</div>
        </PostHogProvider>
      );

      expect(posthog.init).toHaveBeenCalled();
    });
  });

  describe("getPostHog", () => {
    it("should return posthog instance", () => {
      const result = getPostHog();
      expect(result).toBe(posthog);
    });
  });
});

