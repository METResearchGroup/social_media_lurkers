import { render, screen, fireEvent } from "@testing-library/react";
import { VariantToggle } from "../VariantToggle";
import { usePostVariant } from "@/hooks/usePostVariant";

// Mock the usePostVariant hook
jest.mock("@/hooks/usePostVariant");

const mockUsePostVariant = usePostVariant as jest.MockedFunction<
  typeof usePostVariant
>;

describe("VariantToggle", () => {
  const mockSetManualOverride = jest.fn();
  const mockClearOverride = jest.fn();
  
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    
    mockUsePostVariant.mockReturnValue({
      variant: "control",
      isLoading: false,
      setManualOverride: mockSetManualOverride,
      clearOverride: mockClearOverride,
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("visibility in development vs production", () => {
    it("should render in development mode", () => {
      process.env.NODE_ENV = "development";
      
      render(<VariantToggle />);
      
      expect(screen.getByText(/Variant: control/i)).toBeInTheDocument();
    });

    it("should not render in production mode", () => {
      process.env.NODE_ENV = "production";
      
      const { container } = render(<VariantToggle />);
      
      expect(container.firstChild).toBeNull();
    });

    it("should not render in test mode by default", () => {
      process.env.NODE_ENV = "test";
      
      const { container } = render(<VariantToggle />);
      
      expect(container.firstChild).toBeNull();
    });
  });

  describe("toggle functionality", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should display current variant", () => {
      render(<VariantToggle />);
      
      expect(screen.getByText("Variant: control")).toBeInTheDocument();
    });

    it("should show dropdown when toggle button is clicked", () => {
      render(<VariantToggle />);
      
      const toggleButton = screen.getByLabelText("Toggle variant selector");
      fireEvent.click(toggleButton);
      
      expect(screen.getByText("Select Test Variant")).toBeInTheDocument();
    });

    it("should hide dropdown when toggle button is clicked again", () => {
      render(<VariantToggle />);
      
      const toggleButton = screen.getByLabelText("Toggle variant selector");
      
      // Open dropdown
      fireEvent.click(toggleButton);
      expect(screen.getByText("Select Test Variant")).toBeInTheDocument();
      
      // Close dropdown
      fireEvent.click(toggleButton);
      expect(screen.queryByText("Select Test Variant")).not.toBeInTheDocument();
    });

    it("should have correct ARIA attributes", () => {
      render(<VariantToggle />);
      
      const toggleButton = screen.getByLabelText("Toggle variant selector");
      
      expect(toggleButton).toHaveAttribute("aria-expanded", "false");
      
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("variant selection", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should display all three variants in dropdown", () => {
      render(<VariantToggle />);
      
      const toggleButton = screen.getByLabelText("Toggle variant selector");
      fireEvent.click(toggleButton);
      
      expect(screen.getByText("control")).toBeInTheDocument();
      expect(screen.getByText("treatment")).toBeInTheDocument();
      expect(screen.getByText("comparison")).toBeInTheDocument();
    });

    it("should call setManualOverride when variant is selected", () => {
      render(<VariantToggle />);
      
      const toggleButton = screen.getByLabelText("Toggle variant selector");
      fireEvent.click(toggleButton);
      
      const treatmentButton = screen.getByLabelText("Switch to treatment variant");
      fireEvent.click(treatmentButton);
      
      expect(mockSetManualOverride).toHaveBeenCalledWith("treatment");
    });

    it("should close dropdown after variant selection", () => {
      render(<VariantToggle />);
      
      const toggleButton = screen.getByLabelText("Toggle variant selector");
      fireEvent.click(toggleButton);
      
      const comparisonButton = screen.getByLabelText("Switch to comparison variant");
      fireEvent.click(comparisonButton);
      
      expect(screen.queryByText("Select Test Variant")).not.toBeInTheDocument();
    });

    it("should highlight current variant", () => {
      mockUsePostVariant.mockReturnValue({
        variant: "treatment",
        isLoading: false,
        setManualOverride: mockSetManualOverride,
        clearOverride: mockClearOverride,
      });
      
      render(<VariantToggle />);
      
      const toggleButton = screen.getByLabelText("Toggle variant selector");
      fireEvent.click(toggleButton);
      
      const treatmentButton = screen.getByLabelText("Switch to treatment variant");
      expect(treatmentButton).toHaveClass("bg-blue-500");
    });
  });

  describe("clear override functionality", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should show clear override button", () => {
      render(<VariantToggle />);
      
      const toggleButton = screen.getByLabelText("Toggle variant selector");
      fireEvent.click(toggleButton);
      
      expect(
        screen.getByText(/Clear Override \(Use Feature Flag\)/i)
      ).toBeInTheDocument();
    });

    it("should call clearOverride when clear button is clicked", () => {
      render(<VariantToggle />);
      
      const toggleButton = screen.getByLabelText("Toggle variant selector");
      fireEvent.click(toggleButton);
      
      const clearButton = screen.getByLabelText("Clear manual override");
      fireEvent.click(clearButton);
      
      expect(mockClearOverride).toHaveBeenCalled();
    });

    it("should close dropdown after clearing override", () => {
      render(<VariantToggle />);
      
      const toggleButton = screen.getByLabelText("Toggle variant selector");
      fireEvent.click(toggleButton);
      
      const clearButton = screen.getByLabelText("Clear manual override");
      fireEvent.click(clearButton);
      
      expect(screen.queryByText("Select Test Variant")).not.toBeInTheDocument();
    });
  });

  describe("UI elements", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should show help text in dropdown", () => {
      render(<VariantToggle />);
      
      const toggleButton = screen.getByLabelText("Toggle variant selector");
      fireEvent.click(toggleButton);
      
      expect(
        screen.getByText(/Manual override stored in localStorage/i)
      ).toBeInTheDocument();
    });

    it("should display variant display names", () => {
      render(<VariantToggle />);
      
      const toggleButton = screen.getByLabelText("Toggle variant selector");
      fireEvent.click(toggleButton);
      
      expect(screen.getByText(/Control \(Current Design\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Treatment \(Audience Statistics\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Comparison \(Representation\)/i)).toBeInTheDocument();
    });

    it("should have test tube emoji icon", () => {
      render(<VariantToggle />);
      
      expect(screen.getByText("🧪")).toBeInTheDocument();
    });

    it("should rotate arrow when expanded", () => {
      const { container } = render(<VariantToggle />);
      
      const toggleButton = screen.getByLabelText("Toggle variant selector");
      const arrow = container.querySelector(".rotate-180");
      
      expect(arrow).not.toBeInTheDocument();
      
      fireEvent.click(toggleButton);
      
      const rotatedArrow = container.querySelector(".rotate-180");
      expect(rotatedArrow).toBeInTheDocument();
    });
  });

  describe("positioning", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should be fixed in top-right corner", () => {
      const { container } = render(<VariantToggle />);
      
      expect(container.firstChild).toHaveClass("fixed");
      expect(container.firstChild).toHaveClass("right-4");
      expect(container.firstChild).toHaveClass("top-4");
    });

    it("should have high z-index", () => {
      const { container } = render(<VariantToggle />);
      
      expect(container.firstChild).toHaveClass("z-50");
    });
  });
});

