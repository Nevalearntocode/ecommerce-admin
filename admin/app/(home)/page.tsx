import UserButton from "@/components/user-button";
import getCurrentUser from "@/lib/get-current-user";
import { redirect } from "next/navigation";
import Empty from "./_components/empty";
import getUserStore from "@/lib/get-user-store";
export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect(`/login`);
  }

  const stores = await getUserStore(user.id);

  if (stores.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Empty />
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen flex-col">
        <div className="flex w-full items-center justify-end border px-12 py-6">
          <UserButton user={user} />
        </div>
        <div className="flex h-full items-center justify-center">
          <Empty />
        </div>
      </div>
    </>
  );
}
