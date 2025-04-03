"use client";

import { useSearch } from "@/hooks/use-search";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchDialog() {
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
      <DialogContent className="max-w-96 sm:max-w-[500px] md:max-w-[650px] h-[350px] p-0 pb-5 overflow-y-scroll rounded-2xl border shadow-2xl bg-background/95">
        <DialogHeader className="sticky top-0 z-50 h-fit bg-background/95 backdrop-blur-2xl border-b px-8 py-6">
          <DialogTitle className="text-3xl font-bold tracking-tight mb-4">
            Search
          </DialogTitle>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 h-5 w-5 transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search documents or workspaces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-12 pr-4 text-lg bg-background/80 border-2 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:ring-offset-0 transition-all placeholder:text-muted-foreground/60 placeholder:text-sm"
            />
          </div>
        </DialogHeader>
        {searchTerm &&
          searchResults?.map((searchResult, index) => {
            const content = searchResult.content?.find(
              (x: any) => x.type === "paragraph" && x.content.length
            ).content[0].text;
            const shortenedContent =
              content?.length > 50
                ? content?.substring(0, 50).concat("...")
                : content;

            return (
              <Link
                key={index}
                href={`${searchResult.content ? "/documents/" : "/workspaces/"}${searchResult.id}`}
              >
                <Card className="rounded-sm mx-10 hover:scale-105 duration-250 shadow-sm hover:shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex space-x-4">
                      <div>{searchResult?.emoji ?? "📓"}</div>
                      <div>{searchResult?.name}</div>
                    </CardTitle>
                  </CardHeader>
                  {shortenedContent && (
                    <CardContent>{shortenedContent}</CardContent>
                  )}
                </Card>
              </Link>
            );
          })}
        {!searchTerm &&
          initialResults?.map((searchResult, index) => {
            const content = searchResult.content?.find(
              (x: any) => x.type === "paragraph" && x.content.length
            ).content[0].text;
            const shortenedContent =
              content?.length > 50
                ? content?.substring(0, 50).concat("...")
                : content;

            return (
              <Link
                key={index}
                href={`${searchResult.content ? "/documents/" : "/workspaces/"}${searchResult.id}`}
              >
                <Card className="rounded-sm mx-10 hover:scale-105 duration-250 shadow-sm hover:shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex space-x-4">
                      <div>{searchResult?.emoji ?? "📓"}</div>
                      <div>{searchResult?.name}</div>
                    </CardTitle>
                  </CardHeader>
                  {shortenedContent && (
                    <CardContent>{shortenedContent}</CardContent>
                  )}
                </Card>
              </Link>
            );
          })}
      </DialogContent>
    </Dialog>
  );
}
