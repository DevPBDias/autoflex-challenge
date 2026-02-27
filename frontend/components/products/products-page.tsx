"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService, Product } from "@/lib/services/products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Loader2, ListChecks } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ProductForm } from "@/components/products/product-form";
import { ProductComposition } from "@/components/products/product-composition";
import { toast } from "sonner";

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCompositionOpen, setIsCompositionOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productsService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: productsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleComposition = (product: Product) => {
    setSelectedProduct(product);
    setIsCompositionOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your product catalog.</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No products found. Add your first one!
                  </TableCell>
                </TableRow>
              ) : (
                products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-blue-600">
                      {product.code}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${Number(product.value).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Composition"
                          onClick={() => handleComposition(product)}
                        >
                          <ListChecks size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if (confirm("Are you sure?")) {
                              deleteMutation.mutate(product.id);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Edit Product" : "Create Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            initialData={selectedProduct}
            onSuccess={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCompositionOpen} onOpenChange={setIsCompositionOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Composition: {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductComposition productId={selectedProduct.id} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
