import { db } from "./db";

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

export async function getModelByNameAndStoreId(name: string, storeId: number) {
  const model = await db.model.findUnique({
    where: {
      name_storeId: {
        name,
        storeId,
      },
    },
  });

  return model;
}
