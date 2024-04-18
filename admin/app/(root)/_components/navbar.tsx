import React from "react";
import MainNav from "./main-nav";
import UserButton from "@/components/user-button";
import StoreSwitcher from "./store-switcher";
import getCurrentUser from "@/lib/get-current-user";
import getUserStoresById from "@/lib/get-stores";
import AddStaff from "./add-staff";

type Props = {};

const Navbar = async ({}: Props) => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const stores = await getUserStoresById(user.id);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher stores={stores} />
        <MainNav stores={stores} userId={user.id} />
        <div className="ml-auto flex items-center space-x-4">
          <AddStaff stores={stores} userId={user.id} />
          <UserButton user={user} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
