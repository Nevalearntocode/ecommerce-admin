"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Billboard } from "@prisma/client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";

type Props = {
  billboard: Billboard;
};

function BillboardCard({ billboard }: Props) {
  const router = useRouter();
  const params = useParams();

  return (
    <Card>
      <CardHeader className="font-bold">{billboard.name}</CardHeader>
      <CardContent
        className="h-2/3"
        onClick={() =>
          router.push(`/${params.storeSlug}/billboards/${billboard.id}`)
        }
      >
        <div className="h-full">
          <Image
            priority={true}
            src={billboard.image}
            alt={billboard.name}
            height={720}
            width={720}
            className="aspect-video h-full w-full rounded-md transition duration-1000 hover:scale-110"
          />
        </div>
        <div className="mt-4 flex items-center justify-between pb-8">
          <Button className="ml-auto w-1/3">Edit</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default BillboardCard;
