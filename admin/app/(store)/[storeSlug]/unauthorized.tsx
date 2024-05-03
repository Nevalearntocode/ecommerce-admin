"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  label: string;
};

const Unauthorized = ({ label }: Props) => {
  const router = useRouter();

  return (
    <div className="flex h-full justify-center pt-56">
      <div className="flex flex-col items-center gap-y-4">
        <h1 className="text-3xl font-bold">{label}</h1>
        <Button className="flex gap-x-2 pr-3" onClick={() => router.refresh()}>
          <p className="">Go back</p>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
