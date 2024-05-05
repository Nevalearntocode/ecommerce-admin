"use client";

import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { BillboardColumn, columns } from "./billboard-column";
import { format } from "date-fns";
import { DataTable } from "@/components/clients/datatable";
import APIList from "@/components/apis/api-list";
import useFilter from "@/hooks/use-filter";
import Pagination from "@/components/clients/pagination";
import useDefaultView from "@/hooks/use-default-view";
import HeaderWithActions from "@/components/clients/header-with-actions";
import SearchInput from "@/components/clients/search";
import GeneralCard from "@/components/clients/general-card";
import usePagination from "@/hooks/use-pagination";
import NoResults from "@/components/clients/no-results";
import { useStoreContext } from "@/contexts/store-context";

const BillboardClient = () => {
  const { billboards } = useStoreContext().store;
  const { viewState, handleCardViewClick, handleDatatableViewClick } =
    useDefaultView("billboardView", "card");
  const { setSearchInput, filteredItems: filteredBillboards } = useFilter(
    billboards,
    "name",
  );
  const { currentItems, currentPage, handlePageChange, totalPages } =
    usePagination(filteredBillboards);

  const router = useRouter();
  const params = useParams();

  const formattedBillboards: BillboardColumn[] = useMemo(() => {
    return filteredBillboards.map((billboard) => ({
      id: billboard.id,
      name: billboard.name,
      createdAt: format(billboard.createdAt, "h:mm MMMM do, yyyy"),
      updatedAt: format(billboard.updatedAt, "h:mm MMMM do, yyyy"),
    }));
  }, [filteredBillboards]);

  return (
    <>
      <HeaderWithActions
        title={
          billboards.length <= 1
            ? `Billboard (${billboards.length})`
            : `Billboards (${billboards.length})`
        }
        description="Manage your billboards for your store"
        actions={[
          {
            label: "Add new",
            icon: <Plus className="mr-2 h-4 w-4" />,
            onClick: () => router.push(`/${params.storeSlug}/billboards/new`),
          },
        ]}
        viewState={viewState}
        onCardView={handleCardViewClick}
        onDataView={handleDatatableViewClick}
      />
      <Separator />
      {/* Search */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SearchInput onChange={setSearchInput} component="billboard" />
      </div>
      {viewState === "datatable" && (
        <DataTable columns={columns} data={formattedBillboards} />
      )}
      {viewState === "card" && (
        <>
          {filteredBillboards.length === 0 ? (
            <NoResults label="billboards" />
          ) : (
            <>
              <div className="grid min-h-72 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentItems.map((billboard) => (
                  <GeneralCard
                    key={billboard.id}
                    title={billboard.name}
                    imageUrl={billboard.image}
                    path={`/${params.storeSlug}/billboards/${billboard.id}`}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                onPageChange={handlePageChange}
                totalPages={totalPages}
              />
            </>
          )}
        </>
      )}
      <Header title="API" description="API calls for Billboards" />
      <APIList name="billboards" id="billboard-id" />
    </>
  );
};

export default BillboardClient;
