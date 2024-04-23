import { getModelById } from "@/lib/get-models";
import React from "react";
import ModelForm from "./model-form";
import { getCurrentStaff } from "@/lib/get-staffs";
import { canManageProduct, isOwner } from "@/lib/permission-hierarchy";
import NotPermitted from "@/components/mainpages/not-permitted";

type Props = {
  params: {
    modelId: string;
    storeSlug: string;
  };
};

const ModelPage = async ({ params }: Props) => {
  const model = await getModelById(params.modelId);
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
        <ModelForm model={model} />
      </div>
    </div>
  );
};

export default ModelPage;
