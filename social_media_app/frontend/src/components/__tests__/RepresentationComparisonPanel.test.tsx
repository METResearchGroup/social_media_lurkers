import { render, screen } from "@testing-library/react";
import { RepresentationComparisonPanel } from "../RepresentationComparisonPanel";
import type { AudienceStatistics } from "@/types/audienceStats";

describe("RepresentationComparisonPanel", () => {
  const mockStatsWithDivergence: AudienceStatistics = {
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

  const mockStatsLowDivergence: AudienceStatistics = {
    viewerCount: 150,
    political: {
      liberal: 40,
      moderate: 30,
      conservative: 30,
    },
    attitudes: {
      support: 50,
      neutral: 25,
      oppose: 25,
    },
    commenterAttitudes: {
      support: 55,
      neutral: 23,
      oppose: 22,
    },
    lastUpdated: "2025-10-21T12:00:00Z",
  };

  it("should render panel title", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={12}
      />
    );

    expect(screen.getByText("Representation Comparison")).toBeInTheDocument();
  });

  it("should display commenter count", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={12}
      />
    );

    expect(screen.getByText("12 people")).toBeInTheDocument();
  });

  it("should display viewer count", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={12}
      />
    );

    expect(screen.getByText("247 people")).toBeInTheDocument();
  });

  it("should render commenter attitudes", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={12}
      />
    );

    expect(screen.getByText("Among COMMENTERS")).toBeInTheDocument();
    // Percentages appear twice (once in each column)
    expect(screen.getAllByText("15%")[0]).toBeInTheDocument(); // Support
    expect(screen.getByText("10%")).toBeInTheDocument(); // Neutral
    expect(screen.getByText("75%")).toBeInTheDocument(); // Oppose
  });

  it("should render viewer attitudes", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={12}
      />
    );

    expect(screen.getByText("Among ALL VIEWERS")).toBeInTheDocument();
    expect(screen.getByText("62%")).toBeInTheDocument(); // Support
    expect(screen.getAllByText("15%")[1]).toBeInTheDocument(); // Neutral
    expect(screen.getByText("23%")).toBeInTheDocument(); // Oppose
  });

  it("should display divergence level", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={12}
      />
    );

    expect(screen.getByText(/Divergence Level:/)).toBeInTheDocument();
  });

  it("should show dominant attitudes", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={12}
      />
    );

    const dominantElements = screen.getAllByText(/Dominant:/);
    expect(dominantElements).toHaveLength(2);
  });

  it("should display warning message for high divergence", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={12}
      />
    );

    expect(
      screen.getByText(/Strong divergence detected/i)
    ).toBeInTheDocument();
  });

  it("should display info message for low divergence", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsLowDivergence}
        commenterCount={8}
      />
    );

    expect(screen.getByText(/Low divergence/i)).toBeInTheDocument();
  });

  it("should show explanation when attitudes are different", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={12}
      />
    );

    expect(
      screen.getByText(/notably different views/i)
    ).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={12}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should render both columns in comparison grid", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={12}
      />
    );

    expect(screen.getByText("Among COMMENTERS")).toBeInTheDocument();
    expect(screen.getByText("Among ALL VIEWERS")).toBeInTheDocument();
  });

  it("should show all three attitude categories for commenters", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={12}
      />
    );

    const supportLabels = screen.getAllByText("Support");
    const neutralLabels = screen.getAllByText("Neutral");
    const opposeLabels = screen.getAllByText("Oppose");

    // Each should appear twice (once per column)
    expect(supportLabels).toHaveLength(2);
    expect(neutralLabels).toHaveLength(2);
    expect(opposeLabels).toHaveLength(2);
  });

  it("should use singular person for single commenter", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={1}
      />
    );

    expect(screen.getByText("1 person")).toBeInTheDocument();
  });

  it("should use plural people for multiple commenters", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={5}
      />
    );

    expect(screen.getByText("5 people")).toBeInTheDocument();
  });

  it("should display when commenters lean differently than viewers", () => {
    render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={12}
      />
    );

    // Commenters lean oppose (75%), viewers lean support (62%)
    expect(screen.getByText(/Commenters lean oppose/i)).toBeInTheDocument();
    expect(screen.getByText(/viewers lean support/i)).toBeInTheDocument();
  });

  it("should format large viewer counts with commas", () => {
    const largeStats = {
      ...mockStatsWithDivergence,
      viewerCount: 1500,
    };
    
    render(
      <RepresentationComparisonPanel
        stats={largeStats}
        commenterCount={12}
      />
    );

    expect(screen.getByText("1,500 people")).toBeInTheDocument();
  });

  it("should have correct color styling based on divergence level", () => {
    const { container, rerender } = render(
      <RepresentationComparisonPanel
        stats={mockStatsWithDivergence}
        commenterCount={12}
      />
    );

    // High divergence should have red styling
    let warningDiv = container.querySelector(".border-red-300");
    expect(warningDiv).toBeInTheDocument();

    // Low divergence should have blue styling
    rerender(
      <RepresentationComparisonPanel
        stats={mockStatsLowDivergence}
        commenterCount={8}
      />
    );

    warningDiv = container.querySelector(".border-blue-300");
    expect(warningDiv).toBeInTheDocument();
  });
});

