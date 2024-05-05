import getCurrentUser from "@/data/get-current-user";
import { gerFirstUserStoreById } from "@/data/get-stores";
import { redirect } from "next/navigation";
import HomePage from "./_components/home";
export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const store = await gerFirstUserStoreById(user.id);

  if (!store) {
    return <HomePage />;
  }

  return redirect(`/${store.slug}`);
}
