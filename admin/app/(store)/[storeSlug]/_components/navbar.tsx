"use client";

import React from "react";
import MainNav from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import UserButton from "./user-button";
import { StoreType } from "@prisma/client";
import { SafeUser } from "@/types";

type Props = {
  stores: {
    name: string;
    slug: string;
    storeType: StoreType;
  }[];
  user: SafeUser;
};

const Navbar = async ({ stores, user }: Props) => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="sm:flex lg:hidden">
          <MainNav />
        </div>
        <StoreSwitcher stores={stores} />
        <div className="hidden lg:block">
          <MainNav />
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserButton user={user} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
