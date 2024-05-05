import getCurrentUser from "@/data/get-current-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import InvalidLink from "./invalid-link";

type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const JoinStore = async ({ searchParams }: Props) => {
  const slug = searchParams.store as string;
  const inviteCode = searchParams.invite as string;

  if (!slug || !inviteCode) {
    return <InvalidLink label="Invalid store slug or invite code" />;
  }

  const user = await getCurrentUser();
  if (!user) {
    return redirect(`/login`);
  }

  const store = await db.store.findUnique({
    where: {
      inviteCode: inviteCode,
      slug,
    },
    include: {
      staffs: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!store) {
    return <InvalidLink label="Store not found or invite code expired" />;
  }

  if (store.userId === user.id) {
    return redirect(`/${store.slug}`);
  }

  if (store.staffs.some((staff) => staff.userId === user.id)) {
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
          canManageProduct: true,
        },
      },
    },
  });

  return redirect(`/${store.slug}`);
};

export default JoinStore;
