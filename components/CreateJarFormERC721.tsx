"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAccount, usePublicClient } from "wagmi";
import { isAddress, isHex } from "viem";
import zod from "zod";
import { useMintNFTJarERC20 } from "../app/hooks/useMintNFTJar";
import { ZERO_ADDRESS } from "../app/constants";
import { useEffect, useState } from "react";
import { waitForTransaction } from "wagmi/actions";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/use-toast";

import {
  Form,
} from "@/components/ui/form";

import SegmentTokenGating from "./SegmentTokenGating";
import SegmentCookieMeta from "./SegmentCookieMeta";
import SegmentDonation from "./SegmentDonation";
import { ICreateJarFormInput, ICreateJarFormInputERC721 } from "./types/CookieTypes";


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
    cookieAmount: zod.string().or(toNumber).pipe(zod.coerce.bigint()),
    cookieToken: ethAddressSchema,
    erc20Token: ethAddressSchema,
    erc20Threshold: zod.string().or(toNumber).pipe(zod.coerce.bigint()),
    donation: zod.boolean(),
    donationAmount: zod.string().optional(),
  })
  .required();

const CreateJarFormERC721 = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { toast } = useToast();
  const [hash, setHash] = useState<string>("");
  const chain = publicClient?.chain;
  const form = useForm<ICreateJarFormInput & ICreateJarFormInputERC721>({
    defaultValues: {
      cookieJar: "ERC20CookieJar6551",
      receiver: address,
      title: "Cookie Jar",
      description: "nom nom nom nom",
      cookiePeriod: 86400,
      cookieToken: ZERO_ADDRESS,
      cookieAmount: "1000000000000000000",
      erc20Token: "0x5f207d42f869fd1c71d7f0f81a2a67fc20ff7323", //TODO hardcoded WETH sepolia
      erc20Threshold: "1000000000000000000",
      donation: false,
    },
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = form;

  const { mintCookieJarNFT } = useMintNFTJarERC20();

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

  const onSubmit: SubmitHandler<ICreateJarFormInput & ICreateJarFormInputERC721> = async (data) => {
    console.log(data);
    if (isValid) {
      const result = await mintCookieJarNFT(data);

      if (!result) {
        toast({
          title: "Cookie burnt",
          description: `Transaction failed!`,
        });
        return;
      }

      const { hash } = result;

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
        <SegmentCookieMeta form={form} />

        <SegmentTokenGating form={form} />

        <SegmentDonation form={form} />

       
        <Button type="submit">Mint Cookie</Button>
        <Button onClick={() => reset()}>Reset</Button>
      </form>
    </Form>
  );
};

export default CreateJarFormERC721;
