import { RawMaterialRepository } from "../raw-material.repository";
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

describe("RawMaterialRepository", () => {
  let repository: RawMaterialRepository;

  beforeEach(() => {
    repository = new RawMaterialRepository();
    jest.clearAllMocks();
  });

  it("should call prisma.create with correct data", async () => {
    const data = { code: "RM-1", name: "Steel", stockQuantity: 100 };
    await repository.createRawMaterial(data);
    expect(prismaMock.create).toHaveBeenCalledWith({ data });
  });

  it("should call prisma.findMany", async () => {
    await repository.findAllRawMaterials();
    expect(prismaMock.findMany).toHaveBeenCalled();
  });

  it("should call prisma.findUnique for ID", async () => {
    const id = "uuid";
    await repository.findOneRawMaterialById(id);
    expect(prismaMock.findUnique).toHaveBeenCalledWith({ where: { id } });
  });

  it("should call prisma.findUnique for code", async () => {
    const code = "RM-1";
    await repository.findRawMaterialByCode(code);
    expect(prismaMock.findUnique).toHaveBeenCalledWith({ where: { code } });
  });

  it("should call prisma.update with correct data", async () => {
    const id = "uuid";
    const data = { name: "Updated Steel" };
    await repository.updateRawMaterial(id, data);
    expect(prismaMock.update).toHaveBeenCalledWith({ where: { id }, data });
  });

  it("should call prisma.delete with correct id", async () => {
    const id = "uuid";
    await repository.deleteRawMaterial(id);
    expect(prismaMock.delete).toHaveBeenCalledWith({ where: { id } });
  });
});
