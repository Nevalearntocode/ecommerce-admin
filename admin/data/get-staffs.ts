import { db } from "../lib/db";
import getCurrentUser from "./get-current-user";

export async function getStaffs(storeId: number) {
  const staffs = await db.staff.findMany({
    where: {
      storeId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return staffs;
}

export async function getCurrentStaffWithStore(storeSlug: string) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const staff = await db.staff.findFirst({
    where: {
      userId: user.id,
      store: {
        slug: storeSlug,
      },
    },
    include: {
      store: true,
    },
  });

  return staff;
}

export async function getCurrentStaff(storeSlug: string) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const staff = await db.staff.findFirst({
    where: {
      userId: user.id,
      store: {
        slug: storeSlug,
      },
    },
    include: {
      store: {
        select: {
          userId: true,
        },
      },
    },
  });

  return staff;
}

export async function getCurrentStaffAndStoreType(storeSlug: string) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const staff = await db.staff.findFirst({
    where: {
      userId: user.id,
      store: {
        slug: storeSlug,
      },
    },
    include: {
      store: {
        select: {
          storeType: true,
          userId: true,
        },
      },
    },
  });

  return staff;
}
