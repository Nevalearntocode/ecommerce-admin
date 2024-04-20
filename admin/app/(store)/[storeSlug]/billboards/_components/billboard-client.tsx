"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Image, Plus, Search, Table } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import BillboardCard from "./billboard-card";
import ActionTooltip from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { BillboardColumn, columns } from "./billboard-column";
import { format } from "date-fns";
import { DataTable } from "@/components/datatable";
import APIList from "@/components/api-list";

type Props = {
  billboards: Billboard[];
};

const BillboardClient = ({ billboards }: Props) => {
  const [billboardViewState, setBillboardViewState] = useState<
    "datatable" | "card" | null
  >(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredBillboards, setFilteredBillboards] = useState(billboards);
  const router = useRouter();
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredBillboards(billboards); // Show all billboards if search is empty
    } else {
      const lowerCaseSearch = searchInput.toLowerCase();
      const filtered = billboards.filter((billboard) =>
        billboard.name.toLowerCase().includes(lowerCaseSearch),
      );
      setFilteredBillboards(filtered);
      setCurrentPage(1);
    }
  }, [searchInput, billboards]);

  useEffect(() => {
    const currentBillboardViewState =
      localStorage.getItem("billboardViewState");
    if (currentBillboardViewState === null) {
      setBillboardViewState("card");
    } else {
      setBillboardViewState(
        currentBillboardViewState as typeof billboardViewState,
      );
    }
  }, []);

  useEffect(() => {
    if (billboardViewState) {
      localStorage.setItem("billboardViewState", billboardViewState);
    }
  }, [billboardViewState]);

  const formattedBillboards: BillboardColumn[] = filteredBillboards.map(
    (billboard) => ({
      id: billboard.id,
      name: billboard.name,
      createdAt: format(billboard.createdAt, "h:mm MMMM do, yyyy"),
      updatedAt: format(billboard.updatedAt, "h:mm MMMM do, yyyy"),
    }),
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBillboards = filteredBillboards.slice(startIndex, endIndex);

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title={
            billboards.length === 1
              ? `Billboard (${billboards.length})`
              : `Billboards (${billboards.length})`
          }
          description="Manage your billboards for your store"
        />
        <div className="flex gap-x-4">
          <ActionTooltip tooltip="Switch to image view">
            <Button
              onClick={() => setBillboardViewState("card")}
              variant={`ghost`}
              size={`icon`}
              className={cn(
                "flex items-center justify-center",
                billboardViewState === "card" && "bg-black/15",
              )}
            >
              <Image className="h-1/2 w-1/2" />
            </Button>
          </ActionTooltip>
          <ActionTooltip tooltip="Switch to datatable view">
            <Button
              onClick={() => setBillboardViewState("datatable")}
              variant={`ghost`}
              size={`icon`}
              className={cn(
                "flex items-center justify-center",
                billboardViewState === "datatable" && "bg-black/15",
              )}
            >
              <Table className="h-1/2 w-1/2" />
            </Button>
          </ActionTooltip>
          <Button
            onClick={() => router.push(`/${params.storeSlug}/billboards/new`)}
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
            placeholder="Search billboard by name..."
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
      {billboardViewState === "datatable" && (
        <DataTable columns={columns} data={formattedBillboards} />
      )}
      {billboardViewState === "card" && (
        <>
          {filteredBillboards.length === 0 ? (
            <div>
              <p>No billboards found.</p>
            </div>
          ) : (
            <>
              <div className="grid min-h-72 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentBillboards.map((billboard) => (
                  <BillboardCard billboard={billboard} key={billboard.id} />
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
                      Math.ceil(filteredBillboards.length / itemsPerPage),
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
                    Math.ceil(filteredBillboards.length / itemsPerPage)
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
      <Header title="API" description="API calls for Billboards" />
      <APIList name="billboards" id="billboard-id" />
    </>
  );
};

export default BillboardClient;
