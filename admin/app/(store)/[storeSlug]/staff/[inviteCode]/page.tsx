import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import { redirect } from "next/navigation";
import InvalidLink from "./invalid-link";

type Props = {
  params: {
    inviteCode: string;
    storeSlug: string;
  };
};

const Invite = async ({ params }: Props) => {
  const user = await getCurrentUser();
  if (!user) {
    return redirect(`/login`);
  }

  const store = await db.store.findUnique({
    where: {
      inviteCode: params.inviteCode,
      slug: params.storeSlug,
    },
  });

  if (!store) {
    return <InvalidLink label="Store not found or invite code expired" />;
  }

  if (store.userId === user.id) {
    return redirect(`/${store.slug}`);
  }

  await db.store.update({
    where: {
      slug: store.slug,
      inviteCode: store.inviteCode,
    },
    data: {
      staffs: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  return redirect(`/${store.slug}`);
};

export default Invite;
