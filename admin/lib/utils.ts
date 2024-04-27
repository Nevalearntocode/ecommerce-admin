import { Staff } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const getHighestRole = (staff: Staff) => {
  if (staff.isAdmin) {
    return "Admin";
  }

  if (staff.canManageStore) {
    return "Manager";
  }
  if (staff.canManageCategory) {
    return "Category Manager";
  }

  if (staff.canManageBillboard) {
    return "Billboard Manager";
  }

  if (staff.canManageProduct) {
    return "Product Manager";
  }

  return "Don't have role";
};
