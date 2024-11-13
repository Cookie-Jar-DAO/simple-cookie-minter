"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { type Address, isAddress } from "viem";
import { z } from "zod";
import { NFTImage } from "./NFTImage";
import { useReachInJar } from "@/hooks/useReachInJar";
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

const ethAddressSchema = z.string().refine((value) => isAddress(value), {
  message:
    "Provided address is invalid. Please insure you have typed correctly.",
});

export const CookieClaimSchema = z
  .object({
    cookieJarAddress: ethAddressSchema,
    cookieMonster: ethAddressSchema,
    reason: z.object({
      link: z.string().url().optional().or(z.literal('')),
      reason: z.string().min(1, 'Reason is required'),
      tag: z.string().optional().or(z.literal('')),
    }),
  })
  .required();

const ClaimFromJarForm = ({
  cookieJarAddress,
}: {
  cookieJarAddress: Address;
}) => {
  const { address } = useAccount();
  const form = useForm<z.infer<typeof CookieClaimSchema>>({
    defaultValues: {
      cookieJarAddress: cookieJarAddress,
      cookieMonster: address,
      reason: {
        link:"",
        reason:"",
        tag:""
      },
    },
    resolver: zodResolver(CookieClaimSchema),
  });
  const { reachInCookieJar } = useReachInJar();

  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log('data from form',data);
    const hash = await reachInCookieJar(data);
    // if (form.formState.isValid) {
    //   const hash = await reachInCookieJar(data);
    // }
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
          name="reason.reason"
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
