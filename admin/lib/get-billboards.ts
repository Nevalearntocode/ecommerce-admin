import { db } from "./db";

export async function getBillboardById(id: string) {
  const billboardId = Number(id);

  if (!billboardId) {
    return null;
  }

  const billboard = await db.billboard.findUnique({
    where: {
      id: billboardId,
    },
    include: {
      categories: {
        select: {
          id: true,
        },
      },
    },
  });

  return billboard;
}

export async function getBillboardByNameAndStoreId(
  name: string,
  storeId: number,
) {
  const billboard = await db.billboard.findUnique({
    where: {
      name_storeId: {
        name,
        storeId,
      },
    },
  });
  return billboard;
}
