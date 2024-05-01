import React from "react";
import ModelClient from "./model-client";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Empty from "@/components/mainpages/empty";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Models = async ({ params }: Props) => {
  const store = await db.store.findUnique({
    where: {
      slug: params.storeSlug,
    },
    include: {
      models: {
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
        <ModelClient models={store.models} />
      </div>
    </div>
  );
};

export default Models;
