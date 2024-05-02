"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getHighestRole } from "@/lib/utils";
import { StaffWithUser } from "@/types";
import { format } from "date-fns";
import React from "react";
import StaffCardAction from "./staff-card-action";
import { canManageStaff, isOwner } from "@/permissions/permission-hierarchy";
import { useStoreContext } from "@/contexts/store-context";

type Props = {
  staff: StaffWithUser;
  currentStaff: StaffWithUser;
};

export const roleIconMap = {
  Owner: "👑",
  Admin: "🔒",
  Manager: "👔",
  "Category Manager": "📦",
  "Billboard Manager": "📸",
  "Product Manager": "🛍️",
  "Don't have role": "❌",
};

const StaffCard = ({ staff, currentStaff }: Props) => {
  const { userId } = useStoreContext().store;
  const { id } = useStoreContext().user;

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <div className="mb-4 flex items-center justify-between">
          <Avatar>
            <AvatarImage src={staff.user.image} alt={`avatar`} />
            <AvatarFallback className="text-black">
              {staff.user.name !== ""
                ? staff.user.name.charAt(0).toLocaleUpperCase()
                : staff.user.email.charAt(0).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
          {(isOwner(staff.userId, userId) || canManageStaff(currentStaff)) && (
            <StaffCardAction staff={staff} />
          )}
        </div>
        <CardTitle>
          {staff.user.name === "" ? staff.user.email : staff.user.name}
        </CardTitle>
        {(isOwner(staff.userId, userId) || canManageStaff(currentStaff)) && (
          <div>
            {staff.user.name !== "" && (
              <CardDescription>{staff.user.email}</CardDescription>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex justify-between">
        <div className="flex flex-col">
          <p className="text-zinc-400">
            {
              roleIconMap[
                isOwner(staff.userId, userId) ? "Owner" : getHighestRole(staff)
              ]
            }
          </p>
          <p className="">
            {isOwner(staff.userId, userId) ? "Owner" : getHighestRole(staff)}
          </p>
        </div>
        {(isOwner(staff.userId, userId) || canManageStaff(currentStaff)) && (
          <div className="flex flex-col">
            <p className="text-zinc-400">Hire date</p>
            <p className="">{format(staff.createdAt, "dd/MM/yy")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffCard;
