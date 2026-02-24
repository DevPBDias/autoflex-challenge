import { ProductRepository } from "./product.repository";
import { CreateProductDTO, UpdateProductDTO } from "./dto/product.dto";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async createProduct(data: CreateProductDTO) {
    if (!data.code || !data.name || data.value === undefined) {
      throw {
        status: 422,
        message: "Missing required fields: code, name, value",
      };
    }

    if (typeof data.code !== "string" || data.code.trim().length === 0) {
      throw { status: 422, message: "Field 'code' must be a non-empty string" };
    }

    if (typeof data.name !== "string" || data.name.trim().length === 0) {
      throw { status: 422, message: "Field 'name' must be a non-empty string" };
    }

    if (typeof data.value !== "number" || isNaN(data.value) || data.value < 0) {
      throw { status: 422, message: "Field 'value' must be a positive number" };
    }

    const productExists = await this.repository.findProductByCode(data.code);
    if (productExists) {
      throw { status: 409, message: "Product code already exists" };
    }

    return this.repository.createProduct(data);
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

    if (
      data.value !== undefined &&
      (typeof data.value !== "number" || isNaN(data.value) || data.value < 0)
    ) {
      throw { status: 422, message: "Field 'value' must be a positive number" };
    }

    if (
      data.name !== undefined &&
      (typeof data.name !== "string" || data.name.trim().length === 0)
    ) {
      throw { status: 422, message: "Field 'name' must be a non-empty string" };
    }

    if (data.code && typeof data.code === "string") {
      const productWithCode = await this.repository.findProductByCode(
        data.code,
      );
      if (productWithCode && productWithCode.id !== id) {
        throw {
          status: 409,
          message: "Product code already in use by another product",
        };
      }
    }

    return this.repository.updateProduct(id, data);
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
