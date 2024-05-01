import React from "react";
import TypeClient from "./type-client";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Empty from "@/components/mainpages/empty";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Types = async ({ params }: Props) => {
  const store = await db.store.findUnique({
    where: {
      slug: params.storeSlug,
    },
    include: {
      types: {
        orderBy: {
          value: "asc",
        },
      },
    },
  });

  if (!store) {
    return <Empty label="You don't have any store with given link." />;
  }

  if (store.storeType !== "TECHNOLOGY") {
    return redirect(`/${params.storeSlug}`);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TypeClient types={store.types} />
      </div>
    </div>
  );
};

export default Types;
