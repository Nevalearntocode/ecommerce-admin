"use client";

import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Model } from "@prisma/client";
import { Plus } from "lucide-react";
import { ModelColumn, columns } from "./model-column";
import { format } from "date-fns";
import { DataTable } from "@/components/clients/datatable";
import APIList from "@/components/apis/api-list";
import { useParams, useRouter } from "next/navigation";
import useFilter from "@/hooks/use-filter";
import HeaderWithActions from "@/components/clients/header-with-actions";
import SearchInput from "@/components/clients/search";
import { useMemo } from "react";

type Props = {
  models: Model[];
};

const ModelClient = ({ models }: Props) => {
  const router = useRouter();
  const params = useParams();

  const { setSearchInput, filteredItems: filteredModels } = useFilter(
    models,
    "name",
  );

  const formattedModels: ModelColumn[] = useMemo(() => {
    return filteredModels.map((model) => ({
      id: model.id,
      name: model.name,
      value: model.value,
      createdAt: format(model.createdAt, "h:mm MMMM do, yyyy"),
      updatedAt: format(model.updatedAt, "h:mm MMMM do, yyyy"),
    }));
  }, [filteredModels]);

  return (
    <>
      <HeaderWithActions
        title={
          models.length <= 1
            ? `Model (${models.length})`
            : `Models (${models.length})`
        }
        description="Manage models for your store"
        actions={[
          {
            label: "Add new",
            icon: <Plus className="mr-2 h-4 w-4" />,
            onClick: () => router.push(`/${params.storeSlug}/models/new`),
          },
        ]}
      />
      <Separator />
      {/* Search */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SearchInput onChange={setSearchInput} component="model" />
      </div>
      <DataTable columns={columns} data={formattedModels} />
      <Header title="API" description="API calls for Models" />
      <APIList name="models" id="model-id" />
    </>
  );
};

export default ModelClient;
