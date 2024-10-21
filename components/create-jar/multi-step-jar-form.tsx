"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { isAddress } from "viem";
import { useAccount } from "wagmi";

import { ZERO_ADDRESS } from "@/app/constants";
import { Form } from "../ui/form";
import JarFormSteps from "./jar-form-steps";

const jarTypes = ["Token Gated", "NFT Gated", "Baal", "Hats"];

const CookieJarEnum = z.enum([
  "ERC20CookieJar6551",
  "ERC721CookieJar6551",
  "BaalCookieJar6551",
  "HatsCookieJar6551",
]);

const toNumber = z.number().positive().or(z.string()).pipe(z.coerce.number());

const ethAddressSchema = z.string().refine((value) => isAddress(value), {
  message:
    "Provided address is invalid. Please ensure you have typed correctly.",
});

const baseJarSchema = z.object({
  jarType: CookieJarEnum,
  jarName: z.string(),
  jarDescription: z.string(),
  jarLink: z.string().url(),
  jarOwner: ethAddressSchema,
  cookieToken: ethAddressSchema,
  cookieAmount: z.string().or(toNumber).pipe(z.coerce.bigint()),
  cookiePeriod: z.bigint().or(toNumber).pipe(z.coerce.bigint()),
  donationAmount: z.string().optional(),
});

export const JarSchema = baseJarSchema.and(
  z.union([
    z.object({
      cookieJar: z.literal("BaalCookieJar6551"),
      baalDao: ethAddressSchema,
      baalThreshold: z.string().or(toNumber).pipe(z.coerce.bigint()),
      baalUseLoot: z.boolean(),
      baalUseShares: z.boolean(),
    }),
    z.object({
      cookieJar: z.literal("HatsCookieJar6551"),
      hatId: ethAddressSchema,
    }),
    z.object({
      cookieJar: z.literal("ERC20CookieJar6551"),
      erc20Token: ethAddressSchema,
      erc20Threshold: z.string().or(toNumber).pipe(z.coerce.bigint()),
    }),
    z.object({
      cookieJar: z.literal("ERC721CookieJar6551"),
      erc721Token: ethAddressSchema,
      erc721Threshold: z.string().or(toNumber).pipe(z.coerce.bigint()),
    }),
  ]),
);

export type CookieJarFormValues = z.infer<typeof JarSchema>;
export type CookieJarFormKeys = keyof CookieJarFormValues;

const cookieJarDefaultValues: CookieJarFormValues = {
  jarType: "ERC20CookieJar6551",
  jarName: "0xCookieJarsRule",
  jarDescription: "",
  jarLink: "",
  cookieJar: "ERC20CookieJar6551",
  erc20Token: "",
  erc20Threshold: 0n,
  jarOwner: "0xCookieJarsRule",
  cookiePeriod: 0n,
  cookieAmount: 0n,
  cookieToken: ZERO_ADDRESS,
};

export function MultiStepJarForm() {
  const { address } = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm<z.infer<typeof JarSchema>>({
    resolver: zodResolver(JarSchema),
    defaultValues: cookieJarDefaultValues,
  });

  const onSubmit = (values: CookieJarFormValues) => {
    console.log(values);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <JarFormSteps
              form={form}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          </form>
        </Form>
      </div>
    </section>
  );
}
