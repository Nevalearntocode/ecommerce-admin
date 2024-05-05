import Empty from "@/components/mainpages/empty";
import StoreContextProvider from "@/contexts/store-context";
import { getStoreWithCurrentStaffLayout } from "@/data/get-stores";
import {
  canManageBillboard,
  canManageCategory,
  canManageProduct,
  canManageStore,
  isOwner,
} from "@/permissions/permission-hierarchy";
import {
  ClothingProduct,
  SafeUser,
  StoreWithChildren,
  TechnologyProduct,
} from "@/types";
import { Staff } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import Unauthorized from "./unauthorized";
import {
  getClothingProductsWithStoreType,
  getTechnologyProductsWithStoreType,
} from "@/data/get-products";
import Navbar from "./_components/navbar";
import { db } from "@/lib/db";

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
  const res = await getStoreWithCurrentStaffLayout(params.storeSlug);

  const { store, user } = res as {
    store: StoreWithChildren;
    user: SafeUser;
  };

  if (!store) {
    return (
      <Empty
        label={`Store with slug: "${decodeURIComponent(params.storeSlug)}" not found`}
      />
    );
  }

  const staff = store.staffs.find((staff) => staff.userId === user.id);

  if (!staff) {
    return (
      <Unauthorized label={`You are not a staff of store: "${store.name}"`} />
    );
  }

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

  if (route === "colors" || route === "sizes") {
    if (store.storeType !== "CLOTHING") {
      return redirect(`/${store.slug}`);
    }
  }

  if (route === "models" || route === "types") {
    if (store.storeType !== "TECHNOLOGY") {
      return redirect(`/${store.slug}`);
    }
  }

  if (!keys.includes(route) && route !== undefined) {
    return redirect(`/${store.slug}`);
  }

  if (route && !permissionMap[route](staff)) {
    if (!isOwner(user.id, store.userId)) {
      return redirect(`/${store.slug}`);
    }
  }

  const currentUserStores = await db.store.findMany({
    where: {
      staffs: {
        some: {
          userId: user.id,
        },
      },
    },
    select: {
      name: true,
      slug: true,
      storeType: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  let products: (ClothingProduct | TechnologyProduct)[] = [];
  if (store.storeType === "CLOTHING") {
    products = await getClothingProductsWithStoreType(store.id);
  } else if (store.storeType === "TECHNOLOGY") {
    products = await getTechnologyProductsWithStoreType(store.id);
  }

  return (
    <StoreContextProvider
      data={{
        store,
        user,
        products,
      }}
    >
      <Navbar stores={currentUserStores} user={user} />
      {children}
    </StoreContextProvider>
  );
};

export default StoreLayout;
