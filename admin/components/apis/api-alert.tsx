"use client";

import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Check, Copy, ServerIcon } from "lucide-react";
import { Badge, BadgeProps } from "../ui/badge";
import { Button } from "../ui/button";
import { toast } from "sonner";

type Props = {
  title: string;
  description: string;
  variant: "public" | "staff";
};

const textMap: Record<Props["variant"], string> = {
  public: "Public",
  staff: "Staff",
};

const variantMap: Record<Props["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  staff: "destructive",
};

const APIAlert = ({ description, title, variant }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(description);
    toast.success("API copied to clipboard.");
    setTimeout(() => {
      setIsCopied(false);
    }, 10000);
  };

  return (
    <Alert>
      <ServerIcon className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button
          variant={`outline`}
          size={`icon`}
          onClick={
            isCopied
              ? () => toast.info("API already copied to clipboard.")
              : onCopy
          }
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default APIAlert;
