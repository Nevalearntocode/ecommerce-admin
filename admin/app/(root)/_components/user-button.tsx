"use client";

import React from "react";
import { Button } from "../../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import useModal from "@/hooks/use-modal-store";
import { SafeUser } from "@/types";

type Props = {
  user: SafeUser;
};

const UserButton = ({ user }: Props) => {
  const { open } = useModal();

  return (
    <Button
      variant={`secondary`}
      className="rounded-full transition hover:drop-shadow-md"
      size={`icon`}
      onClick={() => open("profile", { user })}
    >
      <Avatar>
        <AvatarImage src={user.image} alt={`avatar`} />
        <AvatarFallback className="text-black">
          {user.name !== ""
            ? user.name.charAt(0).toLocaleUpperCase()
            : user.email.charAt(0).toLocaleUpperCase()}
        </AvatarFallback>
      </Avatar>
    </Button>
  );
};

export default UserButton;
