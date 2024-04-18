import { db } from "./db";
import getCurrentUser from "./get-current-user";

export async function getCurrentStaff(storeSlug: string) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const staff = await db.staff.findFirst({
    where: {
      userId: user.id,
      store: {
        slug: storeSlug,
      },
    },
  });

  return staff;
}
