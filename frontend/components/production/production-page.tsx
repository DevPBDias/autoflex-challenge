"use client";

import { useQuery } from "@tanstack/react-query";
import { productionService } from "@/lib/services/production";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function ProductionPage() {
  const { data, isLoading, error } = useQuery({
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Production Intel
          </h2>
          <p className="text-muted-foreground mt-1">
            Products you can produce based on current raw material inventory.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg w-full sm:w-auto">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-1">
            Total Potential Revenue
          </p>
          <p className="text-3xl font-black text-blue-700">
            $
            {data?.totalEstimatedValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.suggestedProduction.map((item) => (
          <Card
            key={item.productId}
            className="overflow-hidden border-slate-200"
          >
            <CardHeader className="bg-slate-50 border-b p-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold">
                  {item.productName}
                </CardTitle>
                <Badge
                  variant={
                    item.quantityToProduce > 0 ? "default" : "destructive"
                  }
                  className={
                    item.quantityToProduce > 0
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  {item.quantityToProduce > 0 ? "Available" : "Out of stock"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-4xl font-black text-slate-900">
                  {item.quantityToProduce}
                </span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Units producible
                </span>
                {item.quantityToProduce > 0 ? (
                  <div className="flex items-center gap-1 text-green-600 text-sm mt-3 font-medium">
                    <CheckCircle2 size={16} /> Ready for production
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-3 font-medium">
                    <AlertCircle size={16} /> Insufficient materials
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data?.suggestedProduction.length === 0 && (
        <div className="text-center p-16 bg-white rounded-xl border border-dashed border-slate-300 text-muted-foreground">
          <p className="text-lg">No products defined yet.</p>
          <p className="text-sm">
            Start by adding products and their compositions.
          </p>
        </div>
      )}
    </div>
  );
}
