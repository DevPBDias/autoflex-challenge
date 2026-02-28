"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productRawMaterialsService } from "@/lib/services/product-raw-materials";
import { rawMaterialsService } from "@/lib/services/raw-materials";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProductCompositionProps {
  productId: string;
}

export function ProductComposition({ productId }: ProductCompositionProps) {
  const queryClient = useQueryClient();
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { data: composition, isLoading: isCompLoading } = useQuery({
    queryKey: ["product-composition", productId],
    queryFn: () => productRawMaterialsService.getComposition(productId),
  });

  const { data: materials, isLoading: isMatsLoading } = useQuery({
    queryKey: ["raw-materials"],
    queryFn: rawMaterialsService.getAll,
  });

  const associateMutation = useMutation({
    mutationFn: productRawMaterialsService.associate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-composition", productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-availability"],
      });
      toast.success("Material added to product");
      setSelectedMaterialId("");
      setQuantity(1);
    },
    onError: () => toast.error("Failed to add material"),
  });

  const disassociateMutation = useMutation({
    mutationFn: ({ mId }: { mId: string }) =>
      productRawMaterialsService.disassociate(productId, mId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-composition", productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-availability"],
      });
      toast.success("Material removed from product");
    },
    onError: () => toast.error("Failed to remove material"),
  });

  const handleAdd = () => {
    if (!selectedMaterialId || quantity <= 0) {
      toast.error("Please select a material and a valid quantity");
      return;
    }
    associateMutation.mutate({
      productId,
      rawMaterialId: selectedMaterialId,
      requiredQuantity: quantity,
    });
  };

  if (isCompLoading || isMatsLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-end gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="w-full sm:flex-1 space-y-2">
          <label className="text-sm font-medium">Material</label>
          <Select
            value={selectedMaterialId}
            onValueChange={setSelectedMaterialId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a material" />
            </SelectTrigger>
            <SelectContent>
              {materials?.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name} ({m.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-24 space-y-2">
          <label className="text-sm font-medium">Qty</label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <Button
          onClick={handleAdd}
          disabled={associateMutation.isPending}
          className="w-full sm:w-auto"
        >
          <Plus size={16} className="mr-2" /> Add
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Required Qty</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {composition?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-4 text-muted-foreground"
                  >
                    No materials associated with this product.
                  </TableCell>
                </TableRow>
              ) : (
                composition?.map((item) => (
                  <TableRow key={item.rawMaterialId}>
                    <TableCell>
                      <div className="font-medium">
                        {item.rawMaterial?.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.rawMaterial?.code}
                      </div>
                    </TableCell>
                    <TableCell>{Number(item.requiredQuantity)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={associateMutation.isPending}
                          onClick={() => {
                            setSelectedMaterialId(item.rawMaterialId);
                            setQuantity(Number(item.requiredQuantity));
                          }}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          disabled={disassociateMutation.isPending}
                          onClick={() =>
                            disassociateMutation.mutate({
                              mId: item.rawMaterialId,
                            })
                          }
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
    </div>
  );
}
