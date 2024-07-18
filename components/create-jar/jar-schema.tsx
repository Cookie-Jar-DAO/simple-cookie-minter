import zod from "zod";
import { isAddress } from "viem";

const CookieJarEnum = zod.enum([
	"ERC20CookieJar6551",
	"ERC721CookieJar6551",
	"BaalCookieJar6551",
	"HatsCookieJar6551",
]);

const toNumber = zod
	.number()
	.positive()
	.or(zod.string())
	.pipe(zod.coerce.number());

const ethAddressSchema = zod.string().refine((value) => isAddress(value), {
	message:
		"Provided address is invalid. Please ensure you have typed correctly.",
});

const baseJarSchema = zod.object({
	cookieJar: CookieJarEnum,
	receiver: ethAddressSchema,
	title: zod.string(),
	description: zod.string(),
	link: zod.string().url(),
	cookiePeriod: zod.bigint().or(toNumber).pipe(zod.coerce.bigint()),
	cookieAmount: zod.string().or(toNumber).pipe(zod.coerce.bigint()),
	cookieToken: ethAddressSchema,
	donation: zod.boolean(),
	donationAmount: zod.string().optional(),
});

export const JarSchema = baseJarSchema.and(
	zod.union([
		zod.object({
			cookieJar: zod.literal("BaalCookieJar6551"),
			baalDao: ethAddressSchema,
			baalThreshold: zod.string().or(toNumber).pipe(zod.coerce.bigint()),
			baalUseLoot: zod.boolean(),
			baalUseShares: zod.boolean(),
		}),
		zod.object({
			cookieJar: zod.literal("HatsCookieJar6551"),
			hatId: ethAddressSchema,
		}),
		zod.object({
			cookieJar: zod.literal("ERC20CookieJar6551"),
			erc20Token: ethAddressSchema,
			erc20Threshold: zod.string().or(toNumber).pipe(zod.coerce.bigint()),
		}),
		zod.object({
			cookieJar: zod.literal("ERC721CookieJar6551"),
			erc721Token: ethAddressSchema,
			erc721Threshold: zod.string().or(toNumber).pipe(zod.coerce.bigint()),
		}),
	]),
);
