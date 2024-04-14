"use client";

import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useModal from "@/hooks/use-modal-store";

type Props = {
  user: {
    email: string;
    name: string;
    image: string;
  };
};

const UserButton = ({ user }: Props) => {
  const { open } = useModal();

  return (
    <Button
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
