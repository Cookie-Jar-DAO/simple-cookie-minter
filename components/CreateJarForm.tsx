"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useAccount, useBalance, usePublicClient, useToken } from "wagmi";
import { fetchToken } from "@wagmi/core";
import { Address, isAddress, isHex, parseEther } from "viem";
import zod from "zod";
import { useMintNFTJar } from "../app/hooks/useMintNFTJar";
import { ZERO_ADDRESS } from "../app/constants";
import { NFTImage } from "./NFTImage";
import { useEffect, useState } from "react";
import {
  FetchTokenResult,
  fetchBalance,
  waitForTransaction,
} from "wagmi/actions";
import { Button } from "@/components/ui/button";
import { SupportedImplementations } from "@/app/contracts";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

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

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface ICreateJarFormInput {
  cookieJar: SupportedImplementations;
  receiver: string;
  title: string;
  description: string;
  link: string;
  cookiePeriod: number;
  cookieAmount: bigint;
  cookieToken: string;
  erc20Token: string;
  erc20Threshold: bigint;
  donation: boolean;
  donationAmount?: string;
}

const toNumber = zod
  .number()
  .positive()
  .or(zod.string())
  .pipe(zod.coerce.number());

const ethAddressSchema = zod.string().refine((value) => isAddress(value), {
  message:
    "Provided address is invalid. Please insure you have typed correctly.",
});

const schema = zod
  .object({
    cookieJar: zod.string().transform((value) => "ERC20CookieJar6551"),
    receiver: ethAddressSchema,
    title: zod.string(),
    description: zod.string(),
    link: zod.string().url(),
    cookiePeriod: zod.bigint().or(toNumber).pipe(zod.coerce.bigint()),
    cookieAmount: zod.bigint().or(toNumber).pipe(zod.coerce.bigint()),
    cookieToken: ethAddressSchema,
    erc20Token: ethAddressSchema,
    erc20Threshold: zod.bigint().or(toNumber).pipe(zod.coerce.bigint()),
    donation: zod.boolean(),
    donationAmount: zod.string().optional(),
  })
  .required();

const inputStyle =
  "w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900 p-2";

const CreateJarForm = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { toast } = useToast();
  const [hash, setHash] = useState<string>("");
  const chain = publicClient?.chain;
  const form = useForm<ICreateJarFormInput>({
    defaultValues: {
      cookieJar: "ERC20CookieJar6551",
      receiver: address,
      title: "Cookie Jar",
      description: "nom nom nom nom",
      cookiePeriod: 86400,
      cookieToken: ZERO_ADDRESS,
      cookieAmount: parseEther("1"),
      erc20Token: "0x5f207d42f869fd1c71d7f0f81a2a67fc20ff7323", //TODO hardcoded WETH sepolia
      erc20Threshold: parseEther("1"),
      donation: false,
    },
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors, isValid },
    watch,
    setValue,
  } = form;

  const { mintCookieJarNFT } = useMintNFTJar();

  const { data: cookieToken } = useBalance({
    address,
    token:
      watch("cookieToken") === ZERO_ADDRESS
        ? undefined
        : (watch("cookieToken") as `0x${string}`),
  });

  console.log({ cookieToken, watchCookieToken: watch("cookieToken") });

  const { data: erc20Token } = useToken({
    address: watch("erc20Token") as `0x${string}`,
  });

  const donation = watch("donation", false);

  useEffect(() => {
    if (!donation) {
      setValue("donationAmount", "0");
    }
  }, [donation, setValue]);

  useEffect(() => {
    const handleTx = async () => {
      if (hash && isHex(hash)) {
        const txData = await waitForTransaction({
          hash,
        });

        if (txData.status === "success") {
          toast({
            title: "Cookie baked",
            description: `Cookie jar created!`,
          });
        } else {
          toast({
            title: "Cookie burnt",
            description: `Transaction failed! [hash: ${hash}]`,
          });
        }
      }
    };

    handleTx();
  }, [hash]);

  const onSubmit: SubmitHandler<ICreateJarFormInput> = async (data) => {
    console.log(data);
    if (isValid) {
      const { hash } = await mintCookieJarNFT(data);

      toast({
        title: "Baking cookie",
        description: `Transaction submitted with hash ${hash}`,
      });

      setHash(hash);
    }
  };

  console.log(isValid);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 dark:bg-gray-900 max-w-3xl m-auto"
      >
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

        <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-md dark:bg-gray-900">
          <div className="space-y-2 col-span-full lg:col-span-1">
            <p className="font-medium">Fund public goods</p>
            <p className="text-xs">
              Donate some crumbles to the devs for feature development
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
            <FormField
              control={control}
              name="donation"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormControl>
                    <Checkbox
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange(true)
                          : field.onChange(false);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Donate {chain.nativeCurrency.name} to the devs
                  </FormDescription>
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
                      The amount of {chain.nativeCurrency.name} to donate
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </fieldset>
        <Button type="submit">Mint Cookie</Button>
        <Button onClick={() => reset()}>Reset</Button>
      </form>
    </Form>
  );
};

export default CreateJarForm;
