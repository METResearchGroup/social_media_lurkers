import { render, screen, waitFor } from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import PostDetail from "../page";
import { usePostVariant } from "@/hooks/usePostVariant";
import { mockDataSource } from "@/lib/mockData";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("swr");

jest.mock("@/hooks/usePostVariant");

jest.mock("@/lib/mockData", () => ({
  mockDataSource: {
    getAudienceStats: jest.fn(),
  },
}));

jest.mock("@/lib/tracking", () => ({
  trackPostViewed: jest.fn(),
  trackPostEngagement: jest.fn(),
  setupDwellTimeTracking: jest.fn(() => () => {}),
  setupScrollDepthTracking: jest.fn(() => () => {}),
}));

jest.mock("@/components/VariantToggle", () => ({
  VariantToggle: () => <div data-testid="variant-toggle">Variant Toggle</div>,
}));

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR<PostDetailResponse>>;
const mockUsePostVariant = usePostVariant as jest.MockedFunction<typeof usePostVariant>;
const mockGetAudienceStats = mockDataSource.getAudienceStats as jest.MockedFunction<
  typeof mockDataSource.getAudienceStats
>;

describe("PostDetail Page", () => {
  const mockPost = {
    id: "test-post-1",
    author_id: "author-1",
    text: "This is a test post",
    created_at: "2025-10-21T12:00:00Z",
    like_count: 10,
    comment_count: 3,
    share_count: 2,
    author: {
      id: "author-1",
      handle: "@testuser",
      display_name: "Test User",
      avatar_url: "https://example.com/avatar.jpg",
    },
  };

  const mockComments = [
    {
      id: "comment-1",
      post_id: "test-post-1",
      user_id: "user-1",
      text: "Great post!",
      created_at: "2025-10-21T12:30:00Z",
      author: {
        id: "user-1",
        handle: "@commenter",
        display_name: "Commenter",
        avatar_url: null,
      },
    },
  ];

  const mockAudienceStats = {
    viewerCount: 247,
    political: { liberal: 45, moderate: 25, conservative: 30 },
    attitudes: { support: 62, neutral: 15, oppose: 23 },
    commenterAttitudes: { support: 15, neutral: 10, oppose: 75 },
    lastUpdated: "2025-10-21T12:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({ id: "test-post-1" });
    mockUseRouter.mockReturnValue({
      back: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    });
    mockUsePostVariant.mockReturnValue({
      variant: "control",
      isLoading: false,
      setManualOverride: jest.fn(),
      clearOverride: jest.fn(),
    });
    mockGetAudienceStats.mockResolvedValue(mockAudienceStats);
  });

  it("should render loading state", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn() as never,
      isValidating: false,
    });

    render(<PostDetail />);

    expect(screen.getByText("Loading post...")).toBeInTheDocument();
  });

  it("should render error state", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: new Error("Failed to load"),
      isLoading: false,
      mutate: jest.fn() as never,
      isValidating: false,
    });

    render(<PostDetail />);

    expect(screen.getByText(/Failed to load post/i)).toBeInTheDocument();
  });

  it("should render post with control variant", async () => {
    mockUseSWR.mockReturnValue({
      data: {
        post: mockPost,
        comments: mockComments,
        liked_by_current_user: false,
      },
      error: undefined,
      isLoading: false,
      mutate: jest.fn() as never,
      isValidating: false,
    });

    render(<PostDetail />);

    await waitFor(() => {
      expect(screen.getByText("This is a test post")).toBeInTheDocument();
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("Comments (1)")).toBeInTheDocument();
    });
  });

  it("should render audience statistics panel for treatment variant", async () => {
    mockUsePostVariant.mockReturnValue({
      variant: "treatment",
      isLoading: false,
      setManualOverride: jest.fn(),
      clearOverride: jest.fn(),
    });

    mockUseSWR.mockReturnValue({
      data: {
        post: mockPost,
        comments: mockComments,
        liked_by_current_user: false,
      },
      error: undefined,
      isLoading: false,
      mutate: jest.fn() as never,
      isValidating: false,
    });

    render(<PostDetail />);

    await waitFor(() => {
      expect(screen.getByText("Audience Statistics")).toBeInTheDocument();
    });
  });

  it("should render representation comparison panel for comparison variant", async () => {
    mockUsePostVariant.mockReturnValue({
      variant: "comparison",
      isLoading: false,
      setManualOverride: jest.fn(),
      clearOverride: jest.fn(),
    });

    mockUseSWR.mockReturnValue({
      data: {
        post: mockPost,
        comments: mockComments,
        liked_by_current_user: false,
      },
      error: undefined,
      isLoading: false,
      mutate: jest.fn() as never,
      isValidating: false,
    });

    render(<PostDetail />);

    await waitFor(() => {
      expect(screen.getByText("Representation Comparison")).toBeInTheDocument();
    });
  });

  it("should render variant toggle", () => {
    mockUseSWR.mockReturnValue({
      data: {
        post: mockPost,
        comments: mockComments,
        liked_by_current_user: false,
      },
      error: undefined,
      isLoading: false,
      mutate: jest.fn() as never,
      isValidating: false,
    });

    render(<PostDetail />);

    expect(screen.getByTestId("variant-toggle")).toBeInTheDocument();
  });

  it("should display comment count", () => {
    mockUseSWR.mockReturnValue({
      data: {
        post: mockPost,
        comments: mockComments,
        liked_by_current_user: false,
      },
      error: undefined,
      isLoading: false,
      mutate: jest.fn() as never,
      isValidating: false,
    });

    render(<PostDetail />);

    expect(screen.getByText("Comments (1)")).toBeInTheDocument();
  });

  it("should display engagement stats", () => {
    mockUseSWR.mockReturnValue({
      data: {
        post: mockPost,
        comments: mockComments,
        liked_by_current_user: false,
      },
      error: undefined,
      isLoading: false,
      mutate: jest.fn() as never,
      isValidating: false,
    });

    render(<PostDetail />);

    expect(screen.getByText(/10/)).toBeInTheDocument(); // Likes
    expect(screen.getByText(/3/)).toBeInTheDocument(); // Comments
    expect(screen.getByText(/2/)).toBeInTheDocument(); // Shares
  });
});

