import { z } from "zod";

export const CreateProductSchema = z.object({
  code: z
    .string({ message: "Field 'code' must be a non-empty string" })
    .trim()
    .min(1, "Field 'code' must be a non-empty string"),
  name: z
    .string({ message: "Field 'name' must be a non-empty string" })
    .trim()
    .min(1, "Field 'name' must be a non-empty string"),
  value: z
    .number({
      message: "Field 'value' must be a positive number",
    })
    .min(0, "Field 'value' must be a positive number"),
});

export const UpdateProductSchema = z.object({
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
  value: z
    .number({
      message: "Field 'value' must be a positive number",
    })
    .min(0, "Field 'value' must be a positive number")
    .optional(),
});

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;
