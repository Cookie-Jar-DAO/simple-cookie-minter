"use client";

import { useEffect, useState } from "react";

import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type Address, isAddress, isHex } from "viem";
import {
	useAccount,
	usePublicClient,
	useWaitForTransactionReceipt,
} from "wagmi";

import { useMintNFTJar } from "@/hooks/useMintNFTJar";
import { ZERO_ADDRESS } from "@/app/constants";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";

import SegmentCookieMeta from "./SegmentCookieMeta";
import SegmentDonation from "./SegmentDonation";
import type {
	ICreateJarFormInput,
	ICreateJarFormInputERC20,
} from "@/components/types/CookieTypes";
import SegmentERC20TokenGating from "./SegmentERC20TokenGating";
import { wagmiConfig } from "@/config/wagmi";
import { waitForTransactionReceipt } from "viem/actions";

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

const CreateJarFormERC20 = () => {
	const { address } = useAccount();
	const publicClient = usePublicClient();
	const { toast } = useToast();
	const [hash, setHash] = useState<Address | undefined>(undefined);
	const chain = publicClient?.chain;
	const form = useForm<ICreateJarFormInput & ICreateJarFormInputERC20>({
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

	const { mintCookieJarNFT } = useMintNFTJar();
	const {
		data: jarTxData,
		isError: isJarCreationError,
		isSuccess: isJarCreationSuccess,
	} = useWaitForTransactionReceipt({
		hash,
	});

	if (isJarCreationError) {
		setHash(undefined);
		toast({
			title: "Cookie burnt",
			description: `Transaction failed! [hash: ${hash}]`,
		});
	}

	if (isJarCreationSuccess) {
		setHash(undefined);
		toast({
			title: "Cookie baked",
			description: "Cookie jar created!",
		});
	}

	// TODO: Clean up and use wagmi hooks
	// useEffect(() => {
	//   console.log('in useEffect', hash)
	//   const handleTx = async () => {
	//     if (hash && isHex(hash)) {
	//       const txData = await waitForTransactionReceipt(wagmiConfig, {
	//         hash,
	//       });

	//       if (txData.status === "success") {
	//         toast({
	//           title: "Cookie baked",
	//           description: `Cookie jar created!`,
	//         });
	//       } else {
	//         toast({
	//           title: "Cookie burnt",
	//           description: `Transaction failed! [hash: ${hash}]`,
	//         });
	//       }
	//     }
	//   };

	//   handleTx();
	// }, [hash, toast]);

	const onSubmit: SubmitHandler<
		ICreateJarFormInput & ICreateJarFormInputERC20
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
			console.log("result", result);

			// const { hash } = result;

			toast({
				title: "Baking cookie",
				description: `Transaction submitted with hash ${result}`,
			});

			setHash(result);
		}
	};

	console.log("isFormValid", isValid);

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="m-auto my-8 flex max-w-3xl flex-col gap-4"
			>
				<SegmentCookieMeta form={form} />

				<SegmentERC20TokenGating form={form} />

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

export default CreateJarFormERC20;
