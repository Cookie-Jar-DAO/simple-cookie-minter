// component: TokenGatingSegment
// <TokenGattingFieldSet form={form} />
"use client";
import type React from "react";
import type { SegmentCookieMetaProps } from "@/components/types/CookieTypes";

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Form } from "react-hook-form";
import { useDAOData } from "@/hooks/useDAOdata";
import { Checkbox } from "@/components/ui/checkbox";

const SegmentERC721TokenGating: React.FC<SegmentCookieMetaProps<any>> = ({
	form,
}) => {
	const {
		control,
		formState: { isValid },
		watch,
	} = form;

	const { data: daoData } = useDAOData({
		networkId: "0xaa36a7",
		daoAddress: watch("baalDao") as `0x${string}`,
	});

	return (
		<fieldset className="grid grid-cols-4 gap-6 p-6">
			<div className="col-span-full space-y-2 lg:col-span-1">
				<p className="font-medium">Set DAO gating</p>
				<p className="text-xs">
					Provide the address of the DAO (Moloch V3 Baal) and the threshold
					balance to allow cookie withdrawals.
				</p>
			</div>
			<div className="col-span-full grid grid-cols-6 gap-4 lg:col-span-3">
				<FormField
					control={control}
					name="hatId"
					render={({ field }) => (
						<FormItem className="col-span-full">
							<FormLabel>Hat Id</FormLabel>
							<FormControl>
								<Input
									placeholder="0x0000013000010001000300000000000000000000000000000000000000000000"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								The Id of the Hat to be used to gate cookie withdrawals
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* TODO: Update this to use Hats data and create useHatsData hook */}
				{/* <Collapsible className="col-span-full">
					<CollapsibleTrigger>✅ Gating DAO info ✅</CollapsibleTrigger>
					<CollapsibleContent>
						{!daoData?.data?.dao?.name && <p>DAO not found</p>}
						<p>
							<strong>Name</strong> {daoData?.data?.dao?.name}
						</p>
						<p>
							<strong>Member Count</strong>{" "}
							{daoData?.data?.dao?.activeMemberCount}
						</p>
					</CollapsibleContent>
				</Collapsible> */}
			</div>
		</fieldset>
	);
};

export default SegmentERC721TokenGating;
