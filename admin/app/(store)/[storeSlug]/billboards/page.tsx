import React from "react";
import BillboardClient from "./billboard-client";
import { getCurrentStaff } from "@/lib/get-store-staffs";
import { canManageBillboard } from "@/lib/permission-hierarchy";
import NotPermitted from "@/components/not-permitted";
import { db } from "@/lib/db";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Billboards = async ({ params }: Props) => {
  const staff = await getCurrentStaff(params.storeSlug);
  if (!staff) {
    return null;
  }
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

  const isAuthorized = canManageBillboard(staff);

  if (!isAuthorized) {
    return <NotPermitted />;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient billboards={billboards} />
      </div>
    </div>
  );
};

export default Billboards;
