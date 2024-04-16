"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

type Props = {};

const MainNav = (props: Props) => {
  const params = useParams();
  const pathname = usePathname();

  if (!params.storeSlug) {
    return null;
  }

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
    },
  ];

  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
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
      ))}
    </nav>
  );
};

export default MainNav;
