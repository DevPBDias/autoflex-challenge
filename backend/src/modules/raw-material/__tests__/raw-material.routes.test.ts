import request from "supertest";
import app from "../../../app";
import { prisma } from "../../../config/prisma";

jest.mock("../../../config/prisma", () => ({
  prisma: {
    rawMaterial: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const prismaMock = prisma.rawMaterial as unknown as {
  create: jest.Mock;
  findMany: jest.Mock;
  findUnique: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

describe("RawMaterial Routes", () => {
  const VALID_UUID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /raw-materials should create RM", async () => {
    prismaMock.findUnique.mockResolvedValue(null);
    prismaMock.create.mockResolvedValue({
      id: "1",
      code: "RM-1",
      name: "S",
      stockQuantity: 10,
    });

    const response = await request(app)
      .post("/raw-materials")
      .send({ code: "RM-1", name: "S", stockQuantity: 10 });

    expect(response.status).toBe(201);
  });

  it("GET /raw-materials should return list", async () => {
    prismaMock.findMany.mockResolvedValue([]);
    const response = await request(app).get("/raw-materials");
    expect(response.status).toBe(200);
  });
});
