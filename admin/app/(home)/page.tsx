import UserButton from "@/components/user-button";
import getCurrentUser from "@/lib/get-current-user";
import { redirect } from "next/navigation";
import Empty from "./_components/empty";
export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect(`/login`);
  }

  return (
    <>
      <div className="flex h-screen flex-col">
        <div className="flex w-full items-center justify-end border px-12 py-6">
          <UserButton
            user={{
              name: user.name,
              image: user.image,
              email: user.email,
            }}
          />
        </div>
        <div className="flex h-full justify-center pt-40">
          <Empty />
        </div>
      </div>
    </>
  );
}
