import request from "supertest";
import app from "../../../app";

jest.mock("../../../config/prisma", () => ({
  prisma: {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { prisma } from "../../../config/prisma";

const prismaMock = prisma.product as unknown as {
  create: jest.Mock;
  findMany: jest.Mock;
  findUnique: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

const VALID_UUID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

const mockProduct = {
  id: VALID_UUID,
  code: "PRD-001",
  name: "Steel Cabinet",
  value: 1250.99,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Product Routes (Integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /products", () => {
    it("should return 201 on successful creation", async () => {
      prismaMock.findUnique.mockResolvedValue(null);
      prismaMock.create.mockResolvedValue(mockProduct);

      const response = await request(app)
        .post("/products")
        .send({ code: "PRD-001", name: "Steel Cabinet", value: 1250.99 });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Product created successfully");
      expect(response.body.product).toBeDefined();
      expect(response.body.product.code).toBe("PRD-001");
    });

    it("should return 422 when body is missing fields", async () => {
      const response = await request(app).post("/products").send({});

      expect(response.status).toBe(422);
      expect(response.body.error).toBe(
        "Field 'code' must be a non-empty string",
      );
    });

    it("should return 422 when value is negative", async () => {
      const response = await request(app)
        .post("/products")
        .send({ code: "PRD-X", name: "Test", value: -5 });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe(
        "Field 'value' must be a positive number",
      );
    });

    it("should return 409 when code already exists", async () => {
      prismaMock.findUnique.mockResolvedValue(mockProduct);

      const response = await request(app)
        .post("/products")
        .send({ code: "PRD-001", name: "Dup", value: 100 });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe("Product code already exists");
    });
  });

  describe("GET /products", () => {
    it("should return 200 with array of products", async () => {
      prismaMock.findMany.mockResolvedValue([mockProduct]);

      const response = await request(app).get("/products");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Products retrieved successfully");
      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body.products.length).toBe(1);
    });

    it("should return 200 with empty array", async () => {
      prismaMock.findMany.mockResolvedValue([]);

      const response = await request(app).get("/products");

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual([]);
    });
  });

  describe("GET /products/:id", () => {
    it("should return 200 with product data", async () => {
      prismaMock.findUnique.mockResolvedValue(mockProduct);

      const response = await request(app).get(`/products/${VALID_UUID}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Product found successfully");
      expect(response.body.product.code).toBe("PRD-001");
    });

    it("should return 400 for invalid UUID", async () => {
      const response = await request(app).get("/products/invalid-id");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid product ID format");
    });

    it("should return 404 when product not found", async () => {
      prismaMock.findUnique.mockResolvedValue(null);

      const response = await request(app).get(`/products/${VALID_UUID}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Product not found");
    });
  });

  describe("PATCH /products/:id", () => {
    it("should return 200 with updated product", async () => {
      const updated = { ...mockProduct, name: "Updated" };
      prismaMock.findUnique.mockResolvedValue(mockProduct);
      prismaMock.update.mockResolvedValue(updated);

      const response = await request(app)
        .patch(`/products/${VALID_UUID}`)
        .send({ name: "Updated" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Product updated successfully");
      expect(response.body.product).toBeDefined();
    });

    it("should return 400 for invalid UUID", async () => {
      const response = await request(app)
        .patch("/products/bad-id")
        .send({ name: "X" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid product ID format");
    });

    it("should return 404 when product not found", async () => {
      prismaMock.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch(`/products/${VALID_UUID}`)
        .send({ name: "X" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Product not found");
    });

    it("should return 422 for empty body", async () => {
      prismaMock.findUnique.mockResolvedValue(mockProduct);

      const response = await request(app)
        .patch(`/products/${VALID_UUID}`)
        .send({});

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Request body cannot be empty");
    });
  });

  describe("DELETE /products/:id", () => {
    it("should return 204 on successful deletion", async () => {
      prismaMock.findUnique.mockResolvedValue(mockProduct);
      prismaMock.delete.mockResolvedValue(mockProduct);

      const response = await request(app).delete(`/products/${VALID_UUID}`);

      expect(response.status).toBe(204);
    });

    it("should return 400 for invalid UUID", async () => {
      const response = await request(app).delete("/products/bad-id");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid product ID format");
    });

    it("should return 404 when product not found", async () => {
      prismaMock.findUnique.mockResolvedValue(null);

      const response = await request(app).delete(`/products/${VALID_UUID}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Product not found");
    });
  });
});
