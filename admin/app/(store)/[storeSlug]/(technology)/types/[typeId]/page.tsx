import { getTypeById } from "@/lib/get-types";
import React from "react";
import TypeForm from "./type-form";
import { getCurrentStaff } from "@/lib/get-staffs";

type Props = {
  params: {
    typeId: string;
    storeSlug: string;
  };
};

const TypePage = async ({ params }: Props) => {
  const type = await getTypeById(params.typeId);
  const staff = await getCurrentStaff(params.storeSlug);

  if (!staff) {
    return null;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TypeForm type={type} />
      </div>
    </div>
  );
};

export default TypePage;