import React from "react";
import BillboardClient from "./billboard-client";
import { db } from "@/lib/db";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Billboards = async ({ params }: Props) => {
  const billboards = await db.billboard.findMany({
    where: {
      store: {
        slug: params.storeSlug,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient billboards={billboards} />
      </div>
    </div>
  );
};

export default Billboards;
