/// <reference types="node" />
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  await prisma.productRawMaterial.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.rawMaterial.deleteMany({});

  const steel = await prisma.rawMaterial.create({
    data: {
      code: "RM-STEEL-001",
      name: "Industrial Steel Sheet",
      stockQuantity: 500.5,
    },
  });

  const paint = await prisma.rawMaterial.create({
    data: {
      code: "RM-PAINT-RED",
      name: "Anti-Corrosive Red Paint",
      stockQuantity: 100.0,
    },
  });

  const plastic = await prisma.rawMaterial.create({
    data: {
      code: "RM-PLASTIC-HDPE",
      name: "High-Density Polyethylene",
      stockQuantity: 250.75,
    },
  });

  const industrialCabinet = await prisma.product.create({
    data: {
      code: "PRD-CAB-01",
      name: "Steel Industrial Cabinet",
      value: 1250.99,
      rawMaterials: {
        create: [
          {
            rawMaterialId: steel.id,
            requiredQuantity: 5.5,
          },
          {
            rawMaterialId: paint.id,
            requiredQuantity: 0.8,
          },
        ],
      },
    },
  });

  const protectiveCase = await prisma.product.create({
    data: {
      code: "PRD-CASE-02",
      name: "Heavy Duty Protective Case",
      value: 89.9,
      rawMaterials: {
        create: [
          {
            rawMaterialId: plastic.id,
            requiredQuantity: 1.2,
          },
          {
            rawMaterialId: paint.id,
            requiredQuantity: 0.1,
          },
        ],
      },
    },
  });

  console.log({ industrialCabinet, protectiveCase });
  console.log("✅ Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
