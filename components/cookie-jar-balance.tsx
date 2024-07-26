"use client";
import React from "react";
import type { Address } from "viem";

import { useBalance, useReadContract } from "wagmi";

import { formatEther } from "viem";

const CookieJarBalance = ({ jarAddress }: { jarAddress: Address }) => {
	/**
	 ** TODO:
	 ** Target is now returned from the GraphQL query.
	 ** This can be updated to use target from initial query instead of reading contract for target.
	 */
	const { data: targetAddress } = useReadContract({
		abi: [
			{
				inputs: [],
				name: "target",
				outputs: [
					{
						internalType: "address",
						name: "target",
						type: "address",
					},
				],
				stateMutability: "view",
				type: "function",
			},
		],
		address: jarAddress,
		functionName: "target",
	});

	const {
		data: jarBalance,
		isLoading,
		isSuccess,
		isError,
	} = useBalance({
		address: targetAddress,
		query: {
			enabled: !!targetAddress,
		},
	});
	return (
		<div>
			{isLoading && <div>Loading...</div>}
			{isError && <div>Oops, something went wrong...</div>}
			{isSuccess && (
				<div className="flex gap-2">
					<p>
						Balance: {formatEther(jarBalance.value)} {jarBalance.symbol}
					</p>
				</div>
			)}
		</div>
	);
};

export { CookieJarBalance };
