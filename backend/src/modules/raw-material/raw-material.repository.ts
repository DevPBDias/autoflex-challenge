import { prisma } from "../../config/prisma";
import {
  CreateRawMaterialDTO,
  UpdateRawMaterialDTO,
} from "./dto/raw-material.dto";

export class RawMaterialRepository {
  async createRawMaterial(data: CreateRawMaterialDTO) {
    return prisma.rawMaterial.create({
      data,
    });
  }

  async findAllRawMaterials() {
    return prisma.rawMaterial.findMany();
  }

  async findOneRawMaterialById(id: string) {
    return prisma.rawMaterial.findUnique({
      where: { id },
    });
  }

  async findRawMaterialByCode(code: string) {
    return prisma.rawMaterial.findUnique({
      where: { code },
    });
  }

  async updateRawMaterial(id: string, data: UpdateRawMaterialDTO) {
    return prisma.rawMaterial.update({
      where: { id },
      data,
    });
  }

  async deleteRawMaterial(id: string) {
    return prisma.rawMaterial.delete({
      where: { id },
    });
  }
}
