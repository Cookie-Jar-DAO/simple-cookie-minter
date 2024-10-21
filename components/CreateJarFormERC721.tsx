"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Config, useAccount, usePublicClient } from "wagmi";
import { isAddress, isHex } from "viem";
import zod from "zod";
import { useMintNFTJar } from "@/hooks/useMintNFTJar";
import { ZERO_ADDRESS } from "@/app/constants";
import { useEffect, useState } from "react";
import { waitForTransactionReceipt } from "wagmi/actions";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/use-toast";

import { Form } from "@/components/ui/form";

import SegmentCookieMeta from "./SegmentCookieMeta";
import SegmentDonation from "./SegmentDonation";
import type {
  ICreateJarFormInput,
  ICreateJarFormInputERC721,
} from "@/components/types/CookieTypes";
import SegmentERC721TokenGating from "./SegmentERC721TokenGating";
import { config } from "@/config";

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
    cookieJar: zod.string().transform((value) => "ERC721CookieJar6551"),
    receiver: ethAddressSchema,
    title: zod.string(),
    description: zod.string(),
    link: zod.string().url(),
    cookiePeriod: zod.bigint().or(toNumber).pipe(zod.coerce.bigint()),
    cookieAmount: zod.string().or(toNumber).pipe(zod.coerce.bigint()),
    cookieToken: ethAddressSchema,
    erc721Token: ethAddressSchema,
    erc721Threshold: zod.string().or(toNumber).pipe(zod.coerce.bigint()),
    donation: zod.boolean(),
    donationAmount: zod.string().optional(),
  })
  .required();

const CreateJarFormERC721 = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { toast } = useToast();
  const [hash, setHash] = useState<string>("");
  const form = useForm<ICreateJarFormInput & ICreateJarFormInputERC721>({
    defaultValues: {
      cookieJar: "ERC721CookieJar6551",
      receiver: address,
      title: "Cookie Jar",
      description: "nom nom nom nom",
      cookiePeriod: 86400,
      cookieToken: ZERO_ADDRESS,
      cookieAmount: "1000000000000000000",
      erc721Token: "0x5f207d42f869fd1c71d7f0f81a2a67fc20ff7323", //TODO hardcoded WETH sepolia
      erc721Threshold: "1",
      donation: false,
    },
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = form;

  const { mintCookieJarNFT } = useMintNFTJar();
  // TODO: Clean up and use wagmi hooks
  useEffect(() => {
    const handleTx = async () => {
      if (hash && isHex(hash)) {
        const txData = await waitForTransactionReceipt(config as Config, {
          hash,
        });

        if (txData.status === "success") {
          toast({
            title: "Cookie baked",
            description: "Cookie jar created!",
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

  const onSubmit: SubmitHandler<
    ICreateJarFormInput & ICreateJarFormInputERC721
  > = async (data) => {
    console.log(data);
    if (isValid) {
      const result = await mintCookieJarNFT(data);

      if (!result) {
        toast({
          title: "Cookie burnt",
          description: "Transaction failed!",
        });
        return;
      }

      console.log("hash", result);

      toast({
        title: "Baking cookie",
        description: `Transaction submitted with hash ${result}`,
      });

      setHash(result);
    }
  };

  console.log(isValid);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-auto my-8 flex max-w-3xl flex-col gap-4 dark:bg-gray-900"
      >
        <SegmentCookieMeta form={form} />

        <SegmentERC721TokenGating form={form} />

        <SegmentDonation form={form} />

        <Button
          className="bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:ring-amber-300"
          type="submit"
        >
          Mint Cookie Jar
        </Button>
        <Button
          className="bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:ring-amber-300"
          onClick={() => reset()}
        >
          Reset
        </Button>
      </form>
    </Form>
  );
};

export default CreateJarFormERC721;
