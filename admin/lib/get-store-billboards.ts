import { db } from "./db";
import getCurrentUser from "./get-current-user";

export async function getBillboardById(id: string) {
  const billboardId = Number(id);

  if (!billboardId) {
    return null;
  }

  const billboard = await db.billboard.findUnique({
    where: {
      id: billboardId,
    },
  });

  return billboard;
}

export async function getBillboardsAndCurrentStaff(slug: string) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const store = await db.store.findUnique({
    where: {
      slug,
    },
    include: {
      billboards: true,
      staffs: {
        where: {
          userId: user.id,
        },
      },
    },
  });

  if (!store) {
    return {
      staff: null,
      billboards: null,
    }
  }

  const staff = store.staffs[0];
  const billboards = store.billboards;

  return { staff, billboards };
}
