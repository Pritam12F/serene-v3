"use client";

import { useSearch } from "@/hooks/use-search";
import { Card, CardHeader, CardTitle } from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { initialResults, searchResults } = useSearch(searchTerm);

  return (
    <Dialog
      open={isSearchOpen}
      onOpenChange={(e) => {
        if (!e) {
          setIsSearchOpen(false);
          router.push("/documents");
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] py-0 h-[300px] [&>button]:hidden overflow-y-scroll">
        <DialogHeader className="sticky py-10 top-0 h-[160px] bg-white dark:bg-black">
          <DialogTitle className="text-2xl mb-3">Search</DialogTitle>
          <Input
            placeholder="Search documents or workspaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-24"
          />
        </DialogHeader>
        {!searchResults &&
          initialResults?.map((searchResult) => {
            return (
              <Link
                href={`${searchResult.content ? "/documents/" : "/workspaces/"}${searchResult.id}`}
              >
                <Card>
                  <CardHeader className="flex flex-row">
                    <span>{searchResult?.emoji}</span>
                    <CardTitle>{searchResult?.name}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        {searchResults &&
          searchResults?.map((searchResult) => {
            return (
              <Link
                href={`${searchResult.content ? "/documents/" : "/workspaces/"}${searchResult.id}`}
              >
                <Card>
                  <CardHeader className="flex flex-row">
                    <span>{searchResult?.emoji}</span>
                    <CardTitle>{searchResult?.name}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
      </DialogContent>
    </Dialog>
  );
}
