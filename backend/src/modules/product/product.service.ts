import { ZodError } from "zod";
import { ProductRepository } from "./product.repository";
import {
  CreateProductSchema,
  UpdateProductSchema,
  CreateProductDTO,
  UpdateProductDTO,
} from "./dto/product.dto";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async createProduct(data: CreateProductDTO) {
    const parsed = CreateProductSchema.safeParse(data);
    if (!parsed.success) {
      throw {
        status: 422,
        message: parsed.error.issues[0]?.message || "Validation failed",
      };
    }

    const productExists = await this.repository.findProductByCode(
      parsed.data.code,
    );
    if (productExists) {
      throw { status: 409, message: "Product code already exists" };
    }

    return this.repository.createProduct(parsed.data);
  }

  async getAllProducts() {
    return this.repository.findAllProducts();
  }

  async getOneProductById(id: string) {
    if (!UUID_REGEX.test(id)) {
      throw { status: 400, message: "Invalid product ID format" };
    }

    const product = await this.repository.findOneProductById(id);

    if (!product) {
      throw { status: 404, message: "Product not found" };
    }

    return product;
  }

  async updateProduct(id: string, data: UpdateProductDTO) {
    if (!UUID_REGEX.test(id)) {
      throw { status: 400, message: "Invalid product ID format" };
    }

    const product = await this.repository.findOneProductById(id);
    if (!product) {
      throw { status: 404, message: "Product not found" };
    }

    if (!data || Object.keys(data).length === 0) {
      throw { status: 422, message: "Request body cannot be empty" };
    }

    const parsed = UpdateProductSchema.safeParse(data);
    if (!parsed.success) {
      throw {
        status: 422,
        message: parsed.error.issues[0]?.message || "Validation failed",
      };
    }

    if (parsed.data.code) {
      const productWithCode = await this.repository.findProductByCode(
        parsed.data.code,
      );
      if (productWithCode && productWithCode.id !== id) {
        throw {
          status: 409,
          message: "Product code already in use by another product",
        };
      }
    }

    return this.repository.updateProduct(id, parsed.data);
  }

  async deleteProduct(id: string) {
    if (!UUID_REGEX.test(id)) {
      throw { status: 400, message: "Invalid product ID format" };
    }

    const product = await this.repository.findOneProductById(id);
    if (!product) {
      throw { status: 404, message: "Product not found" };
    }

    return this.repository.deleteProduct(id);
  }
}
