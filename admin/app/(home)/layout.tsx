import getCurrentUser from "@/lib/get-current-user";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Home = async ({ children }: Props) => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default Home;
