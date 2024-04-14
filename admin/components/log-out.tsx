"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import React from "react";

type Props = {};

const LogOut = (props: Props) => {
  const onLogOut = async () => {
    await signOut();
  };

  return <Button onClick={onLogOut}>Log Out</Button>;
};

export default LogOut;
