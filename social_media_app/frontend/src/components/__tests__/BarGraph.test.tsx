import { render, screen } from "@testing-library/react";
import { BarGraph, BarGraphGroup } from "../BarGraph";

describe("BarGraph", () => {
  it("should render with label and percentage", () => {
    render(<BarGraph label="Test Label" percentage={50} />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("should render progress bar with correct width", () => {
    const { container } = render(<BarGraph label="Test" percentage={75} />);

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle({ width: "75%" });
  });

  it("should clamp percentage to 100 maximum", () => {
    const { container } = render(<BarGraph label="Test" percentage={150} />);

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle({ width: "100%" });
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("should clamp percentage to 0 minimum", () => {
    const { container } = render(<BarGraph label="Test" percentage={-10} />);

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle({ width: "0%" });
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("should hide percentage when showPercentage is false", () => {
    render(<BarGraph label="Test" percentage={50} showPercentage={false} />);

    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.queryByText("50%")).not.toBeInTheDocument();
  });

  it("should apply custom color class", () => {
    const { container } = render(
      <BarGraph label="Test" percentage={50} color="bg-red-500" />
    );

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveClass("bg-red-500");
  });

  it("should have correct ARIA attributes", () => {
    const { container } = render(<BarGraph label="Test Label" percentage={60} />);

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute("aria-valuenow", "60");
    expect(progressBar).toHaveAttribute("aria-valuemin", "0");
    expect(progressBar).toHaveAttribute("aria-valuemax", "100");
    expect(progressBar).toHaveAttribute("aria-label", "Test Label: 60%");
  });

  it("should render with default blue color", () => {
    const { container } = render(<BarGraph label="Test" percentage={50} />);

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveClass("bg-blue-500");
  });
});

describe("BarGraphGroup", () => {
  const testData = [
    { label: "Item 1", percentage: 40, color: "bg-green-500" },
    { label: "Item 2", percentage: 35, color: "bg-blue-500" },
    { label: "Item 3", percentage: 25, color: "bg-red-500" },
  ];

  it("should render title", () => {
    render(<BarGraphGroup title="Test Title" data={testData} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("should render all bar graphs", () => {
    render(<BarGraphGroup title="Test" data={testData} />);

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
    expect(screen.getByText("35%")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <BarGraphGroup title="Test" data={testData} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should render empty group with no data", () => {
    render(<BarGraphGroup title="Empty" data={[]} />);

    expect(screen.getByText("Empty")).toBeInTheDocument();
  });

  it("should pass colors to individual bar graphs", () => {
    const { container } = render(
      <BarGraphGroup title="Test" data={testData} />
    );

    const progressBars = container.querySelectorAll('[role="progressbar"]');
    expect(progressBars[0]).toHaveClass("bg-green-500");
    expect(progressBars[1]).toHaveClass("bg-blue-500");
    expect(progressBars[2]).toHaveClass("bg-red-500");
  });
});

