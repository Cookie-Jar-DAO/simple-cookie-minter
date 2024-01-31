// component: TokenGatingSegment
// <TokenGattingFieldSet form={form} />

import React from 'react';
import { ICreateJarFormInput } from './types/CookieTypes';

import { useAccount, useBalance, useToken } from "wagmi";

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
import { UseFormReturn } from 'react-hook-form';
import { Textarea } from './ui/textarea';
import { NFTImage } from './NFTImage';
import { ZERO_ADDRESS } from '@/app/constants';


const SegmentCookieMeta = (
    {
        form
    }: {
        form: UseFormReturn<ICreateJarFormInput>;
    }
) => {
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { isValid },
    watch,
    setValue,
  } = form;

  const { address } = useAccount();
  const { data: cookieToken } = useBalance({
    address,
    token:
      watch("cookieToken") === ZERO_ADDRESS
        ? undefined
        : (watch("cookieToken") as `0x${string}`),
  });



      const { data: erc20Token } = useToken({
        address: watch("erc20Token") as `0x${string}`,
      });

    return (
      <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-md dark:bg-gray-900">
      <div className="space-y-2 col-span-full lg:col-span-1">
        <p className="font-medium">Cookie Jar config</p>
        <p className="text-xs">
          Please provide the following information to create your cookie
          jar.
        </p>
        <NFTImage />
      </div>

      <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
        <FormField
          control={control}
          name="receiver"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Receiver</FormLabel>
              <FormControl>
                <Input
                  placeholder={address}
                  defaultValue={address}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This will be the owner of the cookie jar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="DAO Crumbles" {...field} />
              </FormControl>
              <FormDescription>
                This will be the name of the cookie jar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="nom nom nom" {...field} />
              </FormControl>
              <FormDescription>
                This will be the description of the cookie jar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="link"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="cookiemonster.com" {...field} />
              </FormControl>
              <FormDescription>
                External link. For example the org website
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cookiePeriod"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Cookie period</FormLabel>
              <FormControl>
                <Input placeholder="86400" {...field} />
              </FormControl>
              <FormDescription>
                The time in seconds between cookie distributions
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cookieToken"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Cookie Token</FormLabel>
              <FormControl>
                <Input placeholder="0x0" {...field} />
              </FormControl>
              <FormDescription>
                The token that will be used to distribute cookies
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cookieAmount"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Cookie amount</FormLabel>
              <FormControl>
                <Input placeholder="1" {...field} />
              </FormControl>
              <FormDescription>
                The amount of cookies to distribute
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Collapsible className="col-span-full">
          <CollapsibleTrigger>🍪 Cookie token info 🍪</CollapsibleTrigger>
          <CollapsibleContent>
            <p>
              <strong>Symbol</strong> {cookieToken?.symbol}
            </p>
            <p>
              <strong>Decimals</strong> {cookieToken?.decimals}
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </fieldset>
    );
    }

export default SegmentCookieMeta;