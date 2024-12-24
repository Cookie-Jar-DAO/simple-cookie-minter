// component: TokenGatingSegment
// <TokenGattingFieldSet form={form} />

import type React from "react";
import type { SegmentCookieMetaProps } from "./types/CookieTypes";

import { useAccount, useBalance } from "wagmi";

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
import { Textarea } from "@/components/ui/textarea";
import { NFTImage } from "@/components/NFTImage";
import { ZERO_ADDRESS } from "@/app/constants";
import { TokenInput } from "./ui/token-input";
import { TimePeriodInput } from "./ui/time-period-input";

const SegmentCookieMeta: React.FC<SegmentCookieMetaProps<any>> = ({ form }) => {
  const {
    control,
    formState: { isValid },
    watch,
    setError,
    setValue,
    clearErrors,
  } = form;

  const { address } = useAccount();
  const { data: cookieToken } = useBalance({
    address,
    token:
      watch("cookieToken") === ZERO_ADDRESS
        ? undefined
        : (watch("cookieToken") as `0x${string}`),
  });

  return (
    <fieldset className="grid grid-cols-4 gap-6 p-6">
      <div className="col-span-full space-y-2 lg:col-span-1">
        <p className="font-medium">Cookie Jar config</p>
        <p className="text-xs">
          Please provide the following information to create your cookie jar.
        </p>
        <NFTImage />
      </div>

      <div className="col-span-full grid grid-cols-6 gap-4 lg:col-span-3">
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
                <TimePeriodInput
                  initialInterval="days"
                  onChangeAmount={(val) => setValue("cookiePeriod", val)}
                  initialValue={field.value}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The time between cookie distributions ({field.value.toString()}{" "}
                seconds)
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
                <TokenInput
                  setError={(val) => {
                    setError("cookieAmount", {
                      type: "custom",
                      message: val,
                    });
                  }}
                  clearError={() => clearErrors("cookieAmount")}
                  onChangeAmount={(val) => setValue("cookieAmount", val)}
                  initialValue={field.value}
                  decimalPlaces={cookieToken?.decimals}
                  symbol={cookieToken?.symbol ?? ""}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The amount of cookies to distribute ({field.value.toString()}{" "}
                WEI)
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
};

export default SegmentCookieMeta;
