import { Staff } from "@prisma/client";

export function isOwner(staff: Staff, stroreUserId: string){
  return staff.userId === stroreUserId
}

export function canManageStaff(staff: Staff) {
  return staff.isAdmin;
}

export function canManageStore(staff: Staff) {
  return canManageStaff(staff) || staff.canManageStore;
}

export function canManageCategory(staff: Staff) {
  return canManageStore(staff) || staff.canManageCategory;
}

export function canManageBillboard(staff: Staff) {
  return canManageCategory(staff) || staff.canManageBillboard;
}

export function canManageProduct(staff: Staff) {
  return canManageBillboard(staff) || staff.canManageProduct;
}
