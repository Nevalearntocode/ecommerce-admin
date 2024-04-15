import getCurrentUser from "@/lib/get-current-user";
import Empty from "../../components/empty";
import { gerFirstUserStoreById } from "@/lib/get-user-stores";
export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const store = await gerFirstUserStoreById(user.id);

  if (!store) {
    return <Empty label="You don't have any store yet." />;
  }

  return (
    <>
      <div className="flex h-screen flex-col"></div>
    </>
  );
}
