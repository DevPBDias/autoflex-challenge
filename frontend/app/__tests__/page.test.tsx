import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../page";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/components/products/products-page", () => ({
  ProductsPage: () => <div data-testid="products-page">Products Page</div>,
}));

vi.mock("@/components/raw-materials/raw-materials-page", () => ({
  RawMaterialsPage: () => (
    <div data-testid="raw-materials-page">Raw Materials Page</div>
  ),
}));

vi.mock("@/components/production/production-page", () => ({
  ProductionPage: () => (
    <div data-testid="production-page">Production Page</div>
  ),
}));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render and show products tab by default", () => {
    render(<Home />);

    expect(screen.getAllByText("AutoFlex").length).toBeGreaterThan(0);
    expect(screen.getByTestId("products-page")).toBeDefined();
    expect(screen.queryByTestId("raw-materials-page")).toBeNull();
  });

  it("should switch between tabs", () => {
    render(<Home />);

    const materialsButtons = screen.getAllByText("Raw Materials");
    fireEvent.click(materialsButtons[materialsButtons.length - 1]);

    expect(screen.getByTestId("raw-materials-page")).toBeDefined();
    expect(screen.queryByTestId("products-page")).toBeNull();

    const productionButtons = screen.getAllByText("Production Info");
    fireEvent.click(productionButtons[productionButtons.length - 1]);

    expect(screen.getByTestId("production-page")).toBeDefined();
    expect(screen.queryByTestId("raw-materials-page")).toBeNull();
  });
});
