"use client";

import { Button } from "@/components/ui/button";
import useModal from "@/hooks/use-modal-store";
import { ChevronLeft, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  label: string;
};

const Empty = ({ label }: Props) => {
  const { open } = useModal();
  const router = useRouter();

  return (
    <div className="flex h-full justify-center pt-56">
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl">
          {label}
        </h1>
        <div className="flex flex-col gap-y-4">
          <Button
            className="flex h-12 w-36 justify-between"
            onClick={() => open("createStore")}
          >
            <p className="">Create one</p>
            <PlusCircle className="rounded-full" />
          </Button>
          <Button
            className="flex h-12 w-36 justify-between"
            onClick={() => router.back()}
          >
            <p className="">Go back</p>
            <ChevronLeft className="rounded-full" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Empty;
