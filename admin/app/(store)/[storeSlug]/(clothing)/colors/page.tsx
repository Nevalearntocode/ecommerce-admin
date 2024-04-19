import React from "react";
import ColorClient from "./color-client";
import { getCurrentStaffAndStoreType } from "@/lib/get-staffs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Colors = async ({ params }: Props) => {
  const staff = await getCurrentStaffAndStoreType(params.storeSlug);

  if (!staff) {
    return null;
  }

  if (staff.store.storeType !== "CLOTHING") {
    return redirect(`/${params.storeSlug}`);
  }

  const colors = await db.color.findMany({
    where: {
      Store: {
        slug: params.storeSlug,
      },
    },
    orderBy: {
      value: "asc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient colors={colors} />
      </div>
    </div>
  );
};

export default Colors;
