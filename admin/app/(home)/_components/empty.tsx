"use client";

import { Button } from "@/components/ui/button";
import useModal from "@/hooks/use-modal-store";
import { PlusCircle } from "lucide-react";
import React from "react";

type Props = {};

const Empty = (props: Props) => {
  const { open } = useModal();

  return (
    <div className="flex flex-col items-center gap-y-4">
      <h1 className="text-3xl font-bold">You don't have any store yet.</h1>
      <Button className="flex gap-x-2 pr-3" onClick={() => open("createStore")}>
        <p className="">Create one</p>
        <PlusCircle className="rounded-full" />
      </Button>
    </div>
  );
};

export default Empty;
