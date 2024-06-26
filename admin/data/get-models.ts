import { db } from "../lib/db";

export async function getModelById(modelId: string) {
  const id = Number(modelId);

  if (!id) {
    return null;
  }

  const model = await db.model.findUnique({
    where: {
      id,
    },
  });

  return model;
}

export async function getModelIdByNameAndStoreId(
  name: string,
  storeId: number,
) {
  const model = await db.model.findUnique({
    where: {
      name_storeId: {
        name,
        storeId,
      },
    },
    select: {
      id: true,
    },
  });

  return model;
}
