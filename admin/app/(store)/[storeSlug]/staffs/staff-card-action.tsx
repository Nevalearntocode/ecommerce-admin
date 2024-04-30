"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useModal from "@/hooks/use-modal-store";
import { StaffWithStore, StaffWithUser } from "@/types";
import axios from "axios";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  staff: StaffWithUser;
  currentStaff: StaffWithStore;
};

const StaffCardAction = ({ currentStaff, staff }: Props) => {
  const { open } = useModal();
  const router = useRouter();

  const onDelete = async () => {
    try {
      const res = await axios.delete(
        `/api/store/${currentStaff.store.slug}/staffs/${staff.id}`,
      );
      toast.success(res.data.success);
      router.refresh();
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const deletePackage = {
    confirmDelete: onDelete,
    headerDelete: "Remove Staff",
    descriptionDelete: `Are you sure you want to remove ${staff.user.name === "" ? staff.user.email : staff.user.name}?`,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full">
          <MoreHorizontal />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => open("updateRole", { staff, currentStaff })}
        >
          <Edit className="mr-2 h-4 w-4" />
          Update
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => open("confirmDelete", { ...deletePackage })}
        >
          <Trash className="mr-2 h-4 w-4 text-rose-500" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StaffCardAction;
