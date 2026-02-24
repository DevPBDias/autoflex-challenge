import { prisma } from "../../config/prisma";
import { CreateProductDTO, UpdateProductDTO } from "./dto/product.dto";

export class ProductRepository {
  async createProduct(data: CreateProductDTO) {
    return prisma.product.create({
      data,
    });
  }

  async findAllProducts() {
    return prisma.product.findMany();
  }

  async findOneProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async findProductByCode(code: string) {
    return prisma.product.findUnique({
      where: { code },
    });
  }

  async updateProduct(id: string, data: UpdateProductDTO) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
