"use client";

import Empty from "@/components/empty";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useOrigin } from "@/hooks/use-origin";
import { StoreWithStaffs } from "@/types";
import axios from "axios";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  stores: StoreWithStaffs[];
  userId: string;
};

const AddStaff = ({ stores, userId }: Props) => {
  const [isCopy, setIsCopy] = useState<boolean>();
  const [dropDownMenuOpen, setdropDownMenuOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const origin = useOrigin();

  if (!params.storeSlug) {
    return null;
  }

  const store = stores.find((store) => store.slug === params.storeSlug);

  if (!store) {
    return null;
  }

  const { staffs } = store;

  const onRefresh = async () => {
    try {
      const res = await axios.patch(`/api/store/${store.slug}/invite`);
      toast.success(res.data.success);
      router.refresh();
      setIsCopy(false);
      setdropDownMenuOpen(true);
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const inviteSlug = `${origin}/${store?.slug}/staff/${store?.inviteCode}`;
  const onCopy = () => {
    navigator.clipboard.writeText(inviteSlug);
    toast.success("Invite link copied.");
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 10000);
  };

  return (
    <>
      {store.userId !== userId && (
        <Button variant={`destructive`}>Leave store</Button>
      )}
      {(staffs[0].isAdmin || store.userId === userId) && (
        <DropdownMenu
          open={dropDownMenuOpen}
          onOpenChange={setdropDownMenuOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant={`outline`}
              className="rounded-xl"
              onClick={() => setdropDownMenuOpen(true)}
            >
              Add staff
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuLabel className="text-xs italic">
              Send this link to your employee
            </DropdownMenuLabel>
            <div className="flex">
              <Input
                value={inviteSlug}
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                readOnly={true}
              />
              {isCopy ? (
                <Button
                  size={`icon`}
                  variant={`outline`}
                  className="m-0 rounded-full border-none p-0"
                  onClick={() => {
                    toast.info(
                      "Invite url is already copied into your clipboard.",
                    );
                  }}
                >
                  <Check className="h-4 w-4 text-emerald-500" />
                </Button>
              ) : (
                <Button
                  size={`icon`}
                  variant={`outline`}
                  className="m-0 rounded-full border-none p-0"
                  onClick={onCopy}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
              <Button
                size={`icon`}
                variant={`outline`}
                className="m-0 border-none p-0"
                onClick={onRefresh}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default AddStaff;
