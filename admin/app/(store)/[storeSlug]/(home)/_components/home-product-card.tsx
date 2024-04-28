"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronsUpDown, Package } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import ProductStock from "./product-stock";

type Props = {
  products: {
    name: string;
    stock: number;
    slug: string;
  }[];
};

const HomeProductCard = ({ products }: Props) => {
  const params = useParams();
  const router = useRouter();
  const onClick = () => {
    router.push(`${params.storeSlug}/products`);
  };

  return (
    <Card
      className="transition hover:bg-gray-100 dark:hover:bg-black/20"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Product in stock</CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-2xl font-bold">
          <p>{products.length}</p>
          <ProductStock products={products}>
            <Button
              className="flex h-5 w-5 items-center justify-center"
              size={`icon`}
              variant={`outline`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <ChevronsUpDown className="h-5 w-5" />
            </Button>
          </ProductStock>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeProductCard;
