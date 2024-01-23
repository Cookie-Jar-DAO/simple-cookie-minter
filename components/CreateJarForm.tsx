"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useAccount, usePublicClient } from "wagmi";
import { fetchToken } from "@wagmi/core";
import { Address, isAddress, parseEther } from "viem";
import zod from "zod";
import { useMintNFTJar } from "../app/hooks/useMintNFTJar";
import { ZERO_ADDRESS } from "../app/constants";
import { NFTImage } from "./NFTImage";
import { useEffect, useState } from "react";
import { FetchTokenResult } from "wagmi/actions";

export interface ICreateJarFormInput {
  receiver: string;
  title: string;
  description: string;
  link: string;
  cookiePeriod: number;
  cookieAmount: bigint;
  cookieToken: string;
  allowList: { account: Address }[];
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

const allowListSchema = zod.object({
  account: ethAddressSchema,
});

const schema = zod
  .object({
    receiver: ethAddressSchema,
    title: zod.string(),
    description: zod.string(),
    link: zod.string().url(),
    cookiePeriod: zod.bigint().or(toNumber).pipe(zod.coerce.bigint()),
    cookieAmount: zod.bigint().or(toNumber).pipe(zod.coerce.bigint()),
    cookieToken: ethAddressSchema,
    allowList: zod.array(allowListSchema),
    donation: zod.boolean(),
    donationAmount: zod.string().optional(),
  })
  .required();

const inputStyle =
  "w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900 p-2";

const CreateJarForm = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [token, setToken] = useState<FetchTokenResult | undefined>(undefined);
  const chain = publicClient?.chain;
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<ICreateJarFormInput>({
    defaultValues: {
      receiver: address,
      title: "Cookie Jar",
      description: "nom nom nom nom",
      cookiePeriod: 86400,
      cookieToken: ZERO_ADDRESS,
      cookieAmount: parseEther("1"),
      allowList: [{ account: address }],
      donation: false,
    },
    resolver: zodResolver(schema),
  });
  const { mintCookieJarNFT } = useMintNFTJar();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "allowList",
  });

  const donation = watch("donation", false);

  useEffect(() => {
    if (!donation) {
      setValue("donationAmount", "0");
    }
  }, [donation, setValue]);

  const cookieToken = watch("cookieToken");

  useEffect(() => {
    if (cookieToken !== ZERO_ADDRESS && isAddress(cookieToken)) {
      const getToken = async () => {
        const token = await fetchToken({
          address: cookieToken,
        });
        setToken(token);
      };

      getToken();
    }

    if (cookieToken === ZERO_ADDRESS) {
      setToken(undefined);
    }
  }, [cookieToken]);

  const onSubmit: SubmitHandler<ICreateJarFormInput> = async (data) => {
    console.log(data);
    if (isValid) {
      await mintCookieJarNFT(data);
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
            <p className="font-medium">Cookie Jar config</p>
            <p className="text-xs">
              Please provide the following information to create your cookie
              jar.
            </p>
            <NFTImage />
          </div>
          <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
            <div className="col-span-full">
              <label htmlFor="receiver">Receiver</label>
              <input
                {...register("receiver")}
                className={`${inputStyle}         ${
                  errors.receiver ? "border-red-500" : "border-zinc-300"
                }`}
              />
              <p className="text-red-500">{errors.receiver?.message}</p>
            </div>
            <div className="col-span-full">
              <label htmlFor="title">Title</label>
              <input {...register("title")} className={inputStyle} />
              <p className="text-red-500">{errors.title?.message}</p>
            </div>
            <div className="col-span-full">
              <label htmlFor="description">Description</label>
              <textarea {...register("description")} className={inputStyle} />
              <p className="text-red-500">{errors.description?.message}</p>
            </div>
            <div className="col-span-full">
              <label htmlFor="link">Link</label>
              <div className="flex">
                <input
                  placeholder="cookiemonster.com"
                  {...register("link")}
                  className={inputStyle}
                />
              </div>
              <p className="text-red-500">{errors.link?.message}</p>
            </div>
            <div className="col-span-full">
              <label htmlFor="cookieToken">{`Cookie Token: ${
                token ? token.name : chain.nativeCurrency.name
              }`}</label>
              <input {...register("cookieToken")} className={inputStyle} />
              <p className="text-red-500">{errors.cookieToken?.message}</p>
            </div>
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="cookiePeriod">Cookie Period</label>
              <input {...register("cookiePeriod")} className={inputStyle} />
              <p className="text-red-500">{errors.cookiePeriod?.message}</p>
            </div>
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="cookieAmount">Cookie Amount</label>
              <input {...register("cookieAmount")} className={inputStyle} />
              <p className="text-red-500">{errors.cookieAmount?.message}</p>
            </div>
          </div>
        </fieldset>

        <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
          <div className="space-y-2 col-span-full lg:col-span-1">
            <p className="font-medium">Set allowlist</p>
            <p className="text-xs">
              Provided the addresses of the cookie monsters you want to allow to
              eat your cookies.
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
            <ul className="col-span-full">
              {fields.map((item, index) => (
                <li key={item.id} className="col-span-full">
                  <input
                    {...register(`allowList.${index}.account`)}
                    className={inputStyle}
                  />
                  <button type="button" onClick={() => remove(index)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => append({ account: ZERO_ADDRESS })}
            >
              Append
            </button>
          </div>
        </fieldset>

        <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
          <div className="space-y-2 col-span-full lg:col-span-1">
            <p className="font-medium">Fund public goods</p>
            <p className="text-xs">
              Donate some crumbles to the devs for feature development
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
            <div className="col-span-full">
              <div className="flex flex-row gap-4">
                <input type="checkbox" {...register("donation")} />
                <label htmlFor="donation">{`Donate ${chain.nativeCurrency.name} to the devs`}</label>
              </div>

              <p className="text-red-500">{errors.donation?.message}</p>
            </div>
            {donation && (
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="donationAmount">Donation Amount</label>
                <input {...register("donationAmount")} className={inputStyle} />
                <p className="text-red-500">{errors.donationAmount?.message}</p>
              </div>
            )}
          </div>
        </fieldset>
        <div className="flex justify-center items-center col-span-full sm:col-span-3 gap-4">
          <div className="input-wrapper">
            <button
              type="submit"
              className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
            >
              Mint Cookie
            </button>
          </div>
          <div className="input-wrapper">
            <button
              onClick={() => reset()}
              type="submit"
              className="focus:shadow-outline rounded bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700 focus:outline-none"
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateJarForm;
