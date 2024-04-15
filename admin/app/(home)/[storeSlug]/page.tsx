import { getUserStoreBySlug } from "@/lib/get-user-stores";
import React from "react";
import Empty from "../../../components/empty";

type Props = {
  params: {
    storeSlug: string;
  };
};

const StorePage = async ({ params }: Props) => {
  const store = await getUserStoreBySlug(params.storeSlug);

  if (!store) {
    return (
      <Empty
        label={`You don't have any store with slug: ${decodeURIComponent(params.storeSlug)}`}
      />
    );
  }

  return <div>{store.name}</div>;
};

export default StorePage;
