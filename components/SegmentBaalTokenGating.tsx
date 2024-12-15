// component: TokenGatingSegment
// <TokenGattingFieldSet form={form} />
"use client";
import type React from "react";
import type { SegmentCookieMetaProps } from "@/components/types/CookieTypes";

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
import { useDAOData } from "@/hooks/useDAOdata";
import { Checkbox } from "@/components/ui/checkbox";
import { TokenInput } from "./ui/token-input";
import { sepolia } from "wagmi/chains";

const SegmentERC721TokenGating: React.FC<SegmentCookieMetaProps<any>> = ({
  form,
}) => {
  const {
    control,
    formState: { isValid },
    watch,
    setError,
    clearErrors,
    setValue,
  } = form;

  const { data: daoData } = useDAOData({
    networkId: "0xaa36a7",
    daoAddress: watch("baalDao") as `0x${string}`,
  });

  return (
    <fieldset className="grid grid-cols-4 gap-6 p-6">
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
                <TokenInput
                  setError={(val) => {
                    setError("baalThreshold", {
                      type: "custom",
                      message: val,
                    });
                  }}
                  clearError={() => clearErrors("baalThreshold")}
                  onChangeAmount={(val) => {
                    setValue("baalThreshold", val);
                  }}
                  initialValue={field.value}
                  decimalPlaces={sepolia.nativeCurrency.decimals}
                  symbol={sepolia.nativeCurrency.symbol}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The minimum balance of the ERC721 to allow cookie withdrawals (
                {field.value.toString()} WEI)
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
            <FormItem className="col-span-full flex flex-row items-start space-x-3 space-y-0 p-4">
              <FormControl>
                <Checkbox
                  onCheckedChange={(checked) => {
                    return checked
                      ? field.onChange(true)
                      : field.onChange(false);
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Use Shares</FormLabel>
                <FormDescription>
                  Use shares to gate cookie withdrawals
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* checkbox for use loot */}
        <FormField
          control={control}
          name="baalUseLoot"
          render={({ field }) => (
            <FormItem className="col-span-full flex flex-row items-start space-x-3 space-y-0 p-4">
              <FormControl>
                <Checkbox
                  onCheckedChange={(checked) => {
                    return checked
                      ? field.onChange(true)
                      : field.onChange(false);
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Use Loot</FormLabel>

                <FormDescription>
                  Use loot to gate cookie withdrawals
                </FormDescription>
              </div>
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
