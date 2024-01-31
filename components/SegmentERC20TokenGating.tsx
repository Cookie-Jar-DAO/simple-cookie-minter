// component: TokenGatingSegment
// <TokenGattingFieldSet form={form} />

import React from 'react';
import { SegmentCookieMetaProps } from './types/CookieTypes';
import {  useToken } from "wagmi";

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

const SegmentERC20TokenGating: React.FC<SegmentCookieMetaProps<any>> = ({ form }) => {


    const {
        control,
        formState: { isValid },
        watch,
      } = form;

      const { data: erc20Token } = useToken({
        address: watch("erc20Token") as `0x${string}`,
      });

    return (
        <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-md dark:bg-gray-900">
        <div className="space-y-2 col-span-full lg:col-span-1">
          <p className="font-medium">Set ERC20 gating</p>
          <p className="text-xs">
            Provide the address of the ERC20 and the threshold balance to
            allow cookie withdrawals.
          </p>
        </div>
        <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
          <FormField
            control={control}
            name="erc20Token"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>ERC20 Token</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0x5f207d42f869fd1c71d7f0f81a2a67fc20ff7323"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The token that will be used to gate cookie withdrawals
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="erc20Threshold"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>ERC20 Threshold</FormLabel>
                <FormControl>
                  <Input placeholder="1" {...field} />
                </FormControl>
                <FormDescription>
                  The minimum balance of the ERC20 to allow cookie withdrawals
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Collapsible className="col-span-full">
            <CollapsibleTrigger>✅ Gating token info ✅</CollapsibleTrigger>
            <CollapsibleContent>
              <p>
                <strong>Symbol</strong> {erc20Token?.symbol}
              </p>
              <p>
                <strong>Decimals</strong> {erc20Token?.decimals}
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </fieldset>
    );
    }

export default SegmentERC20TokenGating;