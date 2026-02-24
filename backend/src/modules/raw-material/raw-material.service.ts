import { RawMaterialRepository } from "./raw-material.repository";
import {
  CreateRawMaterialSchema,
  UpdateRawMaterialSchema,
  CreateRawMaterialDTO,
  UpdateRawMaterialDTO,
} from "./dto/raw-material.dto";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class RawMaterialService {
  private repository: RawMaterialRepository;

  constructor() {
    this.repository = new RawMaterialRepository();
  }

  async createRawMaterial(data: CreateRawMaterialDTO) {
    const parsed = CreateRawMaterialSchema.safeParse(data);
    if (!parsed.success) {
      throw {
        status: 422,
        message: parsed.error.issues[0]?.message || "Validation failed",
      };
    }

    const rawMaterialExists = await this.repository.findRawMaterialByCode(
      parsed.data.code,
    );
    if (rawMaterialExists) {
      throw { status: 409, message: "Raw material code already exists" };
    }

    return this.repository.createRawMaterial(parsed.data);
  }

  async getAllRawMaterials() {
    return this.repository.findAllRawMaterials();
  }

  async getOneRawMaterialById(id: string) {
    if (!UUID_REGEX.test(id)) {
      throw { status: 400, message: "Invalid raw material ID format" };
    }

    const rawMaterial = await this.repository.findOneRawMaterialById(id);

    if (!rawMaterial) {
      throw { status: 404, message: "Raw material not found" };
    }

    return rawMaterial;
  }

  async updateRawMaterial(id: string, data: UpdateRawMaterialDTO) {
    if (!UUID_REGEX.test(id)) {
      throw { status: 400, message: "Invalid raw material ID format" };
    }

    const rawMaterial = await this.repository.findOneRawMaterialById(id);
    if (!rawMaterial) {
      throw { status: 404, message: "Raw material not found" };
    }

    if (!data || Object.keys(data).length === 0) {
      throw { status: 422, message: "Request body cannot be empty" };
    }

    const parsed = UpdateRawMaterialSchema.safeParse(data);
    if (!parsed.success) {
      throw {
        status: 422,
        message: parsed.error.issues[0]?.message || "Validation failed",
      };
    }

    if (parsed.data.code) {
      const rawMaterialWithCode = await this.repository.findRawMaterialByCode(
        parsed.data.code,
      );
      if (rawMaterialWithCode && rawMaterialWithCode.id !== id) {
        throw {
          status: 409,
          message: "Raw material code already in use by another raw material",
        };
      }
    }

    return this.repository.updateRawMaterial(id, parsed.data);
  }

  async deleteRawMaterial(id: string) {
    if (!UUID_REGEX.test(id)) {
      throw { status: 400, message: "Invalid raw material ID format" };
    }

    const rawMaterial = await this.repository.findOneRawMaterialById(id);
    if (!rawMaterial) {
      throw { status: 404, message: "Raw material not found" };
    }

    return this.repository.deleteRawMaterial(id);
  }
}
