"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";

type Props = {
  salesCount: number;
};

const SalesCard = ({ salesCount }: Props) => {
  const params = useParams();
  const router = useRouter();
  const onClick = () => {
    router.push(`${params.storeSlug}/orders`);
  };

  return (
    <Card
      className="transition hover:bg-gray-100 dark:hover:bg-black/20"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sales</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{salesCount}</div>
      </CardContent>
    </Card>
  );
};

export default SalesCard;
