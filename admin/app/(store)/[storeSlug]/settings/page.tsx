import Empty from "@/components/mainpages/empty";
import { getStoreWithCurrentStaff } from "@/data/get-stores";
import React from "react";
import SettingsForm from "./settings-form";
import getCurrentUser from "@/data/get-current-user";
import { redirect } from "next/navigation";
import NotPermitted from "@/components/mainpages/not-permitted";
import { canManageStore, isOwner } from "@/permissions/permission-hierarchy";
import { getCurrentStaff } from "@/data/get-staffs";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Settings = async ({ params }: Props) => {
  const staff = await getCurrentStaff(params.storeSlug);

  if (!staff) {
    return redirect(`/`);
  }

  if (!canManageStore(staff) && !isOwner(staff.userId, staff.store.userId)) {
    return <NotPermitted />;
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm store={staff.store} isOwner={isOwner(staff.userId, staff.store.userId)} />
      </div>
    </div>
  );
};

export default Settings;
