"use client";

import React from "react";
import { Button } from "./ui/button";
import { useParams, useRouter } from "next/navigation";

type Props = {};

const NotPermitted = ({}: Props) => {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="flex h-full justify-center pt-40">
      <div className="flex flex-col items-center gap-y-4">
        <h1 className="text-3xl font-bold">
          Your current role does not have permission to access this route.
        </h1>
        <p>Ask your manager for more information</p>
        <Button
          className="flex gap-x-2 pr-3"
          onClick={() => router.push(`/${params.storeSlug}`)}
        >
          <p className="">Go back.</p>
        </Button>
      </div>
    </div>
  );
};

export default NotPermitted;
