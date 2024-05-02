import {
  Billboard,
  Category,
  Color,
  Model,
  Product,
  Size,
  Staff,
  Store,
  Type,
} from "@prisma/client";

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};

export type StoreWithStaffs = Store & {
  staffs: (Staff & {
    user: SafeUser
  })[]
};

export type StoreWithChildren = StoreWithStaffs & {
  categories: CategoryWithBillboard[];
  billboards: Billboard[];
  sizes: Size[];
  colors: Color[];
  models: Model[];
  types: Type[];
};

export type CategoryWithBillboard = Category & {
  billboard: Billboard;
};

export type ClothingProduct = Product & {
  size: Size | null;
  color: Color | null;
  category: Category;
};

export type TechnologyProduct = Product & {
  model: Model | null;
  type: Type | null;
  category: Category;
};

export type StaffWithUser = Staff & {
  user: {
    name: string;
    email: string;
    image: string;
  };
};

export type StaffWithStore = Staff & {
  store: Store;
};

export type CurrentStaff = Staff & {
  store: {
    userId: string;
  };
};
