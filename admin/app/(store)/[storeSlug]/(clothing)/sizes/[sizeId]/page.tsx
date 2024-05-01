import { getSizeById } from "@/data/get-sizes";
import React from "react";
import SizeForm from "./size-form";
type Props = {
  params: {
    sizeId: string;
    storeSlug: string;
  };
};

const SizePage = async ({ params }: Props) => {
  const size = await getSizeById(params.sizeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm size={size} />
      </div>
    </div>
  );
};

export default SizePage;
