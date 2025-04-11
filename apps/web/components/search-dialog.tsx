"use client";

import { useSearch } from "@/hooks/use-search";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Newspaper, Search, Users } from "lucide-react";
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
      <DialogContent
        className="border-none w-[400px] md:w-[500px] lg:w-[600px] -translate-y-44 bg-transparent shadow-none dark:bg-transparent backdrop-blur-none"
        hidden={true}
      >
        <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-md border-none">
          <Search className="absolute left-2" />
          <Input
            placeholder="Search posts or workspaces"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-10 py-6 border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none focus:shadow-[0_0_15px_10px] focus:shadow-blue-500/50 transition-all duration-250"
          />
        </div>
        <div className="overflow-y-scroll max-h-48 space-y-2 py-2 scrollbar-hide">
          {(searchTerm ? searchResults : initialResults)?.map((x, index) => {
            const content = x.content?.find(
              (x: any) => x.type === "paragraph" && x.content.length
            )?.content[0].text;
            const shortenedContent =
              content?.length > 50
                ? content?.substring(0, 50).concat("...")
                : content;
            return (
              <Link
                key={index}
                href={`${x.content ? "/documents/" : "/workspaces/"}${x.id}`}
                className="block bg-white dark:bg-background border-blue-500/50 border-[1px] p-4 rounded-md transform transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex flex-col space-x-3 py-2">
                  <div className="flex items-center space-x-3">
                    {x.content ? (
                      <Newspaper className="h-4 w-4" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                    <div>{x.name}</div>
                  </div>
                  {shortenedContent && (
                    <div className="w-fit mt-4 translate-x-4">
                      {shortenedContent}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
