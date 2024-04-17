import React from "react";
import BillboardClient from "./billboard-client";
import { getCurrentStaff } from "@/lib/get-store-staffs";
import { canManageBillboard } from "@/lib/permission-hierarchy";
import NotPermitted from "@/components/not-permitted";

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

  const isAuthorized = canManageBillboard(staff);

  if (!isAuthorized) {
    return <NotPermitted />;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient />
      </div>
    </div>
  );
};

export default Billboards;
