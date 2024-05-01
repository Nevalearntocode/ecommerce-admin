import { getSizeById } from "@/data/get-sizes";
import React from "react";
import SizeForm from "./size-form";
import { getCurrentStaff } from "@/data/get-staffs";
import { canManageProduct, isOwner } from "@/permissions/permission-hierarchy";
import NotPermitted from "@/components/mainpages/not-permitted";
import { redirect } from "next/navigation";

type Props = {
  params: {
    sizeId: string;
    storeSlug: string;
  };
};

const SizePage = async ({ params }: Props) => {
  const size = await getSizeById(params.sizeId);
  const staff = await getCurrentStaff(params.storeSlug);

  if (!staff) {
    return redirect(`/${params.storeSlug}`);
  }
  const isAuthorized =
    canManageProduct(staff) || isOwner(staff.userId, staff.store.userId);

  if (!isAuthorized) {
    return <NotPermitted />;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm size={size} />
      </div>
    </div>
  );
};

export default SizePage;
