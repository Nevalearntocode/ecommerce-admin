"use client";

import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { TypeColumn, columns } from "./type-column";
import { format } from "date-fns";
import { DataTable } from "@/components/clients/datatable";
import APIList from "@/components/apis/api-list";
import { useParams, useRouter } from "next/navigation";
import useFilter from "@/hooks/use-filter";
import HeaderWithActions from "@/components/clients/header-with-actions";
import SearchInput from "@/components/clients/search";
import { useMemo } from "react";
import { useStoreContext } from "@/contexts/store-context";

type Props = {};

const TypeClient = ({}: Props) => {
  const { types } = useStoreContext().store;
  const router = useRouter();
  const params = useParams();

  const { setSearchInput, filteredItems: filteredTypes } = useFilter(
    types,
    "name",
  );

  const formattedTypes: TypeColumn[] = useMemo(() => {
    return filteredTypes.map((type) => ({
      id: type.id,
      name: type.name,
      value: type.value,
      createdAt: format(type.createdAt, "h:mm MMMM do, yyyy"),
      updatedAt: format(type.updatedAt, "h:mm MMMM do, yyyy"),
    }));
  }, [filteredTypes]);

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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SearchInput onChange={setSearchInput} component="type" />
      </div>
      <DataTable columns={columns} data={formattedTypes} />
      <Header title="API" description="API calls for Types" />
      <APIList name="types" id="type-id" />
    </>
  );
};

export default TypeClient;
