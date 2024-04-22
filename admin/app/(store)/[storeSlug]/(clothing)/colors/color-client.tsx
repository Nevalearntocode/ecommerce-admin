"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Color } from "@prisma/client";
import { Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ColorColumn, columns } from "./color-column";
import { format } from "date-fns";
import { DataTable } from "@/components/clients/datatable";
import APIList from "@/components/apis/api-list";
import { useParams, useRouter } from "next/navigation";
import useFilter from "@/hooks/use-filter";
import HeaderWithActions from "@/components/clients/header-with-actions";

type Props = {
  colors: Color[];
};

const ColorClient = ({ colors }: Props) => {
  const router = useRouter();
  const params = useParams();

  const { setSearchInput, filteredItems: filteredColors } = useFilter(
    colors,
    "name",
  );

  const formattedColors: ColorColumn[] = filteredColors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, "h:mm MMMM do, yyyy"),
    updatedAt: format(color.updatedAt, "h:mm MMMM do, yyyy"),
  }));

  return (
    <>
      <HeaderWithActions
        title={
          colors.length <= 1
            ? `Color (${colors.length})`
            : `Colors (${colors.length})`
        }
        description="Manage colors for your store"
        actions={[
          {
            label: "Add new",
            icon: <Plus className="mr-2 h-4 w-4" />,
            onClick: () => router.push(`/${params.storeSlug}/colors/new`),
          },
        ]}
      />
      <Separator />
      {/* Search */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="relative">
          <Input
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search color by name..."
          />
          <Button
            className="absolute right-0 top-0 rounded-full"
            variant={`ghost`}
            color={`icon`}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={formattedColors} />
      <Header title="API" description="API calls for Colors" />
      <APIList name="colors" id="color-id" />
    </>
  );
};

export default ColorClient;
