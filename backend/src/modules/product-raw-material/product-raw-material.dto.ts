import { z } from "zod";

export const AddRawMaterialToProductSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  rawMaterialId: z.string().uuid("Invalid raw material ID"),
  requiredQuantity: z.number().positive("Quantity must be a positive number"),
});

export const UpdateProductRawMaterialSchema = z.object({
  requiredQuantity: z.number().positive("Quantity must be a positive number"),
});

export type AddRawMaterialToProductDTO = z.infer<
  typeof AddRawMaterialToProductSchema
>;
export type UpdateProductRawMaterialDTO = z.infer<
  typeof UpdateProductRawMaterialSchema
>;
