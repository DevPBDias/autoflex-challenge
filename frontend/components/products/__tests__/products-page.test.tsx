import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ProductsPage } from "../products-page";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { productsService } from "@/lib/services/products";
import { toast } from "sonner";

vi.mock("@/lib/services/products", () => ({
  productsService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/components/products/product-composition", () => ({
  ProductComposition: () => <div>Mocked Composition</div>,
}));

vi.mock("@/components/products/product-form", () => ({
  ProductForm: ({ onSuccess, initialData }: any) => (
    <div data-testid="product-form">
      <span>{initialData ? "Edit Mode" : "Create Mode"}</span>
      <button onClick={onSuccess}>Mock Submit</button>
    </div>
  ),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

describe("ProductsPage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
    window.confirm = vi.fn().mockReturnValue(true);
  });

  const renderWithClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );
  };

  it("should render loading state", () => {
    (productsService.getAll as any).mockReturnValue(new Promise(() => {}));
    renderWithClient(<ProductsPage />);
    const loader = document.querySelector(".animate-spin");
    expect(loader).not.toBeNull();
  });

  it("should render products list", async () => {
    const mockProducts = [
      { id: "1", code: "P1", name: "Product 1", value: 10.5 },
    ];
    (productsService.getAll as any).mockResolvedValue(mockProducts);

    renderWithClient(<ProductsPage />);

    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeDefined();
    });
    expect(screen.getByText("P1")).toBeDefined();
    expect(screen.getByText("$10.50")).toBeDefined();
  });

  it("should show empty state", async () => {
    (productsService.getAll as any).mockResolvedValue([]);
    renderWithClient(<ProductsPage />);
    await waitFor(() => {
      expect(screen.getByText(/No products found/i)).toBeDefined();
    });
  });

  it("should handle delete with confirmation", async () => {
    const mockProducts = [
      { id: "1", code: "P1", name: "Product 1", value: 10.5 },
    ];
    (productsService.getAll as any).mockResolvedValue(mockProducts);
    (productsService.delete as any).mockResolvedValue({});

    renderWithClient(<ProductsPage />);
    await waitFor(() => screen.getByText("Product 1"));

    const trashButtons = document.querySelectorAll(".text-red-600");
    fireEvent.click(trashButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith("Are you sure?");
    await waitFor(() => {
      expect(productsService.delete).toHaveBeenCalledWith(
        "1",
        expect.anything(),
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Product deleted successfully",
      );
    });
  });

  it("should handle delete error", async () => {
    const mockProducts = [
      { id: "1", code: "P1", name: "Product 1", value: 10.5 },
    ];
    (productsService.getAll as any).mockResolvedValue(mockProducts);
    (productsService.delete as any).mockRejectedValue(new Error("fail"));

    renderWithClient(<ProductsPage />);
    await waitFor(() => screen.getByText("Product 1"));

    const trashButtons = document.querySelectorAll(".text-red-600");
    fireEvent.click(trashButtons[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to delete product");
    });
  });

  it("should not delete if confirm is cancelled", async () => {
    window.confirm = vi.fn().mockReturnValue(false);
    const mockProducts = [
      { id: "1", code: "P1", name: "Product 1", value: 10.5 },
    ];
    (productsService.getAll as any).mockResolvedValue(mockProducts);

    renderWithClient(<ProductsPage />);
    await waitFor(() => screen.getByText("Product 1"));

    const trashButtons = document.querySelectorAll(".text-red-600");
    fireEvent.click(trashButtons[0]);

    expect(productsService.delete).not.toHaveBeenCalled();
  });

  it("should open create dialog and close on form success", async () => {
    (productsService.getAll as any).mockResolvedValue([]);
    renderWithClient(<ProductsPage />);

    await waitFor(() => screen.getByText(/Add Product/i));
    fireEvent.click(screen.getByText(/Add Product/i));

    await waitFor(() => {
      expect(screen.getByText("Create Mode")).toBeDefined();
    });

    fireEvent.click(screen.getByText("Mock Submit"));

    await waitFor(() => {
      expect(screen.queryByTestId("product-form")).toBeNull();
    });
  });

  it("should open edit dialog", async () => {
    const mockProducts = [
      { id: "1", code: "P1", name: "Product 1", value: 10.5 },
    ];
    (productsService.getAll as any).mockResolvedValue(mockProducts);

    renderWithClient(<ProductsPage />);
    await waitFor(() => screen.getByText("Product 1"));

    const pencilButtons = document.querySelectorAll("button svg.lucide-pencil");
    fireEvent.click(pencilButtons[0].parentElement!);

    await waitFor(() => {
      expect(screen.getByText("Edit Mode")).toBeDefined();
    });
  });

  it("should open composition dialog", async () => {
    const mockProducts = [
      { id: "1", code: "P1", name: "Product 1", value: 10.5 },
    ];
    (productsService.getAll as any).mockResolvedValue(mockProducts);

    renderWithClient(<ProductsPage />);
    await waitFor(() => screen.getByText("Product 1"));

    const compositionButtons = screen.getAllByTitle("Composition");
    fireEvent.click(compositionButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Composition:/i)).toBeDefined();
      expect(screen.getByText(/Mocked Composition/i)).toBeDefined();
    });
  });
});
