"use client";

import { cn } from "@/lib/utils";
import { StoreWithStaffs } from "@/types";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

type Props = {
  stores: StoreWithStaffs[];
};

// Defines the possible permission names for staff members come from schema
type StaffPermissionName =
  | "canManageStore"
  | "canManageCategory"
  | "canManageBillboard"
  | "canManageProduct";

const MainNav = ({ stores }: Props) => {
  const params = useParams();
  const pathname = usePathname();

  const existingStore = stores.find((store) => store.slug == params.storeSlug);

  if (!params.storeSlug || !existingStore) {
    return null;
  }

  const staff = existingStore.staffs[0];

  const { isAdmin } = staff;

  // Define the hierarchy of permissions from highest to lowest access level
  const permissionHierarchy = [
    "canManageStore",
    "canManageCategory",
    "canManageBillboard",
    "canManageProduct",
  ];

  const routes = [
    {
      href: `/`,
      label: "Home",
      active: pathname === `/${params.storeSlug}`,
    },
    {
      href: `/${params.storeSlug}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeSlug}/settings`,
      requireAdminOrPermission: "canManageStore",
    },
    {
      href: `/${params.storeSlug}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.storeSlug}/billboards`,
      requireAdminOrPermission: "canManageBillboard",
    },
    {
      href: `/${params.storeSlug}/categories`,
      label: "Categories",
      active: pathname === `/${params.storeSlug}/categories`,
      requireAdminOrPermission: "canManageCategory",
    },
  ];

  if (existingStore.storeType === "CLOTHING") {
    routes.push({
      href: `/${params.storeSlug}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.storeSlug}/sizes`,
      requireAdminOrPermission: "canManageProduct",
    });
  }

  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => {
        // Check if the user is not an admin and the route requires a specific permission
        if (
          !isAdmin &&
          route.requireAdminOrPermission &&
          // Check if the staff member doesn't have the required permission or any higher permission
          !permissionHierarchy
            // Create a sub-array containing the required permission and all permissions above it
            // if you log this sub-array out, for example:
            // route is settings > sub-array only has 1 permission and it's canManageStore
            // route is category > sub-array has 3 permissions excluding canManageStore
            // route is products > sub-array has all 4 permissions
            .slice(
              0,
              permissionHierarchy.indexOf(route.requireAdminOrPermission) + 1,
            )
            // Check if the staff member has any of the permissions in the sub-array
            // The key point is the permissions in the array and permissions in StaffPermissionName have to have the same names with roles of staff model in prisma schema
            .some((permission) => staff[permission as StaffPermissionName])
        ) {
          // If the staff member doesn't have sufficient permissions, don't render the route
          return null;
        }

        return (
          <Link
            href={route.active ? `/${params.storeSlug}` : route.href}
            key={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active
                ? "text-black dark:text-white"
                : "text-muted-foreground",
            )}
          >
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNav;
