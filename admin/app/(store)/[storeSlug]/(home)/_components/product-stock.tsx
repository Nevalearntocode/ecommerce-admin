"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  products: {
    name: string;
    stock: number;
    slug: string;
  }[];
};

const ProductStock = ({ children, products }: Props) => {
  const params = useParams();
  const router = useRouter();

  const onClick = (slug: string) => {
    console.log(slug);
    router.push(`/${params.storeSlug}/products/${slug}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {products.map((product) => (
          <DropdownMenuItem
            key={product.name}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClick(product.slug);
            }}
          >
            <div className="flex w-full justify-between gap-x-16">
              <p className="text-lg font-light">{product.name}</p>
              <p className="font-semibold text-zinc-500">{product.stock}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductStock;
