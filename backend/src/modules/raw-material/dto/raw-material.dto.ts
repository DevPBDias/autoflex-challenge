import { z } from "zod";

export const CreateRawMaterialSchema = z.object({
  code: z
    .string({ message: "Field 'code' must be a non-empty string" })
    .trim()
    .min(1, "Field 'code' must be a non-empty string"),
  name: z
    .string({ message: "Field 'name' must be a non-empty string" })
    .trim()
    .min(1, "Field 'name' must be a non-empty string"),
  stockQuantity: z
    .number({
      message: "Field 'stockQuantity' must be a positive number",
    })
    .min(0, "Field 'stockQuantity' must be a positive number"),
});

export const UpdateRawMaterialSchema = z.object({
  code: z
    .string({ message: "Field 'code' must be a non-empty string" })
    .trim()
    .min(1, "Field 'code' must be a non-empty string")
    .optional(),
  name: z
    .string({ message: "Field 'name' must be a non-empty string" })
    .trim()
    .min(1, "Field 'name' must be a non-empty string")
    .optional(),
  stockQuantity: z
    .number({
      message: "Field 'stockQuantity' must be a positive number",
    })
    .min(0, "Field 'stockQuantity' must be a positive number")
    .optional(),
});

export type CreateRawMaterialDTO = z.infer<typeof CreateRawMaterialSchema>;
export type UpdateRawMaterialDTO = z.infer<typeof UpdateRawMaterialSchema>;
