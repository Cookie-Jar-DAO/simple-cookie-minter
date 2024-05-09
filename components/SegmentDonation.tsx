// component: TokenGatingSegment
// <TokenGattingFieldSet form={form} />

import React, { useEffect } from "react";
import { SegmentCookieMetaProps } from "./types/CookieTypes";

import { usePublicClient } from "wagmi";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const SegmentDonation: React.FC<SegmentCookieMetaProps<any>> = ({ form }) => {
  const {
    control,
    formState: { isValid },
    watch,
    setValue,
  } = form;

  const publicClient = usePublicClient();
  const chain = publicClient?.chain;

  const donation = watch("donation", false);

  useEffect(() => {
    if (!donation) {
      setValue("donationAmount", "0");
    }
  }, [donation, setValue]);

  return (
    <fieldset className="grid grid-cols-4 gap-6 p-6">
      <div className="col-span-full space-y-2 lg:col-span-1">
        <p className="font-medium">Fund public goods</p>
        <p className="text-xs">
          Donate some crumbles to the devs for feature development
        </p>
      </div>
      <div className="col-span-full grid grid-cols-6 gap-4 lg:col-span-3">
        <FormField
          control={control}
          name="donation"
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
                <FormLabel>
                  {/* @ts-ignore: Will fix chain error */}
                  Donate {chain.nativeCurrency.name} to the devs
                </FormLabel>
                <FormDescription>
                  Public goods are good! Donations allow us to keep building
                  stuff for you!
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {donation && (
          <FormField
            control={control}
            name="donationAmount"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Donation amount</FormLabel>
                <FormControl>
                  <Input placeholder="1" {...field} />
                </FormControl>
                <FormDescription>
                  {/* TODO: fix check check */}
                  {/* @ts-ignore: Will fix chain error */}
                  The amount of {chain.nativeCurrency.name} to donate
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </fieldset>
  );
};

export default SegmentDonation;
