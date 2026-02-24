import request from "supertest";
import app from "../../../app";
import { prisma } from "../../../config/prisma";

jest.mock("../../../config/prisma", () => ({
  prisma: {
    product: { findMany: jest.fn() },
    rawMaterial: { findMany: jest.fn() },
  },
}));

describe("Production Routes Integration", () => {
  it("GET /production/suggest should return 200", async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.rawMaterial.findMany as jest.Mock).mockResolvedValue([]);

    const response = await request(app).get("/production/suggest");
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("suggestedProduction");
  });
});
