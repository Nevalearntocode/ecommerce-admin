"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Image, Plus, Table } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import BillboardCard from "./billboard-card";
import ActionTooltip from "@/components/action-tooltip";
import { cn } from "@/lib/utils";

type Props = {
  billboards: Billboard[];
};

const BillboardClient = ({ billboards }: Props) => {
  const [viewState, setViewState] = useState<"datatable" | "card">("card");
  const router = useRouter();
  const params = useParams();

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
      {viewState === "card" && (
        <div className="grid min-h-72 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {billboards.map((billboard) => (
            <BillboardCard billboard={billboard} key={billboard.id} />
          ))}
        </div>
      )}
    </>
  );
};

export default BillboardClient;
