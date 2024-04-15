import Empty from "@/components/empty";
import { getUserStoreBySlug } from "@/lib/get-user-stores";
import React from "react";
import SettingsForm from "./settings-form";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Settings = async ({ params }: Props) => {
  const store = await getUserStoreBySlug(params.storeSlug);

  if (!store) {
    return <Empty label="You don't have any store with given link." />;
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-12">
        <SettingsForm store={store} />
      </div>
    </div>
  );
};

export default Settings;
