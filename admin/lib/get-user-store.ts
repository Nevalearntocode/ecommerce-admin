import { db } from "./db";

export default async function getUserStore(userId: number) {
  const stores = await db.store.findMany({
    where: {
      userId,
    },
  });

  return stores;
}
