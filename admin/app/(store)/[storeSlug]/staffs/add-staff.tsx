"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useStoreContext } from "@/contexts/store-context";
import useModal from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  isAdmin: boolean;
};

const AddStaff = ({ isAdmin }: Props) => {
  const store = useStoreContext().store;
  const { id } = useStoreContext().user;
  const { open, close } = useModal();
  const [isCopy, setIsCopy] = useState<boolean>();
  const [dropDownMenuOpen, setdropDownMenuOpen] = useState(false);
  const router = useRouter();
  const origin = useOrigin();

  if (!store) {
    return null;
  }

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

  const onLeaveStore = async () => {
    try {
      const res = await axios.delete(`/api/store/${store.slug}/staffs`);
      toast.success(res.data.success);
      close();
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const inviteSlug = `${origin}/${store?.slug}/staffs/${store?.inviteCode}`;
  const onCopy = () => {
    navigator.clipboard.writeText(inviteSlug);
    toast.success("Invite link copied.");
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 10000);
  };

  const deletePackage = {
    confirmDelete: onLeaveStore,
    headerDelete: "Leave store",
    descriptionDelete: "Are you sure you want to leave this store?",
  };

  return (
    <>
      <div className="flex gap-x-4">
        {store.userId !== id && (
          <Button
            variant={`destructive`}
            className="h-10 md:h-12 md:w-28"
            onClick={() => open("confirmDelete", { ...deletePackage })}
          >
            Leave store
          </Button>
        )}
        {(isAdmin || store.userId === id) && (
          <DropdownMenu
            open={dropDownMenuOpen}
            onOpenChange={setdropDownMenuOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                className="h-10 rounded-xl md:h-12 md:w-28"
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
      </div>
    </>
  );
};

export default AddStaff;
