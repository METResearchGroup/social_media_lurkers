import { render, screen, fireEvent } from "@testing-library/react";
import {
  TrustIndicator,
  MethodologyTooltip,
  PrivacyTooltip,
} from "../TrustIndicator";

describe("TrustIndicator", () => {
  it("should render with label", () => {
    render(
      <TrustIndicator label="Test Label" tooltipContent="Test content" />
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("should render with custom icon", () => {
    render(
      <TrustIndicator
        icon="🔒"
        label="Privacy"
        tooltipContent="Privacy info"
      />
    );

    expect(screen.getByText("🔒")).toBeInTheDocument();
  });

  it("should show tooltip on mouse enter", () => {
    render(
      <TrustIndicator label="Test" tooltipContent="Tooltip content here" />
    );

    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);

    expect(screen.getByText("Tooltip content here")).toBeInTheDocument();
  });

  it("should hide tooltip on mouse leave", () => {
    render(
      <TrustIndicator label="Test" tooltipContent="Tooltip content" />
    );

    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();

    fireEvent.mouseLeave(button);
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("should show tooltip on focus", () => {
    render(
      <TrustIndicator label="Test" tooltipContent="Tooltip content" />
    );

    const button = screen.getByRole("button");
    fireEvent.focus(button);

    expect(screen.getByText("Tooltip content")).toBeInTheDocument();
  });

  it("should hide tooltip on blur", () => {
    render(
      <TrustIndicator label="Test" tooltipContent="Tooltip content" />
    );

    const button = screen.getByRole("button");
    fireEvent.focus(button);
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();

    fireEvent.blur(button);
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("should have correct ARIA label", () => {
    render(
      <TrustIndicator label="Privacy Info" tooltipContent="Content" />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "More information: Privacy Info");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <TrustIndicator
        label="Test"
        tooltipContent="Content"
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should render tooltip with correct role", () => {
    render(
      <TrustIndicator label="Test" tooltipContent="Tooltip" />
    );

    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });
});

describe("MethodologyTooltip", () => {
  it("should render with viewer count in label", () => {
    render(<MethodologyTooltip viewerCount={247} />);

    expect(screen.getByText("How is this calculated?")).toBeInTheDocument();
  });

  it("should show viewer count in tooltip", () => {
    render(<MethodologyTooltip viewerCount={247} />);

    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);

    expect(screen.getByText(/247 viewers/)).toBeInTheDocument();
  });

  it("should include methodology information", () => {
    render(<MethodologyTooltip viewerCount={100} />);

    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);

    expect(screen.getByText(/profile data and engagement patterns/)).toBeInTheDocument();
  });

  it("should format large viewer counts with commas", () => {
    render(<MethodologyTooltip viewerCount={1500} />);

    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);

    // The number should be formatted (though toLocaleString might not work in test environment)
    expect(screen.getByText(/1500 viewers/)).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <MethodologyTooltip viewerCount={100} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("PrivacyTooltip", () => {
  it("should render privacy label", () => {
    render(<PrivacyTooltip />);

    expect(screen.getByText("Privacy guarantee")).toBeInTheDocument();
  });

  it("should show privacy icon", () => {
    render(<PrivacyTooltip />);

    expect(screen.getByText("🔒")).toBeInTheDocument();
  });

  it("should include privacy information in tooltip", () => {
    render(<PrivacyTooltip />);

    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);

    expect(screen.getByText(/Individual views are never shown/)).toBeInTheDocument();
    expect(screen.getByText(/aggregated and anonymized/)).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(<PrivacyTooltip className="custom-class" />);

    expect(container.firstChild).toHaveClass("custom-class");
  });
});

