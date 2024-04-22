"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Image, Plus, Search, Table } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ActionTooltip from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { DataTable } from "@/components/datatable";
import APIList from "@/components/api-list";
import { ClothingProduct } from "@/types";
import { ClothingProductColumn, columns } from "./clothing-product-column";
import ClothingProductCard from "./clothing-product-card";
import { SizeValue } from "@prisma/client";

type Props = {
  clothingProducts: ClothingProduct[];
};

const ClothingProductClient = ({ clothingProducts }: Props) => {
  const [clothingProductViewState, setClothingProductViewState] = useState<
    "datatable" | "card" | null
  >(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredClothingProducts, setFilteredClothingProducts] =
    useState(clothingProducts);
  const router = useRouter();
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredClothingProducts(clothingProducts); // Show all clothingProducts if search is empty
    } else {
      const lowerCaseSearch = searchInput.toLowerCase();
      const filtered = clothingProducts.filter((clothingProduct) =>
        clothingProduct.name.toLowerCase().includes(lowerCaseSearch),
      );
      setFilteredClothingProducts(filtered);
      setCurrentPage(1);
    }
  }, [searchInput, clothingProducts]);

  useEffect(() => {
    const currentClothingProductViewState = localStorage.getItem(
      "clothingProductViewState",
    );
    if (currentClothingProductViewState === null) {
      setClothingProductViewState("card");
    } else {
      setClothingProductViewState(
        currentClothingProductViewState as typeof clothingProductViewState,
      );
    }
  }, []);

  useEffect(() => {
    if (clothingProductViewState) {
      localStorage.setItem(
        "clothingProductViewState",
        clothingProductViewState,
      );
    }
  }, [clothingProductViewState]);

  const formattedClothingProducts: ClothingProductColumn[] =
    filteredClothingProducts.map((clothingProduct) => ({
      slug: clothingProduct.slug,
      name: clothingProduct.name,
      brand: clothingProduct.brand || "",
      category: clothingProduct.category.name,
      size: clothingProduct.size?.value || SizeValue.M,
      color: clothingProduct.color?.value || "#fff",
      price: clothingProduct.price,
      stock: clothingProduct.stock,
      createdAt: format(clothingProduct.createdAt, "mm/dd/yy"),
      updatedAt: format(clothingProduct.updatedAt, "mm/dd/yy"),
    }));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClothingProducts = filteredClothingProducts.slice(
    startIndex,
    endIndex,
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title={
            clothingProducts.length === 1
              ? `Product (${clothingProducts.length})`
              : `Products (${clothingProducts.length})`
          }
          description="Manage products for your store"
        />
        <div className="flex gap-x-4">
          <ActionTooltip tooltip="Switch to image view">
            <Button
              onClick={() => setClothingProductViewState("card")}
              variant={`ghost`}
              size={`icon`}
              className={cn(
                "flex items-center justify-center",
                clothingProductViewState === "card" && "bg-black/15",
              )}
            >
              <Image className="h-1/2 w-1/2" />
            </Button>
          </ActionTooltip>
          <ActionTooltip tooltip="Switch to datatable view">
            <Button
              onClick={() => setClothingProductViewState("datatable")}
              variant={`ghost`}
              size={`icon`}
              className={cn(
                "flex items-center justify-center",
                clothingProductViewState === "datatable" && "bg-black/15",
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
      {/* Search */}
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
      {clothingProductViewState === "datatable" && (
        <DataTable columns={columns} data={formattedClothingProducts} />
      )}
      {clothingProductViewState === "card" && (
        <>
          {filteredClothingProducts.length === 0 ? (
            <div>
              <p>No products found.</p>
            </div>
          ) : (
            <>
              <div className="grid min-h-72 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentClothingProducts.map((clothingProduct) => (
                  <ClothingProductCard
                    clothingProduct={clothingProduct}
                    key={clothingProduct.id}
                  />
                ))}
              </div>
              {/* Previous Button */}
              <div className="flex w-full items-center justify-center gap-x-2">
                <Button
                  variant={`ghost`}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="h-8"
                >
                  Previous
                </Button>

                {/* Page Numbers (example) */}
                <div>
                  {[
                    ...Array(
                      Math.ceil(filteredClothingProducts.length / itemsPerPage),
                    ),
                  ].map((_, i) => (
                    <Button
                      variant={`ghost`}
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={cn(
                        "h-8",
                        currentPage === i + 1 && "bg-black/20",
                      )}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                {/* Next Button */}
                <Button
                  disabled={
                    currentPage ===
                    Math.ceil(filteredClothingProducts.length / itemsPerPage)
                  }
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="h-8"
                  variant={`ghost`}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </>
      )}
      <Header title="API" description="API calls for Products" />
      <APIList name="products" id="product-slug" />
    </>
  );
};

export default ClothingProductClient;
