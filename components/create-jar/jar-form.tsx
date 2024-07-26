"use client";
import React from "react";
import Link from "next/link";

import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import { isAddress } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { JarSchema } from "@/components/create-jar/jar-schema";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Button } from "../ui/button";
import SegmentCookieMeta from "@/components/SegmentCookieMeta";
import SegmentHatsTokenGating from "@/components/SegmentHatsTokenGating";
import SegmentERC20TokenGating from "@/components/SegmentERC20TokenGating";
import SegmentBaalTokenGating from "@/components/SegmentBaalTokenGating";
import SegmentERC721TokenGating from "@/components/SegmentERC721TokenGating";
import { ZERO_ADDRESS } from "@/app/constants";

const JarForm = () => {
	const { address } = useAccount();
	const form = useForm<z.infer<typeof JarSchema>>({
		resolver: zodResolver(JarSchema),
		defaultValues: {
			cookieJar: "ERC20CookieJar6551",
			receiver: address,
			cookieToken: ZERO_ADDRESS,
			// cookieAmount: "1000000000000000000",
			erc20Token: "0x5f207d42f869fd1c71d7f0f81a2a67fc20ff7323", //TODO hardcoded WETH sepolia
			// erc20Threshold: "1000000000000000000",
			donation: false,
		},
	});

	const cookieJarType = form.watch("cookieJar");

	function onSubmit(data: z.infer<typeof JarSchema>) {
		console.log("jar form data", data);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="m-auto my-8 flex max-w-3xl flex-col gap-4"
			>
				<fieldset className="grid grid-cols-4 gap-6 p-6">
					<div className="col-span-full space-y-2 lg:col-span-1">
						<p className="font-medium">Cookie Type</p>
						<p className="text-xs">
							Currently cookie jars can be created for ERC20, ERC721, Moloch
							DAOs, and Hats Protocol.
						</p>
					</div>
					<div className="col-span-full grid grid-cols-6 gap-4 lg:col-span-3">
						<FormField
							control={form.control}
							name="cookieJar"
							render={({ field }) => (
								<FormItem className="col-span-full">
									<FormLabel>CookieJar</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a CookieJar" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="ERC20CookieJar6551">
												Token Gated CookieJar
											</SelectItem>
											<SelectItem value="ERC721CookieJar6551">
												NFT Gated CookieJar
											</SelectItem>
											<SelectItem value="BaalCookieJar6551">
												Baal Gated CookieJar
											</SelectItem>
											<SelectItem value="HatsCookieJar6551">
												Hats Gated CookieJar
											</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription>
										You can learn more about the types of CookieJars{" "}
										<Link href="/about">here</Link>.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</fieldset>
				<SegmentCookieMeta form={form} />
				{cookieJarType === "ERC20CookieJar6551" && (
					<SegmentERC20TokenGating form={form} />
				)}
				{cookieJarType === "ERC721CookieJar6551" && (
					<SegmentERC721TokenGating form={form} />
				)}
				{cookieJarType === "BaalCookieJar6551" && (
					<SegmentBaalTokenGating form={form} />
				)}
				{cookieJarType === "HatsCookieJar6551" && (
					<SegmentHatsTokenGating form={form} />
				)}
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
};

export { JarForm };
