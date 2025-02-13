"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { type Address, isAddress } from "viem";
import zod from "zod";
import { NFTImage } from "./NFTImage";
import { useReachInJar } from "@/hooks/useReachInJar";
import { Button } from "@/components/ui/button";
import { CookieClaimSchema, type CookieClaimFormValues } from "./claim-from-jar-form";

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
  } = useForm<CookieClaimFormValues>({
    defaultValues: {
      cookieJarAddress,
      cookieMonster: address,
      reason: {
        reason: "",
        link: "",
        tag: ""
      },
    },
    resolver: zodResolver(CookieClaimSchema),
  });
  const { reachInCookieJar } = useReachInJar();

  const onSubmit: SubmitHandler<CookieClaimFormValues> = async (data) => {
    if (isValid) {
      const hash = await reachInCookieJar(data);
    }
  };

  return (
    <div className="m-auto flex flex-col gap-4 dark:text-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 dark:bg-gray-900"
      >
        <fieldset className="grid grid-cols-4 gap-6 rounded-md p-6 shadow-sm dark:bg-gray-900">
          <div className="col-span-full space-y-2 lg:col-span-1">
            <p className="font-medium">Reach in jar</p>
            <p className="text-xs">Reach in the jar and claim your cookie!</p>
            <NFTImage />
          </div>
          <div className="col-span-full grid grid-cols-6 gap-4 lg:col-span-3">
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
              <label htmlFor="reason.reason">Title</label>
              <input 
                {...register("reason.reason")} 
                className={inputStyle} 
              />
              <p className="text-red-500">{errors.reason?.reason?.message}</p>
            </div>
          </div>
        </fieldset>

        <div className="col-span-full flex items-center justify-center gap-4 sm:col-span-3">
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
