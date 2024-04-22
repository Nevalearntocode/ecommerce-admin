"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Image, Plus, Search, Table } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CategoryCard from "./category-card";
import ActionTooltip from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { CategoryColumn, columns } from "./category-column";
import { format } from "date-fns";
import { DataTable } from "@/components/datatable";
import APIList from "@/components/api-list";
import { CategoryWithBillboard } from "@/types";

type Props = {
  categories: CategoryWithBillboard[];
};

const CategoryClient = ({ categories }: Props) => {
  const [categoryViewState, setCategoryViewState] = useState<
    "datatable" | "card" | null
  >(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const router = useRouter();
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredCategories(categories); // Show all categories if search is empty
    } else {
      const lowerCaseSearch = searchInput.toLowerCase();
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(lowerCaseSearch),
      );
      setFilteredCategories(filtered);
      setCurrentPage(1);
    }
  }, [searchInput, categories]);

  useEffect(() => {
    const currentCategoryViewState = localStorage.getItem("categoryViewState");
    if (currentCategoryViewState === null) {
      setCategoryViewState("card");
    } else {
      setCategoryViewState(
        currentCategoryViewState as typeof categoryViewState,
      );
    }
  }, []);

  useEffect(() => {
    if (categoryViewState) {
      localStorage.setItem("categoryViewState", categoryViewState);
    }
  }, [categoryViewState]);

  const formattedCategories: CategoryColumn[] = useMemo(() => {
    return filteredCategories.map(
     (category) => ({
       slug: category.slug,
       name: category.name,
       billboardId: category.billboardId,
       billboardName: category.billboard.name,
       createdAt: format(category.createdAt, "h:mm MMMM do, yyyy"),
       updatedAt: format(category.updatedAt, "h:mm MMMM do, yyyy"),
     }),
   );
  }, [filteredCategories])

  const handleCardViewClick = useCallback(() => {
    setCategoryViewState("card");
  }, []);

  const handleDatatableViewClick = useCallback(() => {
    setCategoryViewState("datatable");
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title={
            categories.length <= 1
              ? `Category (${categories.length})`
              : `Categories (${categories.length})`
          }
          description="Manage your categories for your store"
        />
        <div className="flex gap-x-4">
          <ActionTooltip tooltip="Switch to image view">
            <Button
              onClick={handleCardViewClick}
              variant={`ghost`}
              size={`icon`}
              className={cn(
                "flex items-center justify-center",
                categoryViewState === "card" && "bg-black/15",
              )}
            >
              <Image className="h-1/2 w-1/2" />
            </Button>
          </ActionTooltip>
          <ActionTooltip tooltip="Switch to datatable view">
            <Button
              onClick={handleDatatableViewClick}
              variant={`ghost`}
              size={`icon`}
              className={cn(
                "flex items-center justify-center",
                categoryViewState === "datatable" && "bg-black/15",
              )}
            >
              <Table className="h-1/2 w-1/2" />
            </Button>
          </ActionTooltip>
          <Button
            onClick={() => router.push(`/${params.storeSlug}/categories/new`)}
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
            placeholder="Search category by name..."
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
      {categoryViewState === "datatable" && (
        <DataTable columns={columns} data={formattedCategories} />
      )}
      {categoryViewState === "card" && (
        <>
          {filteredCategories.length === 0 ? (
            <div>
              <p>No categories found.</p>
            </div>
          ) : (
            <>
              <div className="grid min-h-72 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentCategories.map((category) => (
                  <CategoryCard category={category} key={category.id} />
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
                      Math.ceil(filteredCategories.length / itemsPerPage),
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
                    Math.ceil(filteredCategories.length / itemsPerPage)
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
      <Header title="API" description="API calls for Categories" />
      <APIList name="categories" id="category-slug" />
    </>
  );
};

export default CategoryClient;
