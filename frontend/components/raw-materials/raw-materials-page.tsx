"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rawMaterialsService, RawMaterial } from "@/lib/services/raw-materials";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { RawMaterialForm } from "@/components/raw-materials/raw-material-form";
import { toast } from "sonner";

export function RawMaterialsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(
    null,
  );

  const { data: materials, isLoading } = useQuery({
    queryKey: ["raw-materials"],
    queryFn: rawMaterialsService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: rawMaterialsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
      toast.success("Raw material deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete raw material");
    },
  });

  const handleEdit = (material: RawMaterial) => {
    setEditingMaterial(material);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingMaterial(null);
    setIsDialogOpen(true);
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
          <h2 className="text-3xl font-bold tracking-tight">Raw Materials</h2>
          <p className="text-muted-foreground">
            Manage your raw materials inventory.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={16} /> Add Material
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Stock Quantity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No materials found. Add your first one!
                  </TableCell>
                </TableRow>
              ) : (
                materials?.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium text-blue-600">
                      {material.code}
                    </TableCell>
                    <TableCell>{material.name}</TableCell>
                    <TableCell>
                      {Number(material.stockQuantity).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(material)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if (confirm("Are you sure?")) {
                              deleteMutation.mutate(material.id);
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMaterial ? "Edit Raw Material" : "Create Raw Material"}
            </DialogTitle>
          </DialogHeader>
          <RawMaterialForm
            initialData={editingMaterial}
            onSuccess={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
