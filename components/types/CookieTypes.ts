import type { SupportedImplementations } from "@/app/contracts";
import type { UseFormReturn } from "react-hook-form";

export interface ICreateJarFormInput {
	cookieJar: SupportedImplementations;
	receiver: string;
	title: string;
	description: string;
	link: string;
	cookiePeriod: number;
	cookieAmount: string;
	cookieToken: string;
	donation: boolean;
	donationAmount?: string;
}

export interface ICreateJarFormInputERC20 {
	erc20Token: string;
	erc20Threshold: string;
}

// 5. address _erc721addr,
// 6. uint256 _threshold
export interface ICreateJarFormInputERC721 {
	erc721Token: string;
	erc721Threshold: string;
}

// Baal
// 5. address _dao,
// 6. uint256 _threshold,
// 7. bool _useShares,
// 8. bool _useLoot
export interface ICreateJarFormInputBaal {
	baalDao: string;
	baalThreshold: string;
	baalUseShares: boolean;
	baalUseLoot: boolean;
}

export interface ICreateJarFormInputHats {
	hatId: string;
}

export interface SegmentCookieMetaProps<
	T extends ICreateJarFormInput &
		(ICreateJarFormInputERC20 | ICreateJarFormInputERC721),
> {
	form: UseFormReturn<T>;
}
