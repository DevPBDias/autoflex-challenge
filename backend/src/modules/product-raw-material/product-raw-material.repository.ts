import { prisma } from "../../config/prisma";
import { AddRawMaterialToProductDTO } from "./product-raw-material.dto";

export class ProductRawMaterialRepository {
  async upsertAssociation(data: AddRawMaterialToProductDTO) {
    return await prisma.productRawMaterial.upsert({
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
  }

  async deleteAssociation(productId: string, rawMaterialId: string) {
    return await prisma.productRawMaterial.delete({
      where: {
        productId_rawMaterialId: {
          productId,
          rawMaterialId,
        },
      },
    });
  }

  async findProductComposition(productId: string) {
    return await prisma.productRawMaterial.findMany({
      where: { productId },
      include: {
        rawMaterial: true,
      },
    });
  }
}
