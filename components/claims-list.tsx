import * as React from "react";
import { truncateEthereumAddress } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Claim } from "@/lib/indexer/db";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { AssessmentDialog } from "./assessment-dialog";
import { type Address } from "viem";

export function ClaimsList({ 
  claims,
  cookieJarAddress 
}: { 
  claims: Claim[];
  cookieJarAddress: Address;
}) {
  console.log(cookieJarAddress,"cjadd2");
  
  if (claims.length === 0) {
    return (
      <div className="flex h-10 items-center justify-center text-center">
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
          {claims.map((claim) => {
            return (
              <AccordionItem key={claim.id} value={claim.id}>
                <AccordionTrigger>
                  {truncateEthereumAddress(claim.receiver)}
                  <p>{claim.reason.reason}</p>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center justify-between">
                    <AssessmentDialog 
                      claimId={claim.id} 
                      cookieJarAddress={cookieJarAddress}
                    />
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
