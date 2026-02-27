import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductForm } from "../product-form";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { productsService } from "@/lib/services/products";
import { toast } from "sonner";

vi.mock("@/lib/services/products", () => ({
  productsService: {
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

describe("ProductForm", () => {
  let queryClient: QueryClient;
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  const renderForm = (initialData: any = null) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ProductForm initialData={initialData} onSuccess={mockOnSuccess} />
      </QueryClientProvider>,
    );
  };

  it("should render create form with empty fields", () => {
    renderForm();

    expect(screen.getByPlaceholderText("P001")).toBeDefined();
    expect(screen.getByPlaceholderText("Bicycle")).toBeDefined();
    expect(screen.getByLabelText(/Price/i)).toBeDefined();
    expect(
      screen.getByRole("button", { name: /Create Product/i }),
    ).toBeDefined();
  });

  it("should render update form with initial values", () => {
    const initialData = { id: "1", code: "P1", name: "Table", value: 50 };
    renderForm(initialData);

    expect(
      (screen.getByPlaceholderText("P001") as HTMLInputElement).value,
    ).toBe("P1");
    expect(
      (screen.getByPlaceholderText("Bicycle") as HTMLInputElement).value,
    ).toBe("Table");
    expect(
      screen.getByRole("button", { name: /Update Product/i }),
    ).toBeDefined();
  });

  it("should submit create form successfully", async () => {
    const user = userEvent.setup();
    (productsService.create as any).mockResolvedValue({ id: "1" });
    renderForm();

    await user.type(screen.getByPlaceholderText("P001"), "PROD1");
    await user.type(screen.getByPlaceholderText("Bicycle"), "Bicycle");
    const priceInput = screen.getByLabelText(/Price/i);
    await user.clear(priceInput);
    await user.type(priceInput, "100");

    const form = document.querySelector("form")!;
    await act(async () => {
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    });

    await waitFor(
      () => {
        expect(productsService.create).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );

    expect(toast.success).toHaveBeenCalledWith("Created successfully");
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("should submit update form successfully", async () => {
    const user = userEvent.setup();
    (productsService.update as any).mockResolvedValue({ id: "1" });
    const initialData = { id: "1", code: "P1", name: "Old", value: 50 };
    renderForm(initialData);

    const nameInput = screen.getByLabelText(/Name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "New Name");

    const form = document.querySelector("form")!;
    await act(async () => {
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    });

    await waitFor(
      () => {
        expect(productsService.update).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );

    expect(toast.success).toHaveBeenCalledWith("Updated successfully");
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("should handle create error with response message", async () => {
    const user = userEvent.setup();
    const errorResponse = {
      response: { data: { error: "Code already exists" } },
    };
    (productsService.create as any).mockRejectedValue(errorResponse);
    renderForm();

    await user.type(screen.getByPlaceholderText("P001"), "P1");
    await user.type(screen.getByPlaceholderText("Bicycle"), "Bike");
    const priceInput = screen.getByLabelText(/Price/i);
    await user.clear(priceInput);
    await user.type(priceInput, "10");

    const form = document.querySelector("form")!;
    await act(async () => {
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Code already exists");
    });
  });

  it("should use fallback error message", async () => {
    const user = userEvent.setup();
    (productsService.create as any).mockRejectedValue(new Error("network"));
    renderForm();

    await user.type(screen.getByPlaceholderText("P001"), "P1");
    await user.type(screen.getByPlaceholderText("Bicycle"), "Bike");
    const priceInput = screen.getByLabelText(/Price/i);
    await user.clear(priceInput);
    await user.type(priceInput, "10");

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

  it("should show loading spinner when mutation is pending", async () => {
    const user = userEvent.setup();
    (productsService.create as any).mockReturnValue(new Promise(() => {}));
    renderForm();

    await user.type(screen.getByPlaceholderText("P001"), "P1");
    await user.type(screen.getByPlaceholderText("Bicycle"), "Bike");
    const priceInput = screen.getByLabelText(/Price/i);
    await user.clear(priceInput);
    await user.type(priceInput, "10");

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

    const button = screen.getByRole("button", { name: /Product/i });
    expect(button).toHaveProperty("disabled", true);
  });
});
