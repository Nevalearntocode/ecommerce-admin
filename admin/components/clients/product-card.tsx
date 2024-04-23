"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

type Entity = {
  name: string;
  images: string[];
  slug?: string;
  id?: number;
};

type Props = {
  entity: Entity;
  type: "technologyProduct" | "clothingProduct";
};

function EntityCard({ entity, type }: Props) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const router = useRouter();
  const params = useParams();

  const handleButtonClick = useCallback((index: number) => {
    setMainImageIndex(index);
  }, []);

  const getEditPath = () => {
    switch (type) {
      case "technologyProduct":
      case "clothingProduct":
        return `/${params.storeSlug}/products/${entity.slug}`;
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader className="font-bold">{entity.name}</CardHeader>
      <CardContent className="h-2/3">
        <div className="h-full">
          <Image
            priority={true}
            src={entity.images[mainImageIndex]}
            alt={entity.name}
            height={720}
            width={720}
            className="aspect-video h-full w-full rounded-md transition duration-1000 hover:scale-110"
          />
        </div>
        <div className="flex items-center justify-between pb-8">
          {entity.images.length > 1 && (
            <div className="mt-4 flex items-center justify-between pb-8">
              <div className="flex gap-x-2">
                {entity.images.slice(0, 3).map((image, index) => (
                  <Button
                    key={index}
                    size={`icon`}
                    className="flex items-center justify-center"
                    onClick={() => handleButtonClick(index)}
                  >
                    <Image
                      priority={true}
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
            </div>
          )}
          <Button
            className={cn(
              "ml-auto w-1/3",
              entity.images.length === 1 && "mt-6",
            )}
            onClick={() => router.push(getEditPath())}
          >
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default EntityCard;
