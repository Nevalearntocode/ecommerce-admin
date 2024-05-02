import Empty from "@/components/mainpages/empty";
import NotPermitted from "@/components/mainpages/not-permitted";
import { getStoreWithCurrentStaffLayout } from "@/data/get-stores";
import {
  canManageBillboard,
  canManageCategory,
  canManageProduct,
  canManageStore,
} from "@/permissions/permission-hierarchy";
import { Staff } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: {
    storeSlug: string;
  };
};

interface permissionMap {
  [key: string]: (staff: Staff) => boolean;
}

const StoreLayout = async ({ children, params }: Props) => {
  const store = await getStoreWithCurrentStaffLayout(params.storeSlug);

  if (!store) {
    return (
      <Empty
        label={`Store with slug: "${decodeURIComponent(params.storeSlug)}" not found`}
      />
    );
  }

  if (!store.staffs || store.staffs.length === 0) {
    return (
      <Empty
        label={`You are not a staff of store with slug: ${decodeURIComponent(params.storeSlug)}`}
      />
    );
  }

  const staff = store.staffs[0];

  const headerList = headers();
  const storeUrl = headerList.get("storeUrl") || "";
  const route = storeUrl.split("/")?.[4];

  const permissionMap: permissionMap = {
    settings: canManageStore,
    categories: canManageCategory,
    billboards: canManageBillboard,
    staffs: canManageProduct,
    colors: canManageProduct,
    sizes: canManageProduct,
    models: canManageProduct,
    types: canManageProduct,
    products: canManageProduct,
    orders: canManageProduct,
  };

  const keys = Object.keys(permissionMap);

  if (!keys.includes(route) && route !== undefined) {
    return redirect(`/${store.slug}`);
  }

  if (route && !permissionMap[route](staff)) {
    return <NotPermitted />;
  }

  return <>{children}</>;
};

export default StoreLayout;
