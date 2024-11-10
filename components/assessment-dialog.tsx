"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { CookieJarCore } from "@/abis/CookieJarCore";
import { type Address } from "viem";
import { type FC, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const assessmentSchema = z.object({
  comment: z.string().optional(),
  isGood: z.boolean(),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

interface AssessmentDialogProps {
  claimId: string;
  cookieJarAddress: Address;
}

export const AssessmentDialog: FC<AssessmentDialogProps> = ({ 
  claimId, 
  cookieJarAddress 
}) => {
  const { address } = useAccount();
  const { toast } = useToast();
  
  // Check if user can assess
  const { data: canAssess, isLoading: isCheckingPermission } = useReadContract({
    address: cookieJarAddress,
    abi: CookieJarCore,
    functionName: "canClaim",
    args: [address],
    query: {
      enabled: !!address && !!cookieJarAddress,
    },
  }) as { data: boolean | undefined, isLoading: boolean };

  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      comment: "",
      isGood: true,
    },
  });
  
  const { writeContract, data: hash } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const onSubmit = async (data: AssessmentFormValues) => {
    if (!canAssess) {
      toast({
        variant: "destructive",
        title: "Not authorized",
        description: "You don't have permission to assess cookie usage",
      });
      return;
    }

    try {
      writeContract({
        address: cookieJarAddress,
        abi: CookieJarCore,
        functionName: "assessReason",
        args: [claimId, data.isGood],
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to submit assessment",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Assessment submitted",
        description: "Your assessment has been recorded on-chain",
      });
    }
  }, [isConfirmed, toast]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isCheckingPermission ? (
          <Button variant="ghost" disabled>
            Checking permissions...
          </Button>
        ) : !canAssess ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-not-allowed">
                  <Button variant="ghost" disabled>
                    Rate Cookie Use
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>You are not authorized to assess cookie usage</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button 
            variant="ghost"
            className="hover:bg-amber-200 focus:ring-4 focus:ring-amber-300"
          >
            Rate Cookie Use
          </Button>
        )}
      </DialogTrigger>

      {canAssess && !isCheckingPermission && (
        <DialogContent className="bg-amber-100">
          <DialogHeader>
            <DialogTitle>Assess Cookie Usage</DialogTitle>
            <DialogDescription>
              Was this a good use of cookies?
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Why was this a good/bad use of cookies?"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button 
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => form.setValue('isGood', true)}
                >
                  Good Use
                </Button>
                <Button 
                  type="submit"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => form.setValue('isGood', false)}
                >
                  Bad Use
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
};