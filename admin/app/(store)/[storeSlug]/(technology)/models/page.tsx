import React from "react";
import ModelClient from "./model-client";
import { getCurrentStaffAndStoreType } from "@/data/get-staffs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { canManageProduct, isOwner } from "@/permissions/permission-hierarchy";
import NotPermitted from "@/components/mainpages/not-permitted";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Models = async ({ params }: Props) => {
  const staff = await getCurrentStaffAndStoreType(params.storeSlug);

  if (!staff) {
    return null;
  }
  const isAuthorized =
    canManageProduct(staff) || isOwner(staff.userId, staff.store.userId);

  if (!isAuthorized) {
    return <NotPermitted />;
  }

  if (staff.store.storeType !== "TECHNOLOGY") {
    return redirect(`/${params.storeSlug}`);
  }

  const models = await db.model.findMany({
    where: {
      store: {
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
        <ModelClient models={models} />
      </div>
    </div>
  );
};

export default Models;
