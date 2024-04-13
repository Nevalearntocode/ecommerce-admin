import getCurrentUser from "@/lib/get-current-user";
import LogOut from "./log-out";
import UserButton from "@/components/user-button";
import { redirect } from "next/navigation";
export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect(`/login`);
  }

  return (
    <>
      <div className="flex gap-x-8 p-40 w-full justify-between">
        <UserButton
          user={{
            email: user.email!,
            name: user.name || "",
            image: user.image || "",
          }}
        />
        <LogOut />
      </div>
    </>
  );
}
