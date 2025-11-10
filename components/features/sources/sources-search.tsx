"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export function SourcesSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) {
      params.set("q", debouncedSearch);
      params.set("page", "1");
    } else {
      params.delete("q");
    }

    if (!params.has("limit")) {
      params.set("limit", "10");
    }

    router.push(`?${params.toString()}`);
  }, [debouncedSearch, router, searchParams]);

  const currentSearch = searchParams.get("q") || "";

  const handleClear = () => {
    setSearch("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    if (!params.has("limit")) {
      params.set("limit", "10");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Tìm kiếm nguồn tin..."
        className="pl-9 pr-9"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {currentSearch && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

