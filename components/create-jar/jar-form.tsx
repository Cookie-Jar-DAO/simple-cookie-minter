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

const JarForm = () => {
	const form = useForm<z.infer<typeof JarSchema>>({
		resolver: zodResolver(JarSchema),
	});
	function onSubmit(data: z.infer<typeof JarSchema>) {
		console.log("jar form data", data);
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
				<FormField
					control={form.control}
					name="cookieJar"
					render={({ field }) => (
						<FormItem>
							<FormLabel>CookieJar</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a CookieJar" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="ERC20CookieJar6551">
										Token CookieJar
									</SelectItem>
									<SelectItem value="ERC721CookieJar6551">
										NFT CookieJar
									</SelectItem>
									<SelectItem value="BaalCookieJar6551">
										Baal CookieJar
									</SelectItem>
									<SelectItem value="HatsCookieJar6551">
										Hats CookieJar
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
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
};

export { JarForm };
