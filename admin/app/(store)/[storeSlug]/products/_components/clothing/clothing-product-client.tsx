"use client";

import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { DataTable } from "@/components/clients/datatable";
import APIList from "@/components/apis/api-list";
import { ClothingProduct } from "@/types";
import { ClothingProductColumn, columns } from "./clothing-product-column";
import { SizeValue } from "@prisma/client";
import useFilter from "@/hooks/use-filter";
import Pagination from "@/components/clients/pagination";
import useDefaultView from "@/hooks/use-default-view";
import HeaderWithActions from "@/components/clients/header-with-actions";
import SearchInput from "@/components/clients/search";
import EntityCard from "@/components/clients/product-card";

type Props = {
  clothingProducts: ClothingProduct[];
};

const ClothingProductClient = ({ clothingProducts }: Props) => {
  const { viewState, handleCardViewClick, handleDatatableViewClick } =
    useDefaultView("clothingProductView", "card");

  const { filteredItems: filteredClothingProducts, setSearchInput } = useFilter(
    clothingProducts,
    "name",
  );

  const router = useRouter();
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const formattedClothingProducts: ClothingProductColumn[] = useMemo(() => {
    return filteredClothingProducts.map((clothingProduct) => ({
      slug: clothingProduct.slug,
      name: clothingProduct.name,
      brand: clothingProduct.brand || "",
      category: clothingProduct.category.name,
      size: clothingProduct.size?.value || SizeValue.M,
      color: clothingProduct.color?.value || "",
      price: clothingProduct.price,
      stock: clothingProduct.stock,
      createdAt: format(clothingProduct.createdAt, "mm/dd/yy"),
      updatedAt: format(clothingProduct.updatedAt, "mm/dd/yy"),
    }));
  }, [filteredClothingProducts]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClothingProducts = filteredClothingProducts.slice(
    startIndex,
    endIndex,
  );

  const totalPages = Math.ceil(filteredClothingProducts.length / itemsPerPage);

  return (
    <>
      <HeaderWithActions
        title={
          clothingProducts.length <= 1
            ? `Product (${clothingProducts.length})`
            : `Products (${clothingProducts.length})`
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
        <DataTable columns={columns} data={formattedClothingProducts} />
      )}
      {viewState === "card" && (
        <>
          {filteredClothingProducts.length === 0 ? (
            <div>
              <p>No products found.</p>
            </div>
          ) : (
            <>
              <div className="grid min-h-72 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentClothingProducts.map((clothingProduct) => (
                  <EntityCard entity={clothingProduct} type="clothingProduct" />
                ))}
              </div>
              {/* Previous Button */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
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

export default ClothingProductClient;
