import { db } from "./db";

export async function getTypeById(typeId: string) {
  const id = Number(typeId);

  if (!id) {
    return null;
  }

  const type = await db.type.findUnique({
    where: {
      id,
    },
  });

  return type;
}

export async function getTypeIdByNameAndStoreId(name: string, storeId: number) {
  const type = await db.type.findUnique({
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

  return type;
}
