"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Model } from "@prisma/client";
import { Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ModelColumn, columns } from "./model-column";
import { format } from "date-fns";
import { DataTable } from "@/components/datatable";
import APIList from "@/components/api-list";
import { useParams, useRouter } from "next/navigation";

type Props = {
  models: Model[];
};

const ModelClient = ({ models }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredModels, setFilteredModels] = useState(models);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredModels(models); // Show all models if search is empty
    } else {
      const lowerCaseSearch = searchInput.toLowerCase();
      const filtered = models.filter((model) =>
        model.name.toLowerCase().includes(lowerCaseSearch),
      );
      setFilteredModels(filtered);
    }
  }, [searchInput, models]);

  const formattedModels: ModelColumn[] = filteredModels.map((model) => ({
    id: model.id,
    name: model.name,
    value: model.value,
    createdAt: format(model.createdAt, "h:mm MMMM do, yyyy"),
    updatedAt: format(model.updatedAt, "h:mm MMMM do, yyyy"),
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title={
            models.length <= 1
              ? `Model (${models.length})`
              : `Models (${models.length})`
          }
          description="Manage your models for your store"
        />
        <div className="flex gap-x-4">
          <Button
            onClick={() => router.push(`/${params.storeSlug}/models/new`)}
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
            placeholder="Search model by name..."
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
      <DataTable columns={columns} data={formattedModels} />
      <Header title="API" description="API calls for Models" />
      <APIList name="models" id="model-id" />
    </>
  );
};

export default ModelClient;
