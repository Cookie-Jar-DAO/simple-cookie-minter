// component: TokenGatingSegment
// <TokenGattingFieldSet form={form} />

import React from "react";
import { SegmentCookieMetaProps } from "./types/CookieTypes";
import { useToken } from "wagmi";

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

const SegmentERC721TokenGating: React.FC<SegmentCookieMetaProps<any>> = ({
  form,
}) => {
  const {
    control,
    formState: { isValid },
    watch,
  } = form;

  const { data: erc721Token } = useToken({
    address: watch("erc721Token") as `0x${string}`,
  });

  return (
    <fieldset className="grid grid-cols-4 gap-6 rounded-md bg-amber-100 p-6 shadow-md">
      <div className="col-span-full space-y-2 lg:col-span-1">
        <p className="font-medium">Set ERC721 gating</p>
        <p className="text-xs">
          Provide the address of the ERC721 (NFT) and the threshold balance to
          allow cookie withdrawals.
        </p>
      </div>
      <div className="col-span-full grid grid-cols-6 gap-4 lg:col-span-3">
        <FormField
          control={control}
          name="erc721Token"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>ERC721 Token</FormLabel>
              <FormControl>
                <Input
                  placeholder="0x5f207d42f869fd1c71d7f0f81a2a67fc20ff7323"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The nft token contract that will be used to gate cookie
                withdrawals
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="erc721Threshold"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>ERC721 Threshold</FormLabel>
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

        <Collapsible className="col-span-full">
          <CollapsibleTrigger>✅ Gating token info ✅</CollapsibleTrigger>
          <CollapsibleContent>
            <p>
              <strong>Symbol</strong> {erc721Token?.symbol}
            </p>
            <p>
              <strong>Name</strong> {erc721Token?.name}
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </fieldset>
  );
};

export default SegmentERC721TokenGating;
