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
import { DataTable } from "@/components/datatable";
import APIList from "@/components/api-list";
import { useParams, useRouter } from "next/navigation";

type Props = {
  colors: Color[];
};

const ColorClient = ({ colors }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredColors, setFilteredColors] = useState(colors);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredColors(colors); // Show all colors if search is empty
    } else {
      const lowerCaseSearch = searchInput.toLowerCase();
      const filtered = colors.filter((color) =>
        color.name.toLowerCase().includes(lowerCaseSearch),
      );
      setFilteredColors(filtered);
    }
  }, [searchInput, colors]);

  const formattedColors: ColorColumn[] = filteredColors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, "h:mm MMMM do, yyyy"),
    updatedAt: format(color.updatedAt, "h:mm MMMM do, yyyy"),
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title={
            colors.length <= 1
              ? `Color (${colors.length})`
              : `Colors (${colors.length})`
          }
          description="Manage your colors for your store"
        />
        <div className="flex gap-x-4">
          <Button
            onClick={() => router.push(`/${params.storeSlug}/colors/new`)}
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
