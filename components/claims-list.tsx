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
  cookieJarAddress,
}: {
  claims: Claim[];
  cookieJarAddress: Address;
}) {
  console.log(cookieJarAddress, "cjadd2");

  if (claims.length === 0) {
    return (
      <div className="flex h-10 items-center justify-center text-center">
        <p>No claims yet</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <div className="grid grid-cols-3 items-center justify-items-start">
        <h4 className="text-sm font-semibold">Claims</h4>
        <h4 className="text-sm font-semibold">Reasons</h4>
        <h4 className="text-sm font-semibold"></h4>{" "}
        {/* Placeholder for arrow */}
      </div>
      <ScrollArea className="w-full max-w-4xl">
        <Accordion type="single" collapsible className="w-full">
          {claims.map((claim) => {
            return (
              <AccordionItem key={claim.id} value={claim.id}>
                <AccordionTrigger className="grid w-full grid-cols-3 items-center justify-items-start">
                  <span>{truncateEthereumAddress(claim.receiver)}</span>
                  <span>{claim.reason.reason}</span>
                </AccordionTrigger>
                {/* TODO finish assessment flow. Needs to have accumulator for yes & no vote count */
                /* <AccordionContent>
                  <div className="flex items-center justify-between">
                    <AssessmentDialog
                      claimId={claim.id}
                      cookieJarAddress={cookieJarAddress}
                    />
                  </div>
                </AccordionContent> */}
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
