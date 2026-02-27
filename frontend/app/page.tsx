"use client";

import { useState } from "react";
import { ProductsPage } from "@/components/products/products-page";
import { RawMaterialsPage } from "@/components/raw-materials/raw-materials-page";
import { ProductionPage } from "@/components/production/production-page";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, BarChart3, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Tab = "products" | "materials" | "production";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "products" as Tab, label: "Products", icon: ShoppingCart },
    { id: "materials" as Tab, label: "Raw Materials", icon: Package },
    { id: "production" as Tab, label: "Production Info", icon: BarChart3 },
  ];

  const NavContent = () => (
    <nav className="flex flex-col gap-2 mt-8">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant={activeTab === item.id ? "default" : "ghost"}
          className="justify-start gap-3 w-full"
          onClick={() => {
            setActiveTab(item.id);
            setIsMobileMenuOpen(false);
          }}
        >
          <item.icon size={18} />
          {item.label}
        </Button>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Package size={20} />
          </div>
          <span className="font-bold text-lg">AutoFlex</span>
        </div>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader className="text-left">
              <SheetTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Package size={20} />
                </div>
                AutoFlex
              </SheetTitle>
            </SheetHeader>
            <NavContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 p-6 flex-col gap-8 sticky top-0 h-screen">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Package size={20} />
          </div>
          <h1 className="font-bold text-xl text-slate-900 tracking-tight">
            AutoFlex
          </h1>
        </div>
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === "products" && <ProductsPage />}
          {activeTab === "materials" && <RawMaterialsPage />}
          {activeTab === "production" && <ProductionPage />}
        </div>
      </main>
    </div>
  );
}
