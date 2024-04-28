"use client";

import AddStaff from "@/app/(store)/[storeSlug]/staffs/add-staff";
import Header from "@/components/header";

import { Separator } from "@/components/ui/separator";
import { StaffWithStore, StaffWithUser } from "@/types";
import StaffCard from "./staff-card";
import SearchStaff from "./search-staff";
import { useSearchParams } from "next/navigation";
import { getHighestRole } from "@/lib/utils";
import { isOwner } from "@/permissions/permission-hierarchy";

type Props = {
  staffs: StaffWithUser[];
  currentStaff: StaffWithStore;
};

const StaffClient = ({ staffs, currentStaff }: Props) => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const role = searchParams.get("role");

  const filteredStaffs = staffs.filter((staff) => {
    if (name && role) {
      return (
        staff.user.name === name &&
        (isOwner(staff.userId, currentStaff.store.userId)
          ? "Owner"
          : getHighestRole(staff).toLowerCase() === role.toLowerCase())
      );
    }

    if (name && !role) {
      return staff.user.name === name;
    }

    if (role && !name) {
      console.log(role);
      return isOwner(staff.userId, currentStaff.store.userId)
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
        <AddStaff currentStaff={currentStaff} store={currentStaff.store} />
      </div>
      <Separator className="mt-4" />
      <SearchStaff staffs={staffs} storeUserId={currentStaff.store.userId} />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredStaffs.map((staff) => (
          <StaffCard key={staff.id} staff={staff} currentStaff={currentStaff} />
        ))}
      </div>
    </>
  );
};

export default StaffClient;
