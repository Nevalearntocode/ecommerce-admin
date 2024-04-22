import { getBillboardById } from "@/lib/get-billboards";
import React from "react";
import BillboardForm from "./billboard-form";
import { getCurrentStaff } from "@/lib/get-staffs";
import { canManageBillboard, isOwner } from "@/lib/permission-hierarchy";
import NotPermitted from "@/components/not-permitted";

type Props = {
  params: {
    billboardId: string;
    storeSlug: string;
  };
};

const BillboardPage = async ({ params }: Props) => {
  const billboard = await getBillboardById(params.billboardId);
  const staff = await getCurrentStaff(params.storeSlug);

  if (!staff) {
    return null;
  }

  const isAuthorized =
    canManageBillboard(staff) || isOwner(staff, staff.store.userId);

  if (!isAuthorized) {
    return <NotPermitted />;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm
          billboard={billboard}
        />
      </div>
    </div>
  );
};

export default BillboardPage;
