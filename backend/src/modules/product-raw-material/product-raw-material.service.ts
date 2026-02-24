import { prisma } from "../../config/prisma";
import { AddRawMaterialToProductDTO } from "./product-raw-material.dto";
import { ProductRawMaterialRepository } from "./product-raw-material.repository";

export class ProductRawMaterialService {
  private repository: ProductRawMaterialRepository;

  constructor() {
    this.repository = new ProductRawMaterialRepository();
  }

  async addRawMaterialToProduct(data: AddRawMaterialToProductDTO) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) throw { status: 404, message: "Product not found" };

    const rawMaterial = await prisma.rawMaterial.findUnique({
      where: { id: data.rawMaterialId },
    });
    if (!rawMaterial) throw { status: 404, message: "Raw material not found" };

    return await this.repository.upsertAssociation(data);
  }

  async removeRawMaterialFromProduct(productId: string, rawMaterialId: string) {
    try {
      return await this.repository.deleteAssociation(productId, rawMaterialId);
    } catch (error) {
      throw { status: 404, message: "Association not found" };
    }
  }

  async getProductComposition(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw { status: 404, message: "Product not found" };

    return await this.repository.findProductComposition(productId);
  }
}
