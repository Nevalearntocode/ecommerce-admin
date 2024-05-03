"use client";

import { ClothingProduct, SafeUser, StoreWithChildren, TechnologyProduct } from "@/types";
import { createContext, useContext } from "react";

type StoreContextType = {
  store: StoreWithChildren;
  user: SafeUser;
  products: (ClothingProduct | TechnologyProduct)[]
};

type StoreContextProviderProps = {
  children: React.ReactNode;
  data: StoreContextType
};

export const StoreContext = createContext<StoreContextType | null>(null);

export default function StoreContextProvider({
  children,
  data: { store, user, products },
}: StoreContextProviderProps) {
  return (
    <StoreContext.Provider
      value={{
        store,
        user,
        products
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => {
  const storeContext = useContext(StoreContext);
  if (!storeContext || !storeContext.store || !storeContext.user || !storeContext.products) {
    throw new Error(
      "useStoreContext must be used within a StoreContextProvider",
    );
  }
  return storeContext;
};
