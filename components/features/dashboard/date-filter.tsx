"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DateFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fromParam = searchParams.get("startDate");
  const toParam = searchParams.get("endDate");

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: fromParam ? new Date(fromParam) : undefined,
    to: toParam ? new Date(toParam) : undefined,
  });

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);

    // Auto-apply filter when date is selected
    const params = new URLSearchParams(searchParams.toString());
    if (selectedDate?.from) {
      params.set("startDate", selectedDate.from.toISOString());
    } else {
      params.delete("startDate");
    }

    if (selectedDate?.to) {
      params.set("endDate", selectedDate.to.toISOString());
    } else {
      params.delete("endDate");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "dd/MM/yyyy")} -{" "}
                {format(date.to, "dd/MM/yyyy")}
              </>
            ) : (
              format(date.from, "dd/MM/yyyy")
            )
          ) : (
            <span>Chọn khoảng ngày</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          selected={date}
          onSelect={handleDateSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
