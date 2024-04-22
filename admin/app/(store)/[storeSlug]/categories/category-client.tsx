"use client";

import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
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

type Props = {
  categories: CategoryWithBillboard[];
};

const CategoryClient = ({ categories }: Props) => {
  const router = useRouter();
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { viewState, handleCardViewClick, handleDatatableViewClick } =
    useDefaultView("categoryView", "card");
  const { setSearchInput, filteredItems: filteredCategories } = useFilter(
    categories,
    "name",
  );

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

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
            <div>
              <p>No categories found.</p>
            </div>
          ) : (
            <>
              <div className="grid min-h-72 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentCategories.map((category) => (
                  <GeneralCard
                    title={category.name}
                    imageUrl={category.billboard.image}
                    onClick={() =>
                      router.push(
                        `/${params.storeSlug}/categories/${category.slug}`,
                      )
                    }
                    editButtonPath={`/${params.storeSlug}/categories/${category.slug}/edit`}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
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
