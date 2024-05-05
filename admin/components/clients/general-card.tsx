"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  title: string;
  imageUrl: string;
  path: string;
};

function GeneralCard({ title, imageUrl, path }: Props) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="font-bold">{title}</CardHeader>
      <CardContent className="h-2/3" onClick={() => router.push(path)}>
        <div className="h-full">
          <Image
            loading="lazy"
            src={imageUrl}
            alt={title}
            height={640}
            width={640}
            className="aspect-video h-full w-full rounded-md transition duration-1000 hover:scale-110"
          />
        </div>
        <div className="mt-4 flex items-center justify-between pb-8">
          <Button onClick={() => router.push(path)} className="ml-auto w-1/3">
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default GeneralCard;
