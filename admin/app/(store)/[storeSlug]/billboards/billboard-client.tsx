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

type Props = {
  billboards: Billboard[];
};

const BillboardClient = ({ billboards }: Props) => {
  const [viewState, setViewState] = useState<"datatable" | "card" | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredBillboards, setFilteredBillboards] = useState(billboards);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredBillboards(billboards); // Show all billboards if search is empty
    } else {
      const lowerCaseSearch = searchInput.toLowerCase();
      const filtered = billboards.filter((billboard) =>
        billboard.name.toLowerCase().includes(lowerCaseSearch),
      );
      setFilteredBillboards(filtered);
    }
  }, [searchInput, billboards]);

  useEffect(() => {
    const currentViewState = localStorage.getItem("viewState");
    if (currentViewState === null) {
      setViewState("card");
    } else {
      setViewState(currentViewState as typeof viewState);
    }
  }, []);

  useEffect(() => {
    if (viewState) {
      localStorage.setItem("viewState", viewState);
    }
  }, [viewState]);

  const formattedBillboards: BillboardColumn[] = filteredBillboards.map(
    (billboard) => ({
      id: billboard.id,
      name: billboard.name,
      createdAt: format(billboard.createdAt, "h:mm MMMM do, yyyy"),
      updatedAt: format(billboard.updatedAt, "h:mm MMMM do, yyyy"),
    }),
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title={
            billboards.length === 1
              ? `Billboard (${billboards.length})`
              : `Billboards (${billboards.length})`
          }
          description="Manage your billboards for you store"
        />
        <div className="flex gap-x-4">
          <ActionTooltip tooltip="Switch to image view">
            <Button
              onClick={() => setViewState("card")}
              variant={`ghost`}
              size={`icon`}
              className={cn(
                "flex items-center justify-center",
                viewState === "card" && "bg-black/15",
              )}
            >
              <Image className="h-1/2 w-1/2" />
            </Button>
          </ActionTooltip>
          <ActionTooltip tooltip="Switch to datatable view">
            <Button
              onClick={() => setViewState("datatable")}
              variant={`ghost`}
              size={`icon`}
              className={cn(
                "flex items-center justify-center",
                viewState === "datatable" && "bg-black/15",
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
            <div className="grid min-h-72 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBillboards.map((billboard) => (
                <BillboardCard billboard={billboard} key={billboard.id} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default BillboardClient;
