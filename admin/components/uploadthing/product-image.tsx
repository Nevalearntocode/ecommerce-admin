"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import "@uploadthing/react/styles.css";

type Props = {
  onUpload: (value: string, state: "upload") => void;
  onRemove: (value: string, state: "remove") => void;
  value: string;
  endpoint: "productImage";
};

const ProductImage = ({ onUpload, value, endpoint, onRemove }: Props) => {
  const fileType = value && value.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className={cn("relative flex h-auto min-h-[250px] justify-center")}>
        <div>
          <Image
            loading="lazy"
            src={value}
            alt="product"
            height={200}
            width={480}
            className="aspect-video h-full w-full rounded-md object-fill"
          />
        </div>
        <Button
          variant={"outline"}
          size={`icon`}
          className="absolute -right-2 -top-2 h-4 w-4 rounded-full"
          onClick={(e) => {
            e.preventDefault();
            onRemove(value, "remove");
          }}
        >
          <X />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => onUpload(res?.[0].url, "upload")}
        onUploadError={(error: Error) => console.log(error)}
        className="group mb-4 mt-0 w-full cursor-pointer pt-0"
      />
    </div>
  );
};

export default ProductImage;
