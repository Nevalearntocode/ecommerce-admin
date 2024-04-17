"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { cn } from "@/lib/utils";

type Props = {
  onChange: (value: string) => void;
  value: string;
  endpoint: "profileImage";
  type: "billboard" | "profile";
};

const ImageUpload = ({ onChange, value, endpoint, type }: Props) => {
  const fileType = value.split(".").pop();

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
            src={value}
            alt="your_home"
            height={720}
            width={720}
            className="aspect-video h-full w-full object-fill"
          />
        </div>
        <Button
          variant={"outline"}
          size={`icon`}
          className="absolute -right-2 -top-2 h-4 w-4 rounded-full"
          onClick={() => onChange("")}
        >
          <X />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <UploadButton
        endpoint={endpoint}
        onClientUploadComplete={(res) => onChange(res?.[0].url)}
        // add toast later
        onUploadError={(error: Error) => console.log(error)}
        className="group mb-4 h-[70%] cursor-pointer"
      />
    </div>
    // <Button
    //   variant={'outline'}
    //   className="flex h-[80%] w-full flex-col items-center justify-center gap-8"
    //   onClick={(e) => {
    //     e.preventDefault();
    //     open?.();
    //   }}
    // >
    //   <TbPhotoPlus size={50} />
    //   {value && (
    //     <div className="absolute inset-0 h-full w-full">
    //       <Image alt="upload" fill style={{ objectFit: 'cover' }} src={value} />
    //     </div>
    //   )}
    // </Button>
  );
};

export default ImageUpload;
