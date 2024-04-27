import getCurrentUser from "@/data/get-current-user";
import { SafeUser } from "@/types";
import { create } from "zustand";

interface StoreState {
  user: SafeUser | null;
  fetchUser: () => Promise<void>;
}

const useStore = create<StoreState>((set) => ({
  user: null,
  fetchUser: async () => {
    const user = await getCurrentUser();
    console.log(user)
    set({ user });
  },
}));

export default useStore;
