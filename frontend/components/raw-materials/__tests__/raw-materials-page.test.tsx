import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { RawMaterialsPage } from "../raw-materials-page";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { rawMaterialsService } from "@/lib/services/raw-materials";
import { toast } from "sonner";

vi.mock("@/lib/services/raw-materials", () => ({
  rawMaterialsService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/components/raw-materials/raw-material-form", () => ({
  RawMaterialForm: ({ onSuccess, initialData }: any) => (
    <div data-testid="raw-material-form">
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

describe("RawMaterialsPage", () => {
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
    (rawMaterialsService.getAll as any).mockReturnValue(new Promise(() => {}));
    renderWithClient(<RawMaterialsPage />);
    const loader = document.querySelector(".animate-spin");
    expect(loader).not.toBeNull();
  });

  it("should render materials list", async () => {
    const mockMaterials = [
      { id: "1", code: "RM1", name: "Steel", stockQuantity: 100 },
    ];
    (rawMaterialsService.getAll as any).mockResolvedValue(mockMaterials);

    renderWithClient(<RawMaterialsPage />);

    await waitFor(() => {
      expect(screen.getByText("Steel")).toBeDefined();
    });
    expect(screen.getByText("RM1")).toBeDefined();
    expect(screen.getByText("100")).toBeDefined();
  });

  it("should show empty state", async () => {
    (rawMaterialsService.getAll as any).mockResolvedValue([]);
    renderWithClient(<RawMaterialsPage />);
    await waitFor(() => {
      expect(screen.getByText(/No materials found/i)).toBeDefined();
    });
  });

  it("should handle delete with confirmation", async () => {
    const mockMaterials = [
      { id: "1", code: "RM1", name: "Steel", stockQuantity: 100 },
    ];
    (rawMaterialsService.getAll as any).mockResolvedValue(mockMaterials);
    (rawMaterialsService.delete as any).mockResolvedValue({});

    renderWithClient(<RawMaterialsPage />);
    await waitFor(() => screen.getByText("Steel"));

    const trashButtons = document.querySelectorAll(".text-red-600");
    fireEvent.click(trashButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith("Are you sure?");
    await waitFor(() => {
      expect(rawMaterialsService.delete).toHaveBeenCalledWith(
        "1",
        expect.anything(),
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Raw material deleted successfully",
      );
    });
  });

  it("should handle delete error", async () => {
    const mockMaterials = [
      { id: "1", code: "RM1", name: "Steel", stockQuantity: 100 },
    ];
    (rawMaterialsService.getAll as any).mockResolvedValue(mockMaterials);
    (rawMaterialsService.delete as any).mockRejectedValue(new Error("fail"));

    renderWithClient(<RawMaterialsPage />);
    await waitFor(() => screen.getByText("Steel"));

    const trashButtons = document.querySelectorAll(".text-red-600");
    fireEvent.click(trashButtons[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to delete raw material");
    });
  });

  it("should not delete if confirm cancelled", async () => {
    window.confirm = vi.fn().mockReturnValue(false);
    const mockMaterials = [
      { id: "1", code: "RM1", name: "Steel", stockQuantity: 100 },
    ];
    (rawMaterialsService.getAll as any).mockResolvedValue(mockMaterials);

    renderWithClient(<RawMaterialsPage />);
    await waitFor(() => screen.getByText("Steel"));

    const trashButtons = document.querySelectorAll(".text-red-600");
    fireEvent.click(trashButtons[0]);

    expect(rawMaterialsService.delete).not.toHaveBeenCalled();
  });

  it("should open create dialog and close on form success", async () => {
    (rawMaterialsService.getAll as any).mockResolvedValue([]);
    renderWithClient(<RawMaterialsPage />);

    await waitFor(() => screen.getByText(/Add Material/i));
    fireEvent.click(screen.getByText(/Add Material/i));

    await waitFor(() => {
      expect(screen.getByText("Create Mode")).toBeDefined();
    });

    fireEvent.click(screen.getByText("Mock Submit"));

    await waitFor(() => {
      expect(screen.queryByTestId("raw-material-form")).toBeNull();
    });
  });

  it("should open edit dialog", async () => {
    const mockMaterials = [
      { id: "1", code: "RM1", name: "Steel", stockQuantity: 100 },
    ];
    (rawMaterialsService.getAll as any).mockResolvedValue(mockMaterials);

    renderWithClient(<RawMaterialsPage />);
    await waitFor(() => screen.getByText("Steel"));

    const pencilButtons = document.querySelectorAll("button svg.lucide-pencil");
    fireEvent.click(pencilButtons[0].parentElement!);

    await waitFor(() => {
      expect(screen.getByText("Edit Mode")).toBeDefined();
    });
  });
});
