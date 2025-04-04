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
      <DialogContent className="max-w-96 sm:max-w-[500px] md:max-w-[650px] h-[450px] p-0 pb-5 overflow-y-scroll rounded-xl border-0 shadow-[0_0_1rem_rgba(0,0,0,0.1)] dark:shadow-[0_0_1rem_rgba(255,255,255,0.1)] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <DialogHeader className="sticky top-0 z-50 h-fit bg-gradient-to-b from-white via-white to-white/80 dark:from-gray-900 dark:via-gray-900 dark:to-slate-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-8 py-8">
          <DialogTitle className="text-4xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Search
          </DialogTitle>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 transition-colors duration-200 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400" />
            <Input
              placeholder="Search documents or workspaces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 pl-12 pr-4 text-lg bg-gray-50/50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-800 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-400/20 focus-visible:border-blue-500 dark:focus-visible:border-blue-400 focus-visible:ring-offset-0 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:text-base"
            />
          </div>
        </DialogHeader>
        <div className="space-y-4 mt-4 px-4">
          {(searchTerm ? searchResults : initialResults)?.map(
            (searchResult, index) => {
              const content = searchResult.content?.find(
                (x: any) => x.type === "paragraph" && x.content.length
              )?.content[0].text;
              const shortenedContent =
                content?.length > 50
                  ? content?.substring(0, 50).concat("...")
                  : content;

              return (
                <Link
                  key={index}
                  href={`${searchResult.content ? "/documents/" : "/workspaces/"}${searchResult.id}`}
                  className="block transform transition-all duration-200 hover:-translate-y-1"
                >
                  <Card className="rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-400/5 bg-white dark:bg-gray-900 transition-all duration-200">
                    <CardHeader className="p-6">
                      <CardTitle className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {searchResult?.emoji ?? "📓"}
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {searchResult?.name}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    {shortenedContent && (
                      <CardContent className="px-6 pb-6 pt-0 text-gray-500 dark:text-gray-400">
                        {shortenedContent}
                      </CardContent>
                    )}
                  </Card>
                </Link>
              );
            }
          )}
        </div>
        {(searchTerm ? searchResults : initialResults)?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[300px] text-center px-4">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try searching with different keywords
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
