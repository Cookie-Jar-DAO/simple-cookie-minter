// component: TokenGatingSegment
// <TokenGattingFieldSet form={form} />
"use client";
import React from "react";
import { SegmentCookieMetaProps } from "./types/CookieTypes";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Form } from "react-hook-form";
import { useDAOData } from "@/app/hooks/useDAOdata";

const SegmentERC721TokenGating: React.FC<SegmentCookieMetaProps<any>> = ({
  form,
}) => {
  const {
    control,
    formState: { isValid },
    watch,
  } = form;

  const { data: daoData } = useDAOData({
    networkId: "0xaa36a7",
    daoAddress: watch("baalDao") as `0x${string}`,
  });

  return (
    <fieldset className="grid grid-cols-4 gap-6 rounded-md bg-amber-100 p-6 shadow-md">
      <div className="col-span-full space-y-2 lg:col-span-1">
        <p className="font-medium">Set DAO gating</p>
        <p className="text-xs">
          Provide the address of the DAO (Moloch V3 Baal) and the threshold
          balance to allow cookie withdrawals.
        </p>
      </div>
      <div className="col-span-full grid grid-cols-6 gap-4 lg:col-span-3">
        <FormField
          control={control}
          name="baalDao"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>DAO Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="0x5f207d42f869fd1c71d7f0f81a2a67fc20ff7323"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The DAO contract that will be used to gate cookie withdrawals
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="baalThreshold"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Total Threshold (Loot and/or Shares)</FormLabel>
              <FormControl>
                <Input placeholder="1" {...field} />
              </FormControl>
              <FormDescription>
                The minimum balance of the ERC721 to allow cookie withdrawals
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* checkbox for use shares */}
        <FormField
          control={control}
          name="baalUseShares"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Use Shares</FormLabel>
              <FormControl>
                <Input type="checkbox" {...field} />
              </FormControl>
              <FormDescription>
                Use shares to gate cookie withdrawals
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* checkbox for use loot */}
        <FormField
          control={control}
          name="baalUseLoot"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Use Loot</FormLabel>
              <FormControl>
                <Input type="checkbox" {...field} />
              </FormControl>
              <FormDescription>
                Use loot to gate cookie withdrawals
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Collapsible className="col-span-full">
          <CollapsibleTrigger>✅ Gating DAO info ✅</CollapsibleTrigger>
          <CollapsibleContent>
            {!daoData?.data?.dao?.name && <p>DAO not found</p>}
            <p>
              <strong>Name</strong> {daoData?.data?.dao?.name}
            </p>
            <p>
              <strong>Member Count</strong>{" "}
              {daoData?.data?.dao?.activeMemberCount}
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </fieldset>
  );
};

export default SegmentERC721TokenGating;
