"use client";

import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { format } from "date-fns";
import { DataTable } from "@/components/clients/datatable";
import APIList from "@/components/apis/api-list";
import { TechnologyProduct } from "@/types";
import { TechnologyProductColumn, columns } from "./technology-product-column";
import useFilter from "@/hooks/use-filter";
import Pagination from "@/components/clients/pagination";
import useDefaultView from "@/hooks/use-default-view";
import HeaderWithActions from "@/components/clients/header-with-actions";
import SearchInput from "@/components/clients/search";
import EntityCard from "@/components/clients/product-card";
import usePagination from "@/hooks/use-pagination";
import NoResults from "@/components/clients/no-results";
import { formatter } from "@/lib/utils";

type Props = {
  technologyProducts: TechnologyProduct[];
};

const TechnologyProductClient = ({ technologyProducts }: Props) => {
  const router = useRouter();
  const params = useParams();
  const { handleCardViewClick, handleDatatableViewClick, viewState } =
    useDefaultView("technologyProductView", "card");
  const { filteredItems: filteredTechnologyProducts, setSearchInput } =
    useFilter(technologyProducts, "name");
  const { currentItems, currentPage, handlePageChange, totalPages } =
    usePagination(filteredTechnologyProducts);

  const formattedTechnologyProducts: TechnologyProductColumn[] = useMemo(() => {
    return filteredTechnologyProducts.map((technologyProduct) => ({
      slug: technologyProduct.slug,
      name: technologyProduct.name,
      brand: technologyProduct.brand || "",
      isFeatured: technologyProduct.isFeatured,
      isArchived: technologyProduct.isArchived,
      category: technologyProduct.category.name,
      model: technologyProduct.model?.value || "",
      type: technologyProduct.type?.value || "",
      price: formatter.format(technologyProduct.price),
      stock: technologyProduct.stock,
      createdAt: format(technologyProduct.createdAt, "dd/M/yy"),
      updatedAt: format(technologyProduct.updatedAt, "dd/M/yy"),
    }));
  }, [filteredTechnologyProducts]);

  return (
    <>
      <HeaderWithActions
        title={
          technologyProducts.length <= 1
            ? `Product (${technologyProducts.length})`
            : `Products (${technologyProducts.length})`
        }
        description="Manage products for your store"
        actions={[
          {
            label: "Add new",
            icon: <Plus className="mr-2 h-4 w-4" />,
            onClick: () => router.push(`/${params.storeSlug}/products/new`),
          },
        ]}
        viewState={viewState}
        onCardView={handleCardViewClick}
        onDataView={handleDatatableViewClick}
      />
      <Separator />
      {/* Search */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SearchInput onChange={setSearchInput} component="product" />
      </div>
      {viewState === "datatable" && (
        <DataTable columns={columns} data={formattedTechnologyProducts} />
      )}
      {viewState === "card" && (
        <>
          {filteredTechnologyProducts.length === 0 ? (
            <NoResults label="products" />
          ) : (
            <>
              <div className="grid min-h-72 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentItems.map((technologyProduct) => (
                  <EntityCard
                    key={technologyProduct.id}
                    entity={technologyProduct}
                    type="technologyProduct"
                  />
                ))}
              </div>
              {/* Previous Button */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
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
