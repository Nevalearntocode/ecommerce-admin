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
import { TechnologyProduct } from "@/types";
import { TechnologyProductColumn, columns } from "./technology-product-column";
import TechnologyProductCard from "./technology-product-card";

type Props = {
  technologyProducts: TechnologyProduct[];
};

const TechnologyProductClient = ({ technologyProducts }: Props) => {
  const [technologyProductViewState, setTechnologyProductViewState] = useState<
    "datatable" | "card" | null
  >(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredTechnologyProducts, setFilteredTechnologyProducts] =
    useState(technologyProducts);
  const router = useRouter();
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredTechnologyProducts(technologyProducts); // Show all technologyProducts if search is empty
    } else {
      const lowerCaseSearch = searchInput.toLowerCase();
      const filtered = technologyProducts.filter((technologyProduct) =>
        technologyProduct.name.toLowerCase().includes(lowerCaseSearch),
      );
      setFilteredTechnologyProducts(filtered);
      setCurrentPage(1);
    }
  }, [searchInput, technologyProducts]);

  useEffect(() => {
    const currentTechnologyProductViewState = localStorage.getItem(
      "technologyProductViewState",
    );
    if (currentTechnologyProductViewState === null) {
      setTechnologyProductViewState("card");
    } else {
      setTechnologyProductViewState(
        currentTechnologyProductViewState as typeof technologyProductViewState,
      );
    }
  }, []);

  useEffect(() => {
    if (technologyProductViewState) {
      localStorage.setItem(
        "technologyProductViewState",
        technologyProductViewState,
      );
    }
  }, [technologyProductViewState]);

  const formattedTechnologyProducts: TechnologyProductColumn[] =
    filteredTechnologyProducts.map((technologyProduct) => ({
      slug: technologyProduct.slug,
      name: technologyProduct.name,
      brand: technologyProduct.brand || "",
      category: technologyProduct.category.name,
      model: technologyProduct.model?.value || "",
      type: technologyProduct.type?.value || "",
      price: technologyProduct.price,
      stock: technologyProduct.stock,
      createdAt: format(technologyProduct.createdAt, "dd/M/yy"),
      updatedAt: format(technologyProduct.updatedAt, "dd/M/yy"),
    }));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTechnologyProducts = filteredTechnologyProducts.slice(
    startIndex,
    endIndex,
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title={
            technologyProducts.length === 1
              ? `Product (${technologyProducts.length})`
              : `Products (${technologyProducts.length})`
          }
          description="Manage products for your store"
        />
        <div className="flex gap-x-4">
          <ActionTooltip tooltip="Switch to image view">
            <Button
              onClick={() => setTechnologyProductViewState("card")}
              variant={`ghost`}
              size={`icon`}
              className={cn(
                "flex items-center justify-center",
                technologyProductViewState === "card" && "bg-black/15",
              )}
            >
              <Image className="h-1/2 w-1/2" />
            </Button>
          </ActionTooltip>
          <ActionTooltip tooltip="Switch to datatable view">
            <Button
              onClick={() => setTechnologyProductViewState("datatable")}
              variant={`ghost`}
              size={`icon`}
              className={cn(
                "flex items-center justify-center",
                technologyProductViewState === "datatable" && "bg-black/15",
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
      {technologyProductViewState === "datatable" && (
        <DataTable columns={columns} data={formattedTechnologyProducts} />
      )}
      {technologyProductViewState === "card" && (
        <>
          {filteredTechnologyProducts.length === 0 ? (
            <div>
              <p>No technologyProducts found.</p>
            </div>
          ) : (
            <>
              <div className="grid min-h-72 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentTechnologyProducts.map((technologyProduct) => (
                  <TechnologyProductCard
                    technologyProduct={technologyProduct}
                    key={technologyProduct.id}
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
                      Math.ceil(
                        filteredTechnologyProducts.length / itemsPerPage,
                      ),
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
                    Math.ceil(filteredTechnologyProducts.length / itemsPerPage)
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

export default TechnologyProductClient;
