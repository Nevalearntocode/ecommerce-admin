import { getUserStoreBySlug } from "@/lib/get-user-stores";
import React from "react";
import Empty from "../../../components/empty";
import ManageMemberForm from "./manage-member-form";

type Props = {
  params: {
    storeSlug: string;
  };
};

const StorePage = async ({ params }: Props) => {
  const store = await getUserStoreBySlug(params.storeSlug);

  if (!store) {
    return (
      <Empty
        label={`You don't have any store with slug: ${decodeURIComponent(params.storeSlug)}`}
      />
    );
  }

  return (
    <div>
      <div className="mt-6 grid grid-cols-1 gap-8 p-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {store.staffs
          // .filter((staff) => staff.userId !== store.userId)
          .map((staff) => (
            <div key={staff.id}>
              <ManageMemberForm staff={staff} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default StorePage;
