import Empty from "@/components/empty";
import { getStoreBySlugWithStaff } from "@/lib/get-user-stores";
import React from "react";
import SettingsForm from "./settings-form";
import getCurrentUser from "@/lib/get-current-user";
import { redirect } from "next/navigation";
import NotPermitted from "@/components/not-permitted";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Settings = async ({ params }: Props) => {
  const user = await getCurrentUser();

  if (!user) {
    return redirect(`/`);
  }

  const store = await getStoreBySlugWithStaff(params.storeSlug, user.id);

  if (!store) {
    return <Empty label="You don't have any store with given link." />;
  }

  const staff = store.staffs[0];
  const isOwner = store.userId === user.id;

  if (!staff.canManageStore && !staff.isAdmin && store.userId !== user.id) {
    return <NotPermitted />;
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm store={store} isOwner={isOwner} />
      </div>
    </div>
  );
};

export default Settings;
