"use client";

import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Size } from "@prisma/client";
import { Plus } from "lucide-react";
import { SizeColumn, columns } from "./size-column";
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

const SizeClient = ({}: Props) => {
  const router = useRouter();
  const params = useParams();
  const { sizes } = useStoreContext().store;

  const { filteredItems: filteredSizes, setSearchInput } = useFilter(
    sizes,
    "name",
  );

  const formattedSizes: SizeColumn[] = useMemo(() => {
    return filteredSizes.map((size) => ({
      id: size.id,
      name: size.name,
      value: size.value,
      createdAt: format(size.createdAt, "h:mm MMMM do, yyyy"),
      updatedAt: format(size.updatedAt, "h:mm MMMM do, yyyy"),
    }));
  }, [filteredSizes]);

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
        <SearchInput onChange={setSearchInput} component="size" />
      </div>
      <DataTable columns={columns} data={formattedSizes} />
      <Header title="API" description="API calls for Sizes" />
      <APIList name="sizes" id="size-id" />
    </>
  );
};

export default SizeClient;
