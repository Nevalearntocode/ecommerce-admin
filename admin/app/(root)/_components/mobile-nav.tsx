"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { ReactNode } from "react";
import { RouteType, StaffPermissionName } from "./main-nav";
import Link from "next/link";
import { Staff } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

type Props = {
  children: ReactNode;
  routes: RouteType[];
  permissionHierarchy: string[];
  isAdmin: boolean;
  staff: Staff;
};

function MobileNav({
  children,
  routes,
  permissionHierarchy,
  isAdmin,
  staff,
}: Props) {
  const params = useParams();
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={"left"} className="w-2/3">
        <SheetHeader className="text-left">
          <SheetTitle>Store Management</SheetTitle>
          <SheetDescription className="pb-6">
            Access different sections and settings for your store .
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-y-8">
          {routes.map((route) => {
            if (
              !isAdmin &&
              route.requireAdminOrPermission &&
              !permissionHierarchy
                .slice(
                  0,
                  permissionHierarchy.indexOf(route.requireAdminOrPermission) +
                    1,
                )
                .some((permission) => staff[permission as StaffPermissionName])
            ) {
              return null;
            }

            return (
              <SheetClose asChild key={route.label}>
                <Link
                  href={route.active ? `/${params.storeSlug}` : route.href}
                  key={route.href}
                  className={cn(
                    "text-left text-xl font-semibold transition-colors hover:text-primary",
                    route.active
                      ? "text-black dark:text-white"
                      : "text-muted-foreground",
                  )}
                >
                  {route.label}
                </Link>
              </SheetClose>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
