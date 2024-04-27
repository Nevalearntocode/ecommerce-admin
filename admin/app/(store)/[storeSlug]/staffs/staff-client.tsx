import AddStaff from "@/app/(root)/_components/add-staff";
import Header from "@/components/header";

import { Separator } from "@/components/ui/separator";
import { StaffWithStore, StaffWithUser } from "@/types";
import React from "react";
import StaffCard from "./staff-card";

type Props = {
  staffs: StaffWithUser[];
  currentStaff: StaffWithStore;
};

const StaffClient = ({ staffs, currentStaff }: Props) => {
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {staffs.map((staff) => (
          <StaffCard
            key={staff.id}
            staff={staff}
            currentStaff={currentStaff}
          />
        ))}
      </div>
    </>
  );
};

export default StaffClient;
