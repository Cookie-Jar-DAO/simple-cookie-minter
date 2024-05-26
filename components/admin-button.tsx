"use client";
import Link from "next/link";
import React from "react";
import type { Address } from "viem";
import { useAccount } from "wagmi";

const AdminButton = ({ owner }: { owner: Address }) => {
	const account = useAccount();
	if (!account || account.address !== owner) {
		return null;
	}
	return <Link href="/admin">Manage Jar</Link>;
};

export default AdminButton;
