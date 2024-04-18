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
import { DataTable } from "@/components/datatable";
import APIList from "@/components/api-list";
import { useParams, useRouter } from "next/navigation";

type Props = {
  sizes: Size[];
};

const SizeClient = ({ sizes }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredSizes, setFilteredSizes] = useState(sizes);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredSizes(sizes); // Show all sizes if search is empty
    } else {
      const lowerCaseSearch = searchInput.toLowerCase();
      const filtered = sizes.filter((size) =>
        size.name.toLowerCase().includes(lowerCaseSearch),
      );
      setFilteredSizes(filtered);
    }
  }, [searchInput, sizes]);

  const formattedSizes: SizeColumn[] = filteredSizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, "h:mm MMMM do, yyyy"),
    updatedAt: format(size.updatedAt, "h:mm MMMM do, yyyy"),
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title={
            sizes.length === 1
              ? `Size (${sizes.length})`
              : `Sizes (${sizes.length})`
          }
          description="Manage your sizes for your store"
        />
        <div className="flex gap-x-4">
          <Button onClick={() => router.push(`/${params.storeSlug}/sizes/new`)}>
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
