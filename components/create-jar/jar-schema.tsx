import { z } from "zod";
import { isAddress } from "viem";

const CookieJarEnum = z.enum([
	"ERC20CookieJar6551",
	"ERC721CookieJar6551",
	"BaalCookieJar6551",
	"HatsCookieJar6551",
]);

const toNumber = z.number().positive().or(z.string()).pipe(z.coerce.number());

const ethAddressSchema = z.string().refine((value) => isAddress(value), {
	message:
		"Provided address is invalid. Please ensure you have typed correctly.",
});

const baseJarSchema = z.object({
	cookieJar: CookieJarEnum,
	receiver: ethAddressSchema,
	title: z.string(),
	description: z.string(),
	link: z.string().url(),
	cookiePeriod: z.bigint().or(toNumber).pipe(z.coerce.bigint()),
	cookieAmount: z.string().or(toNumber).pipe(z.coerce.bigint()),
	cookieToken: ethAddressSchema,
	donation: z.boolean(),
	donationAmount: z.string().optional(),
});

export const jarSchema = baseJarSchema.and(
	z.union([
		z.object({
			cookieJar: z.literal("BaalCookieJar6551"),
			baalDao: ethAddressSchema,
			baalThreshold: z.string().or(toNumber).pipe(z.coerce.bigint()),
			baalUseLoot: z.boolean(),
			baalUseShares: z.boolean(),
		}),
		z.object({
			cookieJar: z.literal("HatsCookieJar6551"),
			hatId: ethAddressSchema,
		}),
		z.object({
			cookieJar: z.literal("ERC20CookieJar6551"),
			erc20Token: ethAddressSchema,
			erc20Threshold: z.string().or(toNumber).pipe(z.coerce.bigint()),
		}),
		z.object({
			cookieJar: z.literal("ERC721CookieJar6551"),
			erc721Token: ethAddressSchema,
			erc721Threshold: z.string().or(toNumber).pipe(z.coerce.bigint()),
		}),
	]),
);
