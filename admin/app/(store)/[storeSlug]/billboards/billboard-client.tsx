"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

type Props = {};

const BillboardClient = (props: Props) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title="Billboards (0)"
          description="Manage your billboards for you store"
        />
        <Button
          onClick={() => router.push(`/${params.storeSlug}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
    </>
  );
};

export default BillboardClient;
