import { RawMaterialService } from "../raw-material.service";
import { RawMaterialRepository } from "../raw-material.repository";

jest.mock("../raw-material.repository");

describe("RawMaterialService", () => {
  let service: RawMaterialService;
  let repositoryMock: jest.Mocked<RawMaterialRepository>;

  const VALID_UUID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
  const OTHER_UUID = "b2c3d4e5-f6a7-8901-bcde-f12345678901";
  const mockRM = {
    id: VALID_UUID,
    code: "RM-001",
    name: "Steel",
    stockQuantity: 100,
  };

  beforeEach(() => {
    service = new RawMaterialService();
    repositoryMock = (service as any).repository;
  });

  describe("createRawMaterial", () => {
    it("should create successfully", async () => {
      repositoryMock.findRawMaterialByCode.mockResolvedValue(null);
      repositoryMock.createRawMaterial.mockResolvedValue(mockRM as any);

      const result = await service.createRawMaterial({
        code: "RM-001",
        name: "Steel",
        stockQuantity: 100,
      });

      expect(result).toEqual(mockRM);
    });

    it("should throw 422 for invalid data", async () => {
      await expect(
        service.createRawMaterial({
          code: "",
          name: "",
          stockQuantity: -1,
        } as any),
      ).rejects.toMatchObject({
        status: 422,
      });
    });

    it("should throw 409 if code exists", async () => {
      repositoryMock.findRawMaterialByCode.mockResolvedValue(mockRM as any);
      await expect(
        service.createRawMaterial({
          code: "RM-001",
          name: "X",
          stockQuantity: 1,
        }),
      ).rejects.toMatchObject({
        status: 409,
      });
    });
  });

  describe("getAllRawMaterials", () => {
    it("should return all", async () => {
      repositoryMock.findAllRawMaterials.mockResolvedValue([mockRM] as any);
      const result = await service.getAllRawMaterials();
      expect(result).toEqual([mockRM]);
    });
  });

  describe("getOneRawMaterialById", () => {
    it("should return one", async () => {
      repositoryMock.findOneRawMaterialById.mockResolvedValue(mockRM as any);
      const result = await service.getOneRawMaterialById(VALID_UUID);
      expect(result).toEqual(mockRM);
    });

    it("should throw 400 for bad UUID", async () => {
      await expect(service.getOneRawMaterialById("bad")).rejects.toMatchObject({
        status: 400,
      });
    });

    it("should throw 404 if not found", async () => {
      repositoryMock.findOneRawMaterialById.mockResolvedValue(null);
      await expect(
        service.getOneRawMaterialById(VALID_UUID),
      ).rejects.toMatchObject({
        status: 404,
      });
    });
  });

  describe("updateRawMaterial", () => {
    it("should update successfully", async () => {
      repositoryMock.findOneRawMaterialById.mockResolvedValue(mockRM as any);
      repositoryMock.findRawMaterialByCode.mockResolvedValue(null);
      repositoryMock.updateRawMaterial.mockResolvedValue(mockRM as any);
      const result = await service.updateRawMaterial(VALID_UUID, {
        name: "New",
      });
      expect(result).toEqual(mockRM);
    });

    it("should throw 400 for bad UUID", async () => {
      await expect(service.updateRawMaterial("bad", {})).rejects.toMatchObject({
        status: 400,
      });
    });

    it("should throw 404 if not found", async () => {
      repositoryMock.findOneRawMaterialById.mockResolvedValue(null);
      await expect(
        service.updateRawMaterial(VALID_UUID, { name: "X" }),
      ).rejects.toMatchObject({
        status: 404,
      });
    });

    it("should throw 422 for empty body", async () => {
      repositoryMock.findOneRawMaterialById.mockResolvedValue(mockRM as any);
      await expect(
        service.updateRawMaterial(VALID_UUID, {}),
      ).rejects.toMatchObject({
        status: 422,
      });
    });

    it("should throw 422 for invalid update data", async () => {
      repositoryMock.findOneRawMaterialById.mockResolvedValue(mockRM as any);
      await expect(
        service.updateRawMaterial(VALID_UUID, { stockQuantity: -1 }),
      ).rejects.toMatchObject({
        status: 422,
      });
    });

    it("should throw 409 if updating to existing code", async () => {
      repositoryMock.findOneRawMaterialById.mockResolvedValue(mockRM as any);
      repositoryMock.findRawMaterialByCode.mockResolvedValue({
        id: OTHER_UUID,
        code: "DUP",
      } as any);
      await expect(
        service.updateRawMaterial(VALID_UUID, { code: "DUP" }),
      ).rejects.toMatchObject({
        status: 409,
      });
    });
  });

  describe("deleteRawMaterial", () => {
    it("should delete successfully", async () => {
      repositoryMock.findOneRawMaterialById.mockResolvedValue(mockRM as any);
      repositoryMock.deleteRawMaterial.mockResolvedValue(mockRM as any);
      const result = await service.deleteRawMaterial(VALID_UUID);
      expect(result).toEqual(mockRM);
    });

    it("should throw 400 for bad UUID", async () => {
      await expect(service.deleteRawMaterial("bad")).rejects.toMatchObject({
        status: 400,
      });
    });

    it("should throw 404 if not found", async () => {
      repositoryMock.findOneRawMaterialById.mockResolvedValue(null);
      await expect(service.deleteRawMaterial(VALID_UUID)).rejects.toMatchObject(
        {
          status: 404,
        },
      );
    });
  });
});
