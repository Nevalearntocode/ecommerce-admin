import NotPermitted from "@/components/mainpages/not-permitted";
import { getCurrentStaffWithStore, getStaffs } from "@/data/get-staffs";
import { canManageProduct, isOwner } from "@/permissions/permission-hierarchy";
import React from "react";
import StaffClient from "./staff-client";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Staffs = async ({ params }: Props) => {
  const currentStaff = await getCurrentStaffWithStore(params.storeSlug);

  if (!currentStaff) {
    return (
      <div className="flex h-full w-full flex-col items-center gap-y-4 pt-44">
        <h1 className="text-3xl font-bold">Not Found</h1>
        <p className="text-xl italic">
          The store you are looking for does not exist, or you do not have the
          permission to view it.
        </p>
      </div>
    );
  }

  if (
    !canManageProduct(currentStaff) &&
    !isOwner(currentStaff.userId, currentStaff.store.userId)
  ) {
    return <NotPermitted />;
  }

  const staffs = await getStaffs(currentStaff.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <StaffClient staffs={staffs} currentStaff={currentStaff} />
      </div>
    </div>
  );
};

export default Staffs;
