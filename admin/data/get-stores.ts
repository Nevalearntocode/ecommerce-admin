import { db } from "../lib/db";
import getCurrentUser from "./get-current-user";

export async function getStoreWithCurrentStaffLayout(storeSlug: string) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const store = await db.store.findUnique({
    where: {
      slug: storeSlug,
    },
    include: {
      staffs: {
        where: {
          userId: user.id,
        },
      },
    },
  });

  return store;
}

export default async function getUserStoresById(userId: string) {
  const stores = await db.store.findMany({
    where: {
      OR: [
        { userId },
        {
          staffs: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    include: {
      staffs: {
        where: {
          userId,
        },
      },
    },
  });

  return stores;
}

export async function getStoreWithCurrentStaff(slug: string, userId: string) {
  const store = await db.store.findUnique({
    where: {
      slug,
    },
    include: {
      staffs: {
        where: {
          userId,
        },
      },
    },
  });

  return store;
}

export async function getStoreToCreateProduct(
  slug: string,
  userId: string,
  productName: string,
  categoryName: string,
) {
  const store = await db.store.findUnique({
    where: {
      slug,
    },
    include: {
      staffs: {
        where: {
          userId,
        },
      },
      products: {
        where: {
          name: productName,
        },
        select: {
          slug: true,
        },
      },
      categories: {
        where: {
          name: categoryName,
        },
        select: {
          id: true,
        },
      },
    },
  });

  return store;
}

export async function getUserStoreBySlug(slug: string) {
  const store = await db.store.findUnique({
    where: {
      slug,
    },
    include: {
      staffs: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return store;
}

export async function gerFirstUserStoreById(userId: string) {
  const store = await db.store.findFirst({
    where: {
      OR: [
        { userId },
        {
          staffs: {
            some: {
              userId,
            },
          },
        },
      ],
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
      OR: [
        {
          userId: user.id,
        },
        {
          staffs: {
            some: {
              userId: user.id,
            },
          },
        },
      ],
    },
  });

  return store;
}

export async function getCategoryAndClothingFieldsInStore(id: number) {
  const store = await db.store.findUnique({
    where: {
      id,
    },
    include: {
      categories: {
        select: {
          name: true,
        },
      },
      sizes: {
        select: {
          name: true,
        },
      },
      colors: {
        select: {
          name: true,
          value: true,
        },
      },
    },
  });

  return {
    categories: store?.categories,
    sizes: store?.sizes,
    colors: store?.colors,
  };
}

export async function getCategoryAndTechnologyFieldsInStore(id: number) {
  const store = await db.store.findUnique({
    where: {
      id,
    },
    include: {
      categories: {
        select: {
          name: true,
        },
      },
      models: {
        select: {
          name: true,
        },
      },
      types: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    categories: store?.categories,
    models: store?.models,
    types: store?.types,
  };
}
