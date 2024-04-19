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
