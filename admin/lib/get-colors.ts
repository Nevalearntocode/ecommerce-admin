import { db } from "./db";

export async function getColorById(colorId: string) {
  const id = Number(colorId);

  if (!id) {
    return null;
  }

  const color = await db.color.findUnique({
    where: {
      id,
    },
  });

  return color;
}

export async function getColorByNameAndStoreId(name: string, storeId: number) {
  const color = await db.color.findUnique({
    where: {
      name_storeId: {
        name,
        storeId,
      },
    },
  });

  return color;
}
