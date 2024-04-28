"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StoreWithStaffs } from "@/types";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import MobileNav from "./mobile-nav";

type Props = {
  stores: StoreWithStaffs[];
  userId: string;
};

export type RouteType = {
  href: string;
  label: string;
  active: boolean;
  requireAdminOrPermission?: string;
};

// Defines the possible permission names for staff members come from schema
export type StaffPermissionName =
  | "isAdmin"
  | "canManageStore"
  | "canManageCategory"
  | "canManageBillboard"
  | "canManageProduct";

const MainNav = ({ stores, userId }: Props) => {
  const params = useParams();
  const pathname = usePathname();

  const existingStore = stores.find((store) => store.slug == params.storeSlug);

  if (!params.storeSlug || !existingStore) {
    return null;
  }

  const staff = existingStore.staffs[0];

  if (!staff) {
    return null;
  }

  const isOwner = existingStore.userId === userId;

  const isAdmin = staff.isAdmin || existingStore.userId === userId;

  // Define the hierarchy of permissions from highest to lowest access level
  const permissionHierarchy = [
    "isAdmin",
    "canManageStore",
    "canManageCategory",
    "canManageBillboard",
    "canManageProduct",
  ];

  // Array of routes that are common to all store types
  const DEFAULT_ROUTES: RouteType[] = [
    {
      href: `/${params.storeSlug}`,
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
      href: `/${params.storeSlug}/staffs`,
      label: "Staffs",
      active: pathname === `/${params.storeSlug}/staffs`,
      requireAdminOrPermission: "canManageProduct",
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

  const AdditionalRoutes = [
    {
      href: `/${params.storeSlug}/products`,
      label: "Products",
      active: pathname === `/${params.storeSlug}/products`,
      requireAdminOrPermission: "canManageProduct",
    },
    {
      href: `/${params.storeSlug}/orders`,
      label: "Orders",
      active: pathname === `/${params.storeSlug}/orders`,
      requireAdminOrPermission: "canManageOrder",
    },
  ];

  // Array of routes specifically for stores of type "CLOTHING"
  const CLOTHING_ROUTES: RouteType[] = [
    {
      href: `/${params.storeSlug}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.storeSlug}/sizes`,
      requireAdminOrPermission: "canManageProduct",
    },
    {
      href: `/${params.storeSlug}/colors`,
      label: "Colors",
      active: pathname === `/${params.storeSlug}/colors`,
      requireAdminOrPermission: "canManageProduct",
    },
  ];

  // Array of routes specifically for stores of type "TECHNOLOGY"
  const TECHNOLOGY_ROUTES: RouteType[] = [
    {
      href: `/${params.storeSlug}/models`,
      label: "Models",
      active: pathname === `/${params.storeSlug}/models`,
      requireAdminOrPermission: "canManageProduct",
    },
    {
      href: `/${params.storeSlug}/types`,
      label: "Types",
      active: pathname === `/${params.storeSlug}/types`,
      requireAdminOrPermission: "canManageProduct",
    },
  ];

  const routes: RouteType[] = [...DEFAULT_ROUTES];

  if (existingStore.storeType === "CLOTHING") {
    routes.push(...CLOTHING_ROUTES);
  } else if (existingStore.storeType === "TECHNOLOGY") {
    routes.push(...TECHNOLOGY_ROUTES);
  }

  routes.push(...AdditionalRoutes);

  return (
    <>
      <MobileNav
        routes={routes}
        isAdmin={isAdmin}
        permissionHierarchy={permissionHierarchy}
        staff={staff}
      >
        <Button variant={`ghost`} size={`icon`} className="sm:block lg:hidden">
          <Menu />
        </Button>
      </MobileNav>
      <nav className="mx-6 hidden items-center space-x-4 lg:flex lg:space-x-6">
        {routes.map((route) => {
          // Check if the user is not an admin and the route requires a specific permission
          if (
            !isOwner &&
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
    </>
  );
};

export default MainNav;
