import { db } from "./db";

export async function getSizeById(sizeId: string) {
  const id = Number(sizeId);

  if (!id) {
    return null;
  }

  const size = await db.size.findUnique({
    where: {
      id,
    },
  });

  return size;
}

export async function getSizeIdByNameAndStoreId(name: string, storeId: number) {
  const size = await db.size.findUnique({
    where: {
      name_storeId: {
        name,
        storeId,
      },
    },
    select: {
      id: true
    }
  });

  return size;
}
