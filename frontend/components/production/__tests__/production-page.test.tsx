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

  it("should render error state", async () => {
    (productionService.getAvailability as any).mockRejectedValue(
      new Error("Failed to fetch"),
    );

    renderWithClient(<ProductionPage />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load production data/i)).toBeDefined();
    });
  });

  it("should render production suggestions", async () => {
    const mockSuggestions = [
      {
        productId: "p1",
        productName: "Table",
        quantityToProduce: 10,
      },
    ];
    (productionService.getAvailability as any).mockResolvedValue(
      mockSuggestions,
    );

    renderWithClient(<ProductionPage />);

    await waitFor(() => {
      expect(screen.getByText("Table")).toBeDefined();
    });

    expect(screen.getByText("10")).toBeDefined();
    expect(screen.getByText(/Units producible/i)).toBeDefined();
    expect(screen.getByText(/Ready for production/i)).toBeDefined();
  });

  it("should render out of stock state", async () => {
    const mockSuggestions = [
      {
        productId: "p2",
        productName: "Chair",
        quantityToProduce: 0,
      },
    ];
    (productionService.getAvailability as any).mockResolvedValue(
      mockSuggestions,
    );

    renderWithClient(<ProductionPage />);

    await waitFor(() => {
      expect(screen.getByText("Chair")).toBeDefined();
    });

    expect(screen.getByText("0")).toBeDefined();
    expect(screen.getByText(/Out of stock/i)).toBeDefined();
    expect(screen.getByText(/Insufficient materials/i)).toBeDefined();
  });

  it("should render empty state", async () => {
    (productionService.getAvailability as any).mockResolvedValue([]);

    renderWithClient(<ProductionPage />);

    await waitFor(() => {
      expect(screen.getByText(/No products defined yet/i)).toBeDefined();
    });
  });
});
