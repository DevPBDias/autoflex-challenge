"use client";

import { useQuery } from "@tanstack/react-query";
import { productionService } from "@/lib/services/production";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function ProductionPage() {
  const {
    data: availability,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["production-availability"],
    queryFn: productionService.getAvailability,
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <AlertCircle className="mx-auto mb-2" />
        <p>Failed to load production data. Make sure the backend is running.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Production Intel</h2>
        <p className="text-muted-foreground">
          Products you can produce based on current raw material inventory.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availability?.map((item) => (
          <Card key={item.productId} className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b p-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.productName}</CardTitle>
                <Badge
                  variant={
                    item.quantityToProduce > 0 ? "default" : "destructive"
                  }
                >
                  {item.quantityToProduce > 0 ? "Available" : "Out of stock"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-4xl font-bold text-slate-900">
                  {item.quantityToProduce}
                </span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Units producible
                </span>
                {item.quantityToProduce > 0 ? (
                  <div className="flex items-center gap-1 text-green-600 text-sm mt-2">
                    <CheckCircle2 size={14} /> Ready for production
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-2">
                    <AlertCircle size={14} /> Insufficient materials
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {availability?.length === 0 && (
        <div className="text-center p-12 bg-white rounded-xl border border-dashed text-muted-foreground">
          No products defined yet.
        </div>
      )}
    </div>
  );
}
