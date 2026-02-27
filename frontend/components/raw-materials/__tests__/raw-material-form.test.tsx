import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RawMaterialForm } from "../raw-material-form";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { rawMaterialsService } from "@/lib/services/raw-materials";
import { toast } from "sonner";

vi.mock("@/lib/services/raw-materials", () => ({
  rawMaterialsService: {
    create: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

describe("RawMaterialForm", () => {
  let queryClient: QueryClient;
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  const renderForm = (initialData: any = null) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <RawMaterialForm initialData={initialData} onSuccess={mockOnSuccess} />
      </QueryClientProvider>,
    );
  };

  it("should render create form", () => {
    renderForm();
    expect(screen.getByPlaceholderText("RM001")).toBeDefined();
    expect(screen.getByPlaceholderText("Steel Pipe")).toBeDefined();
    expect(screen.getByLabelText(/Stock Quantity/i)).toBeDefined();
    expect(
      screen.getByRole("button", { name: /Create Material/i }),
    ).toBeDefined();
  });

  it("should render update form with initial values", () => {
    const initialData = {
      id: "1",
      code: "RM1",
      name: "Iron",
      stockQuantity: 50,
    };
    renderForm(initialData);
    expect(
      (screen.getByPlaceholderText("RM001") as HTMLInputElement).value,
    ).toBe("RM1");
    expect(
      (screen.getByPlaceholderText("Steel Pipe") as HTMLInputElement).value,
    ).toBe("Iron");
    expect(
      screen.getByRole("button", { name: /Update Material/i }),
    ).toBeDefined();
  });

  it("should submit create form successfully", async () => {
    const user = userEvent.setup();
    (rawMaterialsService.create as any).mockResolvedValue({});
    renderForm();

    await user.type(screen.getByPlaceholderText("RM001"), "RM1");
    await user.type(screen.getByPlaceholderText("Steel Pipe"), "Iron");
    const qtyInput = screen.getByLabelText(/Stock Quantity/i);
    await user.clear(qtyInput);
    await user.type(qtyInput, "50");

    const form = document.querySelector("form")!;
    await act(async () => {
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    });

    await waitFor(
      () => {
        expect(rawMaterialsService.create).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );

    expect(toast.success).toHaveBeenCalledWith("Created successfully");
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("should submit update form successfully", async () => {
    const user = userEvent.setup();
    (rawMaterialsService.update as any).mockResolvedValue({});
    const initialData = {
      id: "1",
      code: "RM1",
      name: "Iron",
      stockQuantity: 50,
    };
    renderForm(initialData);

    const nameInput = screen.getByLabelText(/Name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Steel");

    const form = document.querySelector("form")!;
    await act(async () => {
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    });

    await waitFor(() => {
      expect(rawMaterialsService.update).toHaveBeenCalled();
    });

    expect(toast.success).toHaveBeenCalledWith("Updated successfully");
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("should handle error with response message", async () => {
    const user = userEvent.setup();
    const errorResponse = { response: { data: { error: "Duplicate code" } } };
    (rawMaterialsService.create as any).mockRejectedValue(errorResponse);
    renderForm();

    await user.type(screen.getByPlaceholderText("RM001"), "RM1");
    await user.type(screen.getByPlaceholderText("Steel Pipe"), "S");
    const qtyInput = screen.getByLabelText(/Stock Quantity/i);
    await user.clear(qtyInput);
    await user.type(qtyInput, "1");

    const form = document.querySelector("form")!;
    await act(async () => {
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Duplicate code");
    });
  });

  it("should use fallback error message", async () => {
    const user = userEvent.setup();
    (rawMaterialsService.create as any).mockRejectedValue(new Error("network"));
    renderForm();

    await user.type(screen.getByPlaceholderText("RM001"), "RM1");
    await user.type(screen.getByPlaceholderText("Steel Pipe"), "S");
    const qtyInput = screen.getByLabelText(/Stock Quantity/i);
    await user.clear(qtyInput);
    await user.type(qtyInput, "1");

    const form = document.querySelector("form")!;
    await act(async () => {
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });
  });

  it("should show spinner when mutation is pending", async () => {
    const user = userEvent.setup();
    (rawMaterialsService.create as any).mockReturnValue(new Promise(() => {}));
    renderForm();

    await user.type(screen.getByPlaceholderText("RM001"), "RM1");
    await user.type(screen.getByPlaceholderText("Steel Pipe"), "S");
    const qtyInput = screen.getByLabelText(/Stock Quantity/i);
    await user.clear(qtyInput);
    await user.type(qtyInput, "1");

    const form = document.querySelector("form")!;
    await act(async () => {
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    });

    await waitFor(() => {
      const spinner = document.querySelector(".animate-spin");
      expect(spinner).not.toBeNull();
    });

    const button = screen.getByRole("button", { name: /Material/i });
    expect(button).toHaveProperty("disabled", true);
  });
});
