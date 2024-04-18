import { db } from "./db";

export async function getCategoryByStoreSlugAndCategorySlug(
  storeSlug: string,
  categorySlug: string,
) {
  const existingStore = await db.store.findUnique({
    where: {
      slug: storeSlug,
    },
    select: {
      id: true,
    },
  });

  if (!existingStore) {
    return null;
  }

  const category = await db.category.findUnique({
    where: {
      slug_storeId: {
        storeId: existingStore.id,
        slug: categorySlug,
      },
    },
    include: {
      billboard: {
        select: {
          name: true,
        },
      },
    },
  });

  return category;
}
