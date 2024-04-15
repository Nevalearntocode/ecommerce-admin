"use client";

import React, { useEffect, useState } from "react";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronsUpDown,
  Laptop,
  Plus,
  Shirt,
  StoreIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import useModal from "@/hooks/use-modal-store";

type Props = {
  stores: Store[];
};

const StoreSwitcher = ({ stores }: Props) => {
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  // const stores = useStore((state) => state.stores);
  // const refetchStores = useStore((state) => state.refetchStores);

  const params = useParams();
  const router = useRouter();
  const { open } = useModal();

  const currentStore = stores.find((store) => store.slug === params.storeSlug);

  const onStoreSelect = (storeSlug: string) => {
    setIsComboboxOpen(false);
    router.push(`/${storeSlug}`);
  };

  return (
    <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={`ghost`}
          size={"sm"}
          className="min-w-[200px] justify-between"
        >
          {currentStore ? (
            <>
              {currentStore.type === "CLOTHING" && (
                <Shirt className="mr-2 h-4 w-4" />
              )}
              {currentStore.type === "TECHNOLOGY" && (
                <Laptop className="mr-2 h-4 w-4" />
              )}
              <p className="mr-2">{currentStore?.name}</p>
            </>
          ) : (
            <>
              <StoreIcon className="mr-2 h-4 w-4" />
              <p className="mr-2">Select a store</p>
            </>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No stores found.</CommandEmpty>
            <CommandGroup heading="Store">
              {stores.map((store) => (
                <CommandItem
                  className=""
                  key={store.id}
                  onSelect={() => onStoreSelect(store.slug)}
                >
                  {store.type === "CLOTHING" && (
                    <Shirt className="mr-2 h-4 w-4" />
                  )}
                  {store.type === "TECHNOLOGY" && (
                    <Laptop className="mr-2 h-4 w-4" />
                  )}
                  {store.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.name === store.name
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem onSelect={() => open("createStore")}>
                {/* <Button className="w-full" variant={`ghost`} size={"sm"}> */}
                Create a new store
                <Plus className="ml-auto h-4 w-4" />
                {/* </Button> */}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
