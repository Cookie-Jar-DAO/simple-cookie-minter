import type React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const DisplayClaim = ({
	heading,
	description,
	element,
}: {
	heading: string;
	description?: string;
	element?: React.ReactNode;
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{heading}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>{element}</CardContent>
		</Card>
	);
};
