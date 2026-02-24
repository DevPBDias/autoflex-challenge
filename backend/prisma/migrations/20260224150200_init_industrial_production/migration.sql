-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_materials" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stockQuantity" DECIMAL(15,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raw_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_raw_materials" (
    "productId" UUID NOT NULL,
    "rawMaterialId" UUID NOT NULL,
    "requiredQuantity" DECIMAL(15,4) NOT NULL,

    CONSTRAINT "product_raw_materials_pkey" PRIMARY KEY ("productId","rawMaterialId")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");

-- CreateIndex
CREATE INDEX "products_code_idx" ON "products"("code");

-- CreateIndex
CREATE UNIQUE INDEX "raw_materials_code_key" ON "raw_materials"("code");

-- CreateIndex
CREATE INDEX "raw_materials_code_idx" ON "raw_materials"("code");

-- CreateIndex
CREATE INDEX "product_raw_materials_productId_idx" ON "product_raw_materials"("productId");

-- CreateIndex
CREATE INDEX "product_raw_materials_rawMaterialId_idx" ON "product_raw_materials"("rawMaterialId");

-- AddForeignKey
ALTER TABLE "product_raw_materials" ADD CONSTRAINT "product_raw_materials_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_raw_materials" ADD CONSTRAINT "product_raw_materials_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "raw_materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
