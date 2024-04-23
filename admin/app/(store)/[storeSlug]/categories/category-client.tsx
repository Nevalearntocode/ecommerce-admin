"use client";

import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { CategoryColumn, columns } from "./category-column";
import { format } from "date-fns";
import { DataTable } from "@/components/clients/datatable";
import APIList from "@/components/apis/api-list";
import { CategoryWithBillboard } from "@/types";
import useFilter from "@/hooks/use-filter";
import Pagination from "@/components/clients/pagination";
import useDefaultView from "@/hooks/use-default-view";
import HeaderWithActions from "@/components/clients/header-with-actions";
import SearchInput from "@/components/clients/search";
import GeneralCard from "@/components/clients/general-card";
import usePagination from "@/hooks/use-pagination";
import NoResults from "@/components/clients/no-results";

type Props = {
  categories: CategoryWithBillboard[];
};

const CategoryClient = ({ categories }: Props) => {
  const { viewState, handleCardViewClick, handleDatatableViewClick } =
    useDefaultView("categoryView", "card");
  const { setSearchInput, filteredItems: filteredCategories } = useFilter(
    categories,
    "name",
  );
  const { currentItems, currentPage, handlePageChange, totalPages } =
    usePagination(filteredCategories);
  const router = useRouter();
  const params = useParams();

  const formattedCategories: CategoryColumn[] = useMemo(() => {
    return filteredCategories.map((category) => ({
      slug: category.slug,
      name: category.name,
      billboardId: category.billboardId,
      billboardName: category.billboard.name,
      createdAt: format(category.createdAt, "h:mm MMMM do, yyyy"),
      updatedAt: format(category.updatedAt, "h:mm MMMM do, yyyy"),
    }));
  }, [filteredCategories]);

  return (
    <>
      <HeaderWithActions
        title={
          categories.length <= 1
            ? `Category (${categories.length})`
            : `Categories (${categories.length})`
        }
        description="Manage your categories for your store"
        actions={[
          {
            label: "Add new",
            icon: <Plus className="mr-2 h-4 w-4" />,
            onClick: () => router.push(`/${params.storeSlug}/categories/new`),
          },
        ]}
        viewState={viewState}
        onCardView={handleCardViewClick}
        onDataView={handleDatatableViewClick}
      />
      <Separator />
      {/* Search */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SearchInput onChange={setSearchInput} component="category" />
      </div>
      {viewState === "datatable" && (
        <DataTable columns={columns} data={formattedCategories} />
      )}
      {viewState === "card" && (
        <>
          {filteredCategories.length === 0 ? (
            <NoResults label="categories" />
          ) : (
            <>
              <div className="grid min-h-72 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentItems.map((category) => (
                  <GeneralCard
                    key={category.id}
                    title={category.name}
                    imageUrl={category.billboard.image}
                    path={`/${params.storeSlug}/categories/${category.slug}`}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
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
