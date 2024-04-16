import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    inviteCode: string;
    storeSlug: string;
  };
};

const Invite = async ({ params }: Props) => {
  const user = await getCurrentUser();
  console.log(params.storeSlug, params.inviteCode);
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
    return redirect(`/`);
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
