import React from "react";
import TypeClient from "./type-client";
import { getCurrentStaffAndStoreType } from "@/lib/get-staffs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Types = async ({ params }: Props) => {
  const staff = await getCurrentStaffAndStoreType(params.storeSlug);

  if (!staff) {
    return null;
  }

  if (staff.store.storeType !== "TECHNOLOGY") {
    return redirect(`/${params.storeSlug}`);
  }

  const types = await db.type.findMany({
    where: {
      Store: {
        slug: params.storeSlug,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TypeClient types={types} />
      </div>
    </div>
  );
};

export default Types;
