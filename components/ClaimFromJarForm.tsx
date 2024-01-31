"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { Address, isAddress } from "viem";
import zod from "zod";
import { NFTImage } from "./NFTImage";
import { useReachInJar } from "../app/hooks/useReachInJar";
import { Button } from "@/components/ui/button";

export interface IClaimFromJarFormInput {
  cookieJarAddress: Address;
  cookieMonster: string;
  reason: string;
}

const ethAddressSchema = zod.string().refine((value) => isAddress(value), {
  message:
    "Provided address is invalid. Please insure you have typed correctly.",
});

const schema = zod
  .object({
    cookieMonster: ethAddressSchema,
    reason: zod.string(),
  })
  .required();

const inputStyle =
  "w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900 p-2";

const ClaimFromJarForm = ({
  cookieJarAddress,
}: {
  cookieJarAddress: Address;
}) => {
  const { address } = useAccount();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<IClaimFromJarFormInput>({
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
    if (isValid) {
      const hash = await reachInCookieJar(data);
      console.log(hash);
    }
  };

  console.log(isValid);

  return (
    <div className="m-auto flex w-3/4 flex-col gap-4 dark:text-gray-50">
      <h1 className="bold text-2xl">Let&apos;s bake</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 dark:bg-gray-900"
      >
        <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
          <div className="space-y-2 col-span-full lg:col-span-1">
            <p className="font-medium">Reach in jar</p>
            <p className="text-xs">Reach in the jar and claim your cookie!</p>
            <NFTImage />
          </div>
          <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
            <div className="col-span-full">
              <label htmlFor="cookieMonster">Cookie monster</label>
              <input
                {...register("cookieMonster")}
                className={`${inputStyle}         ${
                  errors.cookieMonster ? "border-red-500" : "border-zinc-300"
                }`}
              />
              <p className="text-red-500">{errors.cookieMonster?.message}</p>
            </div>
            <div className="col-span-full">
              <label htmlFor="reason">Title</label>
              <input {...register("reason")} className={inputStyle} />
              <p className="text-red-500">{errors.reason?.message}</p>
            </div>
          </div>
        </fieldset>

        <div className="flex justify-center items-center col-span-full sm:col-span-3 gap-4">
          <div className="input-wrapper">
            <Button type="submit">Claim Cookie</Button>
          </div>
          <div className="input-wrapper">
            <Button onClick={() => reset()} type="submit">
              Reset
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ClaimFromJarForm;
