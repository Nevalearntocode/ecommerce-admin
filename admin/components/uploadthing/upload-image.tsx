"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { cn } from "@/lib/utils";

type Props = {
  onChange: (value: string) => void;
  value: string | string[];
  endpoint: "profileImage" | "billboardImage" | "productImage";
  type: "billboard" | "profile";
};

const ImageUpload = ({ onChange, value, endpoint, type }: Props) => {
  if (typeof value === "string") {
    const fileType = value && value.split(".").pop();

    if (value && fileType !== "pdf") {
      return (
        <div
          className={cn(
            "relative flex justify-center",
            type === "profile" && "h-[185px]",
            type === "billboard" && "h-auto",
          )}
        >
          <div>
            <Image
              loading="lazy"
              src={value}
              alt="billboard"
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
              onChange("");
            }}
          >
            <X />
          </Button>
        </div>
      );
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      {type === "billboard" && (
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={(res) => onChange(res?.[0].url)}
          onUploadError={(error: Error) => console.log(error)}
          className="group mb-4 mt-0 w-full cursor-pointer pt-0"
        />
      )}
      {type === "profile" && (
        <UploadButton
          endpoint={endpoint}
          onClientUploadComplete={(res) => onChange(res?.[0].url)}
          onUploadError={(error: Error) => console.log(error)}
          className="group mb-4 h-[70%] cursor-pointer"
        />
      )}
    </div>
  );
};

export default ImageUpload;
