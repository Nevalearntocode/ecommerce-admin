import React from "react";
import MainNav from "./main-nav";
import UserButton from "@/app/(root)/_components/user-button";
import StoreSwitcher from "./store-switcher";
import getCurrentUser from "@/data/get-current-user";
import getUserStoresById from "@/data/get-stores";
import { ModeToggle } from "@/components/mode-toggle";
import { headers } from "next/headers";

type Props = {};

const Navbar = async ({}: Props) => {
  const headerList = headers();
  const storeUrl = headerList.get("storeUrl") || "";

  const slug = storeUrl.split("/").pop();

  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const stores = await getUserStoresById(user.id);
  const currentStore = stores.find((store) => store.slug === slug);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {currentStore && (
        <div className="sm:flex lg:hidden">
          <MainNav store={currentStore} userId={user.id} />
        </div>
        )}
        <StoreSwitcher stores={stores} />
        {currentStore && (

        <div className="hidden lg:block">
          <MainNav store={currentStore} userId={user.id} />
        </div>
        )}
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserButton user={user} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
