import { getSizeById } from "@/lib/get-sizes";
import React from "react";
import SizeForm from "./size-form";
import { getCurrentStaff } from "@/lib/get-staffs";
import { canManageProduct } from "@/lib/permission-hierarchy";
import NotPermitted from "@/components/not-permitted";

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
    return null;
  }
  const isAuthorized = canManageProduct(staff);

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
