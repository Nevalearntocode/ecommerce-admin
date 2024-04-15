import { db } from "./db";
import getCurrentUser from "./get-current-user";

export default async function getUserStoresById(userId: string) {
  const stores = await db.store.findMany({
    where: {
      userId,
    },
  });

  return stores;
}

export async function getUserStoreBySlug(slug: string) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const store = await db.store.findUnique({
    where: {
      userId_slug: {
        userId: user.id,
        slug,
      },
    },
  });

  return store;
}

export async function gerFirstUserStoreById(userId: string) {
  const store = await db.store.findFirst({
    where: {
      userId,
    },
  });

  return store;
}

export async function gerFirstUserStore() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const store = await db.store.findFirst({
    where: {
      userId: user.id,
    },
  });

  return store;
}
