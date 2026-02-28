import { render, screen, waitFor } from "@testing-library/react";
import { ProductionPage } from "../production-page";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { productionService } from "@/lib/services/production";

vi.mock("@/lib/services/production", () => ({
  productionService: {
    getAvailability: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("ProductionPage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  const renderWithClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );
  };

  it("should render production suggestions and total value", async () => {
    const mockData = {
      suggestedProduction: [
        { productId: "1", productName: "Table", quantityToProduce: 5 },
      ],
      totalEstimatedValue: 500,
    };
    (productionService.getAvailability as any).mockResolvedValue(mockData);

    renderWithClient(<ProductionPage />);

    await waitFor(() => {
      expect(screen.getByText("Table")).toBeDefined();
    });

    expect(screen.getByText("5")).toBeDefined();
    expect(screen.getByText("$500.00")).toBeDefined();
  });

  it("should show out of stock badge when quantity is 0", async () => {
    const mockData = {
      suggestedProduction: [
        { productId: "2", productName: "Chair", quantityToProduce: 0 },
      ],
      totalEstimatedValue: 0,
    };
    (productionService.getAvailability as any).mockResolvedValue(mockData);

    renderWithClient(<ProductionPage />);

    await waitFor(() => {
      expect(screen.getByText("Out of stock")).toBeDefined();
    });
  });

  it("should show empty state message", async () => {
    (productionService.getAvailability as any).mockResolvedValue({
      suggestedProduction: [],
      totalEstimatedValue: 0,
    });

    renderWithClient(<ProductionPage />);

    await waitFor(() => {
      expect(screen.getByText(/No products defined yet/i)).toBeDefined();
    });
  });

  it("should show error message on failure", async () => {
    (productionService.getAvailability as any).mockRejectedValue(
      new Error("API Error"),
    );

    renderWithClient(<ProductionPage />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load production data/i)).toBeDefined();
    });
  });
});
