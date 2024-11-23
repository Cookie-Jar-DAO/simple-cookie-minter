"use client";

import { Card } from "@/components/ui/card";
import ChainJars from "@/components/chain-jars";
import { supportedChains } from "@/config/endpoint";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useEffect, useState } from "react";
import { SortSettings } from "@/hooks/useGraphData";
import { useAccount } from "wagmi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";

type SortingSelectValues =
  | "cookieAmount-desc"
  | "cookieAmount-asc"
  | "periodLength-asc"
  | "periodLength-desc";

const ChainsList = () => {
  const { isConnected, chainId: userChainId } = useAccount();
  const [isChainValid, setIsChainValid] = useState(true);
  const [sorting, setSorting] = useState<SortSettings>({
    orderBy: "cookieAmount",
    orderDirection: "desc",
  });
  const [filter, setFilter] = useState("");
  const changeSorting = useCallback((val: SortingSelectValues) => {
    const [order, direction] = val.split("-");
    setSorting({
      orderBy: order as SortSettings["orderBy"],
      orderDirection: direction as SortSettings["orderDirection"],
    });
  }, []);

  useEffect(() => {
    if (userChainId && supportedChains.includes(userChainId)) {
      setIsChainValid(true);
    } else {
      setIsChainValid(false);
    }
  }, [userChainId]);

  return (
    <Card className="relative z-20 flex flex-col items-center gap-8 border-none bg-amber-100 p-8 text-center">
      <h1 className="font-gluten text-5xl font-semibold">Jars</h1>
      <div className="mx-2 flex w-full gap-4 px-4">
        <div className="w-[340px]">
          <Select
            onValueChange={changeSorting}
            defaultValue={"cookieAmount-desc"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a CookieJar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cookieAmount-desc">
                Largest cookie stash
              </SelectItem>
              <SelectItem value="cookieAmount-asc">
                Smallest cookie stash
              </SelectItem>
              <SelectItem value="periodLength-asc">
                Shortest claim period
              </SelectItem>
              <SelectItem value="periodLength-desc">
                Longest claim period
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          name="filter"
          placeholder="Search by anything (name, owner, ...)"
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <ScrollArea className="h-[40rem] w-full min-w-[690px] max-w-4xl">
        <div className="flex flex-col gap-2 p-4 pt-0">
          {isConnected && !isChainValid ? (
            "Whoops, we dont support the chain you are connected to just yet :/"
          ) : (
            <ChainJars
              filter={filter}
              sorting={sorting}
              chainId={isConnected ? userChainId : undefined}
            />
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ChainsList;
