"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { Address, isAddress } from "viem";
import { z } from "zod";
import { NFTImage } from "./NFTImage";
import { useReachInJar } from "../app/hooks/useReachInJar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface IClaimFromJarFormInput {
  cookieJarAddress: Address;
  cookieMonster: Address;
  reason: string;
}

const ethAddressSchema = z.string().refine((value) => isAddress(value), {
  message:
    "Provided address is invalid. Please insure you have typed correctly.",
});

const schema = z
  .object({
    cookieJarAddress: ethAddressSchema,
    cookieMonster: ethAddressSchema,
    reason: z.string(),
  })
  .required();

const ClaimFromJarForm = ({
  cookieJarAddress,
}: {
  cookieJarAddress: Address;
}) => {
  console.log("cookieJarAddress", cookieJarAddress);
  const { address } = useAccount();
  const form = useForm<IClaimFromJarFormInput>({
    defaultValues: {
      cookieJarAddress,
      cookieMonster: address,
      reason: "COOKIES!",
    },
    resolver: zodResolver(schema),
  });
  const { reachInCookieJar } = useReachInJar();

  const onSubmit: SubmitHandler<IClaimFromJarFormInput> = async (data) => {
    console.log(data);
    const hash = await reachInCookieJar(data);
    // if (form.formState.isValid) {
    //     console.log('isValid', form.formState.isValid)
    //   const hash = await reachInCookieJar(data);
    //   console.log(hash);
    // }
    console.log("hash", hash);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cookieMonster"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cookie Monster</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>The recipient of the cookies.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell me why..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Why do you deserve these tasty treats?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:ring-amber-300"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export { ClaimFromJarForm };
