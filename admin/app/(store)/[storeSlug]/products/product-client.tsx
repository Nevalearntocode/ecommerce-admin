"use client";

import ActionTooltip from "@/components/action-tooltip";
import APIList from "@/components/api-list";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ClothingProduct, TechnologyProduct } from "@/types";
import { format } from "date-fns";
import { Image, Plus, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props<TProduct> = {
  products: TProduct[];
};

const ProductClient = <TProduct extends ClothingProduct | TechnologyProduct>({
  products,
}: Props<TProduct>) => {
  const [productViewState, setProductViewState] = useState<
    "datatable" | "card" | null
  >(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const router = useRouter();
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredProducts(products);
    } else {
      const lowerCaseSearch = searchInput.toLowerCase();
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(lowerCaseSearch),
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    }
  }, [searchInput, products]);

  useEffect(() => {
    const currentProductViewState = localStorage.getItem("productViewState");
    if (currentProductViewState === null) {
      setProductViewState("card");
    } else {
      setProductViewState(currentProductViewState as typeof productViewState);
    }
  }, []);

  useEffect(() => {
    if (productViewState) {
      localStorage.setItem("productViewState", productViewState);
    }
  }, [productViewState]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title={
            products.length === 1
              ? `Product (${products.length})`
              : `Products (${products.length})`
          }
          description="Manage your products for your store"
        />
        <div className="flex gap-x-4">
          <ActionTooltip tooltip="Switch to image view">
            <Button
              onClick={() => setProductViewState("card")}
              variant={`ghost`}
              size={`icon`}
              className={cn(
                "flex items-center justify-center",
                productViewState === "card" && "bg-black/15",
              )}
            >
              <Image className="h-1/2 w-1/2" />
            </Button>
          </ActionTooltip>
          <ActionTooltip tooltip="Switch to datatable view">
            <Button
              onClick={() => setProductViewState("datatable")}
              variant={`ghost`}
              size={`icon`}
              className={cn(
                "flex items-center justify-center",
                productViewState === "datatable" && "bg-black/15",
              )}
            >
              <Table className="h-1/2 w-1/2" />
            </Button>
          </ActionTooltip>
          <Button
            onClick={() => router.push(`/${params.storeSlug}/products/new`)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add new
          </Button>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="relative">
          <Input
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search product by name..."
          />
          <Button
            className="absolute right-0 top-0 rounded-full"
            variant={`ghost`}
            size={`icon`}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Header title="API" description="API calls for Products" />
      <APIList name="products" id="product-slug" />
    </>
  );
};

export default ProductClient;
