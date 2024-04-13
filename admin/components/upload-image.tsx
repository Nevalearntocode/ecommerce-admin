"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

type Props = {
  onChange: (value: string) => void;
  value: string;
  endpoint: "profileImage";
};

const ImageUpload = ({ onChange, value, endpoint }: Props) => {
  const fileType = value.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative flex justify-center border-2 h-[185px]">
        <div>
          <Image
            src={value}
            alt="your_home"
            height={720}
            width={720}
            className="h-full w-full object-fill"
          />
        </div>
        <Button
          variant={"destructive"}
          size={`icon`}
          className="absolute -right-4 -top-4 h-8 w-8 rounded-full"
          onClick={() => onChange("")}
        >
          <X />
        </Button>
      </div>
    );
  }

  return (
    <UploadButton
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      // add toast later
      onUploadError={(error: Error) => console.log(error)}
      className="group mb-4 h-[70%] cursor-pointer"
    />
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
