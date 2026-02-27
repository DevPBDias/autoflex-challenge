import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductComposition } from "../product-composition";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { productRawMaterialsService } from "@/lib/services/product-raw-materials";
import { rawMaterialsService } from "@/lib/services/raw-materials";
import { toast } from "sonner";

vi.mock("@/lib/services/product-raw-materials", () => ({
  productRawMaterialsService: {
    getComposition: vi.fn(),
    associate: vi.fn(),
    disassociate: vi.fn(),
  },
}));

vi.mock("@/lib/services/raw-materials", () => ({
  rawMaterialsService: {
    getAll: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <select
      data-testid="material-select"
      value={value}
      onChange={(e: any) => onValueChange(e.target.value)}
    >
      <option value="">Select a material</option>
      {children}
    </select>
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value }: any) => (
    <option value={value}>{children}</option>
  ),
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

describe("ProductComposition", () => {
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

  it("should render loading state", () => {
    (productRawMaterialsService.getComposition as any).mockReturnValue(
      new Promise(() => {}),
    );
    (rawMaterialsService.getAll as any).mockReturnValue(new Promise(() => {}));

    renderWithClient(<ProductComposition productId="1" />);
    const loader = document.querySelector(".animate-spin");
    expect(loader).not.toBeNull();
  });

  it("should render composition list", async () => {
    const mockComposition = [
      {
        rawMaterialId: "rm1",
        productId: "1",
        requiredQuantity: 5,
        rawMaterial: { id: "rm1", name: "Iron", code: "FE" },
      },
    ];
    (productRawMaterialsService.getComposition as any).mockResolvedValue(
      mockComposition,
    );
    (rawMaterialsService.getAll as any).mockResolvedValue([]);

    renderWithClient(<ProductComposition productId="1" />);

    await waitFor(() => {
      expect(screen.getByText("Iron")).toBeDefined();
    });
    expect(screen.getByText("FE")).toBeDefined();
    expect(screen.getByText("5")).toBeDefined();
  });

  it("should render empty state", async () => {
    (productRawMaterialsService.getComposition as any).mockResolvedValue([]);
    (rawMaterialsService.getAll as any).mockResolvedValue([]);

    renderWithClient(<ProductComposition productId="1" />);

    await waitFor(() => {
      expect(
        screen.getByText("No materials associated with this product."),
      ).toBeDefined();
    });
  });

  it("should handle add material via button click", async () => {
    (productRawMaterialsService.getComposition as any).mockResolvedValue([]);
    (rawMaterialsService.getAll as any).mockResolvedValue([
      { id: "rm2", name: "Steel", code: "ST" },
    ]);
    (productRawMaterialsService.associate as any).mockResolvedValue({});

    renderWithClient(<ProductComposition productId="1" />);

    await waitFor(() => {
      expect(screen.getByTestId("material-select")).toBeDefined();
    });

    fireEvent.change(screen.getByTestId("material-select"), {
      target: { value: "rm2" },
    });

    const qtyInput = screen.getByDisplayValue("1");
    fireEvent.change(qtyInput, { target: { value: "10" } });

    fireEvent.click(screen.getByRole("button", { name: /Add/i }));

    await waitFor(() => {
      expect(productRawMaterialsService.associate).toHaveBeenCalled();
    });
    expect(toast.success).toHaveBeenCalledWith("Material added to product");
  });

  it("should show error when adding without selection", async () => {
    (productRawMaterialsService.getComposition as any).mockResolvedValue([]);
    (rawMaterialsService.getAll as any).mockResolvedValue([]);

    renderWithClient(<ProductComposition productId="1" />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Add/i })).toBeDefined();
    });

    fireEvent.click(screen.getByRole("button", { name: /Add/i }));

    expect(toast.error).toHaveBeenCalledWith(
      "Please select a material and a valid quantity",
    );
  });

  it("should handle failed association", async () => {
    (productRawMaterialsService.getComposition as any).mockResolvedValue([]);
    (rawMaterialsService.getAll as any).mockResolvedValue([
      { id: "rm2", name: "Steel", code: "ST" },
    ]);
    (productRawMaterialsService.associate as any).mockRejectedValue(
      new Error("fail"),
    );

    renderWithClient(<ProductComposition productId="1" />);

    await waitFor(() => screen.getByTestId("material-select"));

    fireEvent.change(screen.getByTestId("material-select"), {
      target: { value: "rm2" },
    });
    const qtyInput = screen.getByDisplayValue("1");
    fireEvent.change(qtyInput, { target: { value: "5" } });

    fireEvent.click(screen.getByRole("button", { name: /Add/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to add material");
    });
  });

  it("should handle remove material", async () => {
    const mockComposition = [
      {
        rawMaterialId: "rm1",
        productId: "1",
        requiredQuantity: 5,
        rawMaterial: { id: "rm1", name: "Iron", code: "FE" },
      },
    ];
    (productRawMaterialsService.getComposition as any).mockResolvedValue(
      mockComposition,
    );
    (rawMaterialsService.getAll as any).mockResolvedValue([]);
    (productRawMaterialsService.disassociate as any).mockResolvedValue({});

    renderWithClient(<ProductComposition productId="1" />);

    await waitFor(() => screen.getByText("Iron"));

    const trashButton = document.querySelector(".text-red-500")!;
    fireEvent.click(trashButton);

    await waitFor(() => {
      expect(productRawMaterialsService.disassociate).toHaveBeenCalledWith(
        "1",
        "rm1",
      );
    });
    expect(toast.success).toHaveBeenCalledWith("Material removed from product");
  });

  it("should handle edit material (pencil button sets values)", async () => {
    const mockComposition = [
      {
        rawMaterialId: "rm1",
        productId: "1",
        requiredQuantity: 5,
        rawMaterial: { id: "rm1", name: "Iron", code: "FE" },
      },
    ];
    (productRawMaterialsService.getComposition as any).mockResolvedValue(
      mockComposition,
    );
    (rawMaterialsService.getAll as any).mockResolvedValue([
      { id: "rm1", name: "Iron", code: "FE" },
    ]);

    renderWithClient(<ProductComposition productId="1" />);

    await waitFor(() => screen.getByText("Iron"));

    const pencilButton = document.querySelector(
      "button svg.lucide-pencil",
    )?.parentElement!;
    fireEvent.click(pencilButton);

    const select = screen.getByTestId("material-select") as HTMLSelectElement;
    expect(select.value).toBe("rm1");
  });

  it("should handle failed disassociation", async () => {
    const mockComposition = [
      {
        rawMaterialId: "rm1",
        productId: "1",
        requiredQuantity: 5,
        rawMaterial: { id: "rm1", name: "Iron", code: "FE" },
      },
    ];
    (productRawMaterialsService.getComposition as any).mockResolvedValue(
      mockComposition,
    );
    (rawMaterialsService.getAll as any).mockResolvedValue([]);
    (productRawMaterialsService.disassociate as any).mockRejectedValue(
      new Error("fail"),
    );

    renderWithClient(<ProductComposition productId="1" />);

    await waitFor(() => screen.getByText("Iron"));

    const trashButton = document.querySelector(".text-red-500")!;
    fireEvent.click(trashButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to remove material");
    });
  });
});
