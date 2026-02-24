export interface CreateProductDTO {
  code: string;
  name: string;
  value: number;
}

export interface UpdateProductDTO {
  code?: string;
  name?: string;
  value?: number;
}
