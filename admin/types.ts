import { Billboard, Category, Staff, Store } from "@prisma/client";

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};

export type StoreWithStaffs = Store & {
  staffs: Staff[];
};

export type StaffWithProfile = Staff & {
  user: {
    email: string;
    name: string;
  };
};

export type CategoryWithBillboard = Category & {
  billboard: Billboard;
};
