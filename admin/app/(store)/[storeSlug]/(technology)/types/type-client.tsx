"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Type } from "@prisma/client";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TypeColumn, columns } from "./type-column";
import { format } from "date-fns";
import { DataTable } from "@/components/clients/datatable";
import APIList from "@/components/apis/api-list";
import { useParams, useRouter } from "next/navigation";
import useFilter from "@/hooks/use-filter";
import HeaderWithActions from "@/components/clients/header-with-actions";

type Props = {
  types: Type[];
};

const TypeClient = ({ types }: Props) => {
  const router = useRouter();
  const params = useParams();

  const { setSearchInput, filteredItems: filteredTypes } = useFilter(
    types,
    "name",
  );

  const formattedTypes: TypeColumn[] = filteredTypes.map((type) => ({
    id: type.id,
    name: type.name,
    value: type.value,
    createdAt: format(type.createdAt, "h:mm MMMM do, yyyy"),
    updatedAt: format(type.updatedAt, "h:mm MMMM do, yyyy"),
  }));

  return (
    <>
      <HeaderWithActions
        title={
          types.length <= 1
            ? `Type (${types.length})`
            : `Types (${types.length})`
        }
        description="Manage types for your store"
        actions={[
          {
            label: "Add new",
            icon: <Plus className="mr-2 h-4 w-4" />,
            onClick: () => router.push(`/${params.storeSlug}/types/new`),
          },
        ]}
      />
      <Separator />
      {/* Search */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="relative">
          <Input
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search type by name..."
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
      <DataTable columns={columns} data={formattedTypes} />
      <Header title="API" description="API calls for Types" />
      <APIList name="types" id="type-id" />
    </>
  );
};

export default TypeClient;
