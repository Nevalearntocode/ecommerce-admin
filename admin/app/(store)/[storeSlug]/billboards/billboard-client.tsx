"use client";

import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
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

type Props = {
  billboards: Billboard[];
};

const BillboardClient = ({ billboards }: Props) => {
  const { viewState, handleCardViewClick, handleDatatableViewClick } =
    useDefaultView("billboardView", "card");
  const { setSearchInput, filteredItems: filteredBillboards } = useFilter(
    billboards,
    "name",
  );
  const router = useRouter();
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

const formattedBillboards: BillboardColumn[] = useMemo(() => {
  return filteredBillboards.map((billboard) => ({
    id: billboard.id,
    name: billboard.name,
    createdAt: format(billboard.createdAt, "h:mm MMMM do, yyyy"),
    updatedAt: format(billboard.updatedAt, "h:mm MMMM do, yyyy"),
  }));
}, [filteredBillboards]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBillboards = filteredBillboards.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredBillboards.length / itemsPerPage);

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
            <div>
              <p>No billboards found.</p>
            </div>
          ) : (
            <>
              <div className="grid min-h-72 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentBillboards.map((billboard) => (
                  <GeneralCard
                    title={billboard.name}
                    imageUrl={billboard.image}
                    onClick={() =>
                      router.push(
                        `/${params.storeSlug}/billboards/${billboard.id}`,
                      )
                    }
                    editButtonPath={`/${params.storeSlug}/billboards/${billboard.id}/edit`}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
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
