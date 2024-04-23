import getCurrentUser from "@/data/get-current-user";
import Empty from "../../components/mainpages/empty";
import { gerFirstUserStoreById } from "@/data/get-stores";
import { redirect } from "next/navigation";
export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const store = await gerFirstUserStoreById(user.id);

  if (!store) {
    return <Empty label="You don't have any store yet." />;
  }

  return redirect(`/${store.slug}`);
}
