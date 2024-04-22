"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Size } from "@prisma/client";
import { Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SizeColumn, columns } from "./size-column";
import { format } from "date-fns";
import { DataTable } from "@/components/clients/datatable";
import APIList from "@/components/apis/api-list";
import { useParams, useRouter } from "next/navigation";
import useFilter from "@/hooks/use-filter";
import HeaderWithActions from "@/components/clients/header-with-actions";

type Props = {
  sizes: Size[];
};

const SizeClient = ({ sizes }: Props) => {
  const router = useRouter();
  const params = useParams();

  const { filteredItems: filteredSizes, setSearchInput } = useFilter(
    sizes,
    "name",
  );

  const formattedSizes: SizeColumn[] = filteredSizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, "h:mm MMMM do, yyyy"),
    updatedAt: format(size.updatedAt, "h:mm MMMM do, yyyy"),
  }));

  return (
    <>
      <HeaderWithActions
        title={
          sizes.length <= 1
            ? `Size (${sizes.length})`
            : `Sizes (${sizes.length})`
        }
        description="Manage sizes for your store"
        actions={[
          {
            label: "Add new",
            icon: <Plus className="mr-2 h-4 w-4" />,
            onClick: () => router.push(`/${params.storeSlug}/sizes/new`),
          },
        ]}
      />
      <Separator />
      {/* Search */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="relative">
          <Input
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search size by name..."
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
      <DataTable columns={columns} data={formattedSizes} />
      <Header title="API" description="API calls for Sizes" />
      <APIList name="sizes" id="size-id" />
    </>
  );
};

export default SizeClient;
