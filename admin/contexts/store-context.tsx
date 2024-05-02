"use client";

import { SafeUser, StoreWithChildren } from "@/types";
import { createContext, useContext } from "react";

type StoreContextType = {
  store: StoreWithChildren;
  user: SafeUser;
};

type StoreContextProviderProps = {
  children: React.ReactNode;
  data: StoreContextType
};

export const StoreContext = createContext<StoreContextType | null>(null);

export default function StoreContextProvider({
  children,
  data: { store, user },
}: StoreContextProviderProps) {
  return (
    <StoreContext.Provider
      value={{
        store,
        user,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => {
  const storeContext = useContext(StoreContext);
  if (!storeContext || !storeContext.store || !storeContext.user) {
    throw new Error(
      "useStoreContext must be used within a StoreContextProvider",
    );
  }
  return storeContext;
};
