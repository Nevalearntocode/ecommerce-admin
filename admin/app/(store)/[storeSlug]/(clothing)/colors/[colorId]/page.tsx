import { getColorById } from "@/data/get-colors";
import React from "react";
import ColorForm from "./color-form";
import { getCurrentStaff } from "@/data/get-staffs";
import { canManageProduct, isOwner } from "@/permissions/permission-hierarchy";
import NotPermitted from "@/components/mainpages/not-permitted";

type Props = {
  params: {
    colorId: string;
    storeSlug: string;
  };
};

const ColorPage = async ({ params }: Props) => {
  const color = await getColorById(params.colorId);
  const staff = await getCurrentStaff(params.storeSlug);

  if (!staff) {
    return null;
  }
  const isAuthorized =
    canManageProduct(staff) || isOwner(staff.userId, staff.store.userId);

  if (!isAuthorized) {
    return <NotPermitted />;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm color={color} />
      </div>
    </div>
  );
};

export default ColorPage;
