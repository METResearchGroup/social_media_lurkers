import { render, screen } from "@testing-library/react";
import {
  AudienceStatisticsPanel,
  CommentsWarningBanner,
} from "../AudienceStatisticsPanel";
import type { AudienceStatistics } from "@/types/audienceStats";

describe("AudienceStatisticsPanel", () => {
  const mockStats: AudienceStatistics = {
    viewerCount: 247,
    political: {
      liberal: 45,
      moderate: 25,
      conservative: 30,
    },
    attitudes: {
      support: 62,
      neutral: 15,
      oppose: 23,
    },
    commenterAttitudes: {
      support: 15,
      neutral: 10,
      oppose: 75,
    },
    lastUpdated: "2025-10-21T12:00:00Z",
  };

  it("should render panel title", () => {
    render(<AudienceStatisticsPanel stats={mockStats} />);

    expect(screen.getByText("Audience Statistics")).toBeInTheDocument();
  });

  it("should display viewer count", () => {
    render(<AudienceStatisticsPanel stats={mockStats} />);

    expect(screen.getByText("247 people viewed this post")).toBeInTheDocument();
  });

  it("should render political breakdown section", () => {
    render(<AudienceStatisticsPanel stats={mockStats} />);

    expect(screen.getByText("Political Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Liberal")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
    expect(screen.getByText("Conservative")).toBeInTheDocument();
  });

  it("should display correct political percentages", () => {
    render(<AudienceStatisticsPanel stats={mockStats} />);

    expect(screen.getByText("45%")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
  });

  it("should render attitudes section", () => {
    render(<AudienceStatisticsPanel stats={mockStats} />);

    expect(screen.getByText("Attitudes on This Post")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Neutral")).toBeInTheDocument();
    expect(screen.getByText("Oppose")).toBeInTheDocument();
  });

  it("should display correct attitude percentages", () => {
    render(<AudienceStatisticsPanel stats={mockStats} />);

    expect(screen.getByText("62%")).toBeInTheDocument();
    expect(screen.getByText("15%")).toBeInTheDocument();
    expect(screen.getByText("23%")).toBeInTheDocument();
  });

  it("should render trust indicators", () => {
    render(<AudienceStatisticsPanel stats={mockStats} />);

    expect(screen.getByText("How is this calculated?")).toBeInTheDocument();
    expect(screen.getByText("Privacy guarantee")).toBeInTheDocument();
  });

  it("should display important note", () => {
    render(<AudienceStatisticsPanel stats={mockStats} />);

    expect(
      screen.getByText(/These statistics show ALL viewers/i)
    ).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <AudienceStatisticsPanel stats={mockStats} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should format large viewer counts", () => {
    const largeStats = { ...mockStats, viewerCount: 1500 };
    render(<AudienceStatisticsPanel stats={largeStats} />);

    // toLocaleString formats 1500 as "1,500" in most locales
    expect(screen.getByText(/1,500 people viewed this post/i)).toBeInTheDocument();
  });

  it("should render with all required data", () => {
    const { container } = render(<AudienceStatisticsPanel stats={mockStats} />);

    // Should have 6 progress bars (3 political + 3 attitude)
    const progressBars = container.querySelectorAll('[role="progressbar"]');
    expect(progressBars).toHaveLength(6);
  });

  it("should have correct color coding for political breakdown", () => {
    const { container } = render(<AudienceStatisticsPanel stats={mockStats} />);

    const progressBars = container.querySelectorAll('[role="progressbar"]');
    expect(progressBars[0]).toHaveClass("bg-blue-500"); // Liberal
    expect(progressBars[1]).toHaveClass("bg-purple-500"); // Moderate
    expect(progressBars[2]).toHaveClass("bg-red-500"); // Conservative
  });

  it("should have correct color coding for attitudes", () => {
    const { container } = render(<AudienceStatisticsPanel stats={mockStats} />);

    const progressBars = container.querySelectorAll('[role="progressbar"]');
    expect(progressBars[3]).toHaveClass("bg-green-500"); // Support
    expect(progressBars[4]).toHaveClass("bg-gray-500"); // Neutral
    expect(progressBars[5]).toHaveClass("bg-orange-500"); // Oppose
  });
});

describe("CommentsWarningBanner", () => {
  it("should render warning message", () => {
    render(<CommentsWarningBanner />);

    expect(
      screen.getByText(/Comments may not represent all viewers/i)
    ).toBeInTheDocument();
  });

  it("should include warning icon", () => {
    render(<CommentsWarningBanner />);

    expect(screen.getByText(/⚠️/)).toBeInTheDocument();
  });

  it("should reference audience statistics", () => {
    render(<CommentsWarningBanner />);

    expect(
      screen.getByText(/See audience statistics above/i)
    ).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <CommentsWarningBanner className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should have warning styling", () => {
    const { container } = render(<CommentsWarningBanner />);

    expect(container.firstChild).toHaveClass("border-amber-300");
    expect(container.firstChild).toHaveClass("bg-amber-50");
  });
});

