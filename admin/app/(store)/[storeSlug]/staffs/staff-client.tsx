"use client";

import AddStaff from "@/app/(store)/[storeSlug]/staffs/add-staff";
import Header from "@/components/header";

import { Separator } from "@/components/ui/separator";
import StaffCard from "./staff-card";
import SearchStaff from "./search-staff";
import { useSearchParams } from "next/navigation";
import { getHighestRole } from "@/lib/utils";
import { isOwner } from "@/permissions/permission-hierarchy";
import { useStoreContext } from "@/contexts/store-context";

type Props = {};

const StaffClient = ({}: Props) => {
  const { staffs, userId } = useStoreContext().store;

  staffs.sort((a, b) => {
    if (isOwner(a.userId, userId)) {
      return -1;
    }

    if (isOwner(b.userId, userId)) {
      return 1;
    }

    if (a.isAdmin) {
      return -1;
    }

    if (b.isAdmin) {
      return 1;
    }

    if (a.canManageStore) {
      return -1;
    }

    if (b.canManageStore) {
      return 1;
    }

    if (a.canManageCategory) {
      return -1;
    }

    if (b.canManageCategory) {
      return 1;
    }

    if (a.canManageBillboard) {
      return -1;
    }

    if (b.canManageBillboard) {
      return 1;
    }

    if (a.canManageProduct) {
      return -1;
    }

    if (b.canManageProduct) {
      return 1;
    }

    return 0;
  });

  const { id } = useStoreContext().user;
  const currentStaff = staffs.find((staff) => staff.userId === id);
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const role = searchParams.get("role");

  if (!currentStaff) {
    return null;
  }

  const filteredStaffs = staffs.filter((staff) => {
    if (name && role) {
      return (
        staff.user.name === name &&
        (isOwner(staff.userId, userId)
          ? "Owner"
          : getHighestRole(staff).toLowerCase() === role.toLowerCase())
      );
    }

    if (name && !role) {
      return staff.user.name === name;
    }

    if (role && !name) {
      return isOwner(staff.userId, userId)
        ? "Owner"
        : getHighestRole(staff).toLowerCase() === role.toLowerCase();
    }

    return true;
  });

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Header
          title={`${staffs.length <= 1 ? `Staff (${staffs.length})` : `Staffs (${staffs.length})`}`}
          description="Manage employees for your store."
        />
        <AddStaff isAdmin={currentStaff.isAdmin} />
      </div>
      <Separator className="mt-4" />
      <SearchStaff staffs={staffs} storeUserId={userId} />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredStaffs.map((staff) => (
          <StaffCard key={staff.id} staff={staff} currentStaff={currentStaff} />
        ))}
      </div>
    </>
  );
};

export default StaffClient;
