"use client";
import { ZERO_ADDRESS } from "@/app/constants";
import { Button } from "@/components/ui/button";
import { useMintNFTJar } from "@/hooks/useMintNFTJar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { isAddress, isHex } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import zod from "zod";

import { useToast } from "@/components/ui/use-toast";

import { Form } from "@/components/ui/form";

import type {
  ICreateJarFormInput,
  ICreateJarFormInputBaal,
  ICreateJarFormInputHats,
} from "@/components/types/CookieTypes";
import { wagmiConfig } from "@/config/wagmi";
import SegmentCookieMeta from "./SegmentCookieMeta";
import SegmentDonation from "./SegmentDonation";
import SegmentHatsTokenGating from "./SegmentHatsTokenGating";

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
    cookieJar: zod.string().transform((value) => "HatsCookieJar6551"),
    receiver: ethAddressSchema,
    title: zod.string(),
    description: zod.string(),
    link: zod.string().url(),
    cookiePeriod: zod.bigint().or(toNumber).pipe(zod.coerce.bigint()),
    cookieAmount: zod.string().or(toNumber).pipe(zod.coerce.bigint()),
    cookieToken: ethAddressSchema,
    hatId: zod.string(),
    donation: zod.boolean(),
    donationAmount: zod.string().optional(),
  })
  .required();

const CreateJarFormHats = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { toast } = useToast();
  const [hash, setHash] = useState<string>("");
  const form = useForm<ICreateJarFormInput & ICreateJarFormInputHats>({
    defaultValues: {
      cookieJar: "HatsCookieJar6551",
      receiver: address,
      title: "",
      description: "",
      cookiePeriod: 86400,
      cookieToken: ZERO_ADDRESS,
      cookieAmount: "1000000000000000000",
      hatId: ZERO_ADDRESS,
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

  const data = form.watch();

  // TODO: Clean up and use wagmi hooks
  useEffect(() => {
    const handleTx = async () => {
      if (hash && isHex(hash)) {
        const txData = await waitForTransactionReceipt(wagmiConfig, {
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
    ICreateJarFormInput & ICreateJarFormInputHats
  > = async (data) => {
    if (isValid) {
      const result = await mintCookieJarNFT(data);

      if (!result) {
        toast({
          title: "Cookie burnt",
          description: "Transaction failed!",
        });
        return;
      }

      toast({
        title: "Baking cookie",
        description: `Transaction submitted with hash ${result}`,
      });

      setHash(result);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-auto my-8 flex max-w-3xl flex-col gap-4"
      >
        <SegmentCookieMeta form={form} />

        <SegmentHatsTokenGating form={form} />

        <SegmentDonation form={form} />

        <Button
          className="bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:ring-amber-300"
          type="submit"
        >
          Mint Cookie
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

export default CreateJarFormHats;
