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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export function ClaimsList({ claims }: { claims: Claim[] }) {
  if (claims.length === 0) {
    return (
      <div className="flex h-10 items-center justify-center text-center">
        {/* TODO: add better image for no claims */}
        <p>No claims yet</p>
      </div>
    );
  }
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">Claims</h4>
      </div>
      <ScrollArea className="w-full max-w-4xl">
        <Accordion type="single" collapsible className="w-full">
          {claims.map((claim, index) => {
            return (
              <AccordionItem key={claim.id} value={claim.id}>
                <AccordionTrigger>{claim.receiver}</AccordionTrigger>
                <AccordionContent className="flex">
                  <p>{claim.reason.reason}</p>
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
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
