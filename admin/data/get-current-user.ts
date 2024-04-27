import { auth } from "@/app/api/auth/[...nextauth]/options";
import { db } from "../lib/db";

export default async function getCurrentUser() {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}
