import { prisma } from "../../config/prisma";

interface ProductionSuggestion {
  productId: string;
  productName: string;
  productValue: number;
  quantityToProduce: number;
}

export class ProductionService {
  async suggestProduction() {
    const products = await prisma.product.findMany({
      include: {
        rawMaterials: {
          include: {
            rawMaterial: true,
          },
        },
      },
      orderBy: {
        value: "desc",
      },
    });

    const rawMaterials = await prisma.rawMaterial.findMany();

    const stockTracker = new Map<string, number>();
    rawMaterials.forEach((rm) =>
      stockTracker.set(rm.id, Number(rm.stockQuantity)),
    );

    const suggestions: ProductionSuggestion[] = [];
    let totalValue = 0;

    for (const product of products) {
      if (product.rawMaterials.length === 0) continue;

      let maxCanProduce = Infinity;
      for (const item of product.rawMaterials) {
        const available = stockTracker.get(item.rawMaterialId) || 0;
        const required = Number(item.requiredQuantity);
        const canMakeWithThisMaterial = Math.floor(available / required);

        if (canMakeWithThisMaterial < maxCanProduce) {
          maxCanProduce = canMakeWithThisMaterial;
        }
      }

      if (maxCanProduce > 0 && maxCanProduce !== Infinity) {
        for (const item of product.rawMaterials) {
          const currentStock = stockTracker.get(item.rawMaterialId) || 0;
          const required = Number(item.requiredQuantity);
          stockTracker.set(
            item.rawMaterialId,
            currentStock - maxCanProduce * required,
          );
        }

        const valueAsNumber = Number(product.value);

        suggestions.push({
          productId: product.id,
          productName: product.name,
          productValue: valueAsNumber,
          quantityToProduce: maxCanProduce,
        });

        totalValue += maxCanProduce * valueAsNumber;
      }
    }

    return {
      suggestedProduction: suggestions,
      totalEstimatedValue: Number(totalValue.toFixed(2)),
    };
  }
}
