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
  });

  return billboard;
}
