"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rawMaterialsService, RawMaterial } from "@/lib/services/raw-materials";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  stockQuantity: z.coerce.number().min(0, "Stock must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

interface RawMaterialFormProps {
  initialData: RawMaterial | null;
  onSuccess: () => void;
}

export function RawMaterialForm({
  initialData,
  onSuccess,
}: RawMaterialFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      stockQuantity: initialData?.stockQuantity || 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (initialData) {
        return rawMaterialsService.update(initialData.id, values);
      }
      return rawMaterialsService.create(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
      toast.success(
        initialData ? "Updated successfully" : "Created successfully",
      );
      onSuccess();
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Something went wrong";
      toast.error(message);
    },
  });

  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="RM001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Steel Pipe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stockQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Quantity</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {initialData ? "Update" : "Create"} Material
        </Button>
      </form>
    </Form>
  );
}
