"use client";

import { Check, ChevronsUpDown, UserCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSelectStaffs } from "@/actions/staff";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { SelectStaffs } from "@/types";

export function StaffSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [staffList, setStaffList] = useState<SelectStaffs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const currentUserId = searchParams.get("userId") || "all";

  useEffect(() => {
    async function fetchStaffs() {
      setIsLoading(true);
      try {
        const result = await getSelectStaffs(debouncedSearch || undefined);
        setStaffList(result);
      } catch (error) {
        console.error("Error fetching staffs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStaffs();
  }, [debouncedSearch]);

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("userId");
    } else {
      params.set("userId", value);
    }

    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  const selectedStaff = staffList.find((staff) => staff.id === currentUserId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between"
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            <UserCircle2 className="h-4 w-4" />
            <span>
              {selectedStaff ? `${selectedStaff.fullName}` : "Tất cả cán bộ"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Tìm kiếm cán bộ..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Đang tìm kiếm..." : "Không tìm thấy cán bộ."}
            </CommandEmpty>
            <CommandGroup>
              <CommandItem value="all" onSelect={() => handleSelect("all")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    currentUserId === "all" ? "opacity-100" : "opacity-0",
                  )}
                />
                Tất cả cán bộ
              </CommandItem>
              {staffList.map((staff) => (
                <CommandItem
                  key={staff.id}
                  value={staff.id}
                  onSelect={() => handleSelect(staff.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentUserId === staff.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{staff.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {staff.phone}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
