"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { StaffWithUser } from "@/types";
import { getHighestRole } from "@/lib/utils";
import { isOwner } from "@/permissions/permission-hierarchy";
import { roleIconMap } from "./staff-card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import ActionTooltip from "@/components/clients/action-tooltip";

type Props = {
  staffs: StaffWithUser[];
  storeUserId: string;
};

function SearchStaff({ staffs, storeUserId }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const onSelect = useCallback(
    (name: string, role: string) => {
      let currentQuery = {};
      if (searchParams) {
        currentQuery = queryString.parse(searchParams.toString());
      }

      const updateQuery = {
        ...currentQuery,
        name,
        role,
      };

      const url = queryString.stringifyUrl(
        {
          url: pathname,
          query: updateQuery,
        },
        { skipEmptyString: true, skipNull: true },
      );

      router.push(url);
      setOpen(false);
    },
    [pathname, router, searchParams],
  );

  const onClearFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(pathname);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div className="col-span-4 flex w-full items-center sm:w-1/2 md:w-1/3 lg:w-1/4">
        <div
          className="relative flex w-full flex-1 items-center"
          onClick={() => setOpen(true)}
        >
          <Input
            placeholder="Search..."
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <p className="absolute right-2 text-sm text-muted-foreground">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">ctrl</span>k
            </kbd>
          </p>
        </div>
        <ActionTooltip tooltip="Clear filters">
          <Button
            size={`icon`}
            variant={`outline`}
            className="ml-4"
            onClick={onClearFilter}
          >
            <FilterX className="h-4 w-4" />
          </Button>
        </ActionTooltip>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup title="Staff">
            {staffs.map((staff) => (
              <CommandItem
                key={staff.id}
                className="flex justify-between"
                onSelect={() =>
                  onSelect(
                    staff.user.name,
                    isOwner(staff.userId, storeUserId)
                      ? "Owner"
                      : getHighestRole(staff),
                  )
                }
              >
                <p>{staff.user.name}</p>
                <p className="">
                  {isOwner(staff.userId, storeUserId)
                    ? "Owner"
                    : getHighestRole(staff)}
                  <span>
                    {" "}
                    {
                      roleIconMap[
                        isOwner(staff.userId, storeUserId)
                          ? "Owner"
                          : getHighestRole(staff)
                      ]
                    }
                  </span>
                </p>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default SearchStaff;
