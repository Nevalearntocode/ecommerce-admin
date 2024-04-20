"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClothingProduct } from "@/types";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  clothingProduct: ClothingProduct;
};

function ClothingProductCard({ clothingProduct }: Props) {
  const [mainImageIndex, setMainImageIndex] = useState(0); // Track index of main image
  const router = useRouter();
  const params = useParams();

  const handleButtonClick = (index: number) => {
    setMainImageIndex(index); // Update main image index on click
  };

  return (
    <Card>
      <CardHeader className="font-bold">{clothingProduct.name}</CardHeader>
      <CardContent className="h-2/3">
        <div className="h-full">
          <Image
            priority={true}
            src={clothingProduct.images[mainImageIndex]} // Use mainImageIndex
            alt={clothingProduct.name}
            height={720}
            width={720}
            className="aspect-video h-full w-full rounded-md transition duration-1000 hover:scale-110"
          />
        </div>
        <div className="mt-4 flex items-center justify-between pb-8">
          <div className="flex gap-x-2">
            {clothingProduct.images.slice(0, 3).map((image, index) => (
              <Button
                key={index}
                size={`icon`}
                className="flex items-center justify-center"
                onClick={() => handleButtonClick(index)}
              >
                <Image
                  src={image}
                  alt="Small image"
                  height={720}
                  width={720}
                  className={cn(
                    "h-10 w-10 transition duration-1000 hover:scale-110",
                    index === mainImageIndex && "scale-125 border-2",
                  )}
                />
              </Button>
            ))}
          </div>
          <Button
            className="ml-auto w-1/3"
            onClick={() =>
              router.push(
                `/${params.storeSlug}/products/${clothingProduct.slug}`,
              )
            }
          >
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ClothingProductCard;
