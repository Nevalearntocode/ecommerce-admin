import { getColorById } from "@/lib/get-colors";
import React from "react";
import ColorForm from "./color-form";
import { getCurrentStaff } from "@/lib/get-staffs";

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

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm color={color} />
      </div>
    </div>
  );
};

export default ColorPage;
