import { StoreWithStaffs } from "@/types";
import { Staff } from "@prisma/client";

export function canManageStore(staff: Staff) {
  return staff.isAdmin || staff.canManageStore;
}

export function canManageCategory(staff: Staff) {
  return canManageStore(staff) || staff.canManageCategory;
}

export function canManageBillboard(staff: Staff) {
  return canManageCategory(staff) || staff.canManageBillboard;
}