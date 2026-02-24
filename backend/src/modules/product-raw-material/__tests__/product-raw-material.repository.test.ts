import { prisma } from "../../../config/prisma";
import { ProductRawMaterialRepository } from "../product-raw-material.repository";

jest.mock("../../../config/prisma", () => ({
  prisma: {
    productRawMaterial: {
      upsert: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const prismaMock = prisma.productRawMaterial as unknown as {
  upsert: jest.Mock;
  delete: jest.Mock;
  findMany: jest.Mock;
};

describe("ProductRawMaterialRepository", () => {
  let repository: ProductRawMaterialRepository;

  beforeEach(() => {
    repository = new ProductRawMaterialRepository();
    jest.clearAllMocks();
  });

  it("should call prisma.upsert with correct data", async () => {
    const data = {
      productId: "prod-1",
      rawMaterialId: "rm-1",
      requiredQuantity: 10,
    };
    await repository.upsertAssociation(data);
    expect(prismaMock.upsert).toHaveBeenCalledWith({
      where: {
        productId_rawMaterialId: {
          productId: data.productId,
          rawMaterialId: data.rawMaterialId,
        },
      },
      update: {
        requiredQuantity: data.requiredQuantity,
      },
      create: {
        productId: data.productId,
        rawMaterialId: data.rawMaterialId,
        requiredQuantity: data.requiredQuantity,
      },
    });
  });

  it("should call prisma.delete with correct keys", async () => {
    const productId = "prod-1";
    const rawMaterialId = "rm-1";
    await repository.deleteAssociation(productId, rawMaterialId);
    expect(prismaMock.delete).toHaveBeenCalledWith({
      where: {
        productId_rawMaterialId: {
          productId,
          rawMaterialId,
        },
      },
    });
  });

  it("should call prisma.findMany with include", async () => {
    const productId = "prod-1";
    await repository.findProductComposition(productId);
    expect(prismaMock.findMany).toHaveBeenCalledWith({
      where: { productId },
      include: {
        rawMaterial: true,
      },
    });
  });
});
