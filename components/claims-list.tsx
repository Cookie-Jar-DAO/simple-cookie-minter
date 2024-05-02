"use client";

import * as React from "react";
import { ChevronsUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { truncateEthereumAddress } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Claim } from "@/lib/indexer/db";

export function ClaimsList({ claims }: { claims: Claim[] }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">Claims</h4>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-9 p-0 hover:bg-amber-200 focus:ring-4 focus:ring-amber-300"
          >
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <ScrollArea className="w-full max-w-4xl">
          <div className="flex flex-col gap-2 p-4 pt-0">
            {claims.map((claim) => {
              return (
                <Card key={claim.id}>
                  <CardHeader>
                    <CardTitle>{claim.reason.reason}</CardTitle>
                    <CardDescription>
                      {truncateEthereumAddress(claim.receiver)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      {claim.amount}
                      {claim.claimer}
                      {claim.reason.link}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-end">{claim.reason.tag}</div>
                    <div className="ml-auto flex gap-2">
                      <Button
                        className="hover:bg-amber-200 focus:ring-4 focus:ring-amber-300"
                        variant="ghost"
                        size="icon"
                      >
                        <ArrowDown className="h-4 w-4 " />
                      </Button>
                      <Button
                        className="hover:bg-amber-200 focus:ring-4 focus:ring-amber-300"
                        variant="ghost"
                        size="icon"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}
