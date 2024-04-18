import { Staff } from "@prisma/client";

export function canManageStaff(staff: Staff) {
  return staff.isAdmin;
}

export function canManageStore(staff: Staff) {
  return staff.isAdmin || staff.canManageStore;
}

export function canManageCategory(staff: Staff) {
  return canManageStore(staff) || staff.canManageCategory;
}

export function canManageBillboard(staff: Staff) {
  return canManageCategory(staff) || staff.canManageBillboard;
}
