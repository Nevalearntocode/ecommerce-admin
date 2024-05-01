import { getBillboardById } from "@/data/get-billboards";
import React from "react";
import BillboardForm from "./billboard-form";

type Props = {
  params: {
    billboardId: string;
    storeSlug: string;
  };
};

const BillboardPage = async ({ params }: Props) => {
  const billboard = await getBillboardById(params.billboardId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm billboard={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
