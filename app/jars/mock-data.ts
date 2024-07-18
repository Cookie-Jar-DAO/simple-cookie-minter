import { Cookie, type CookieJar } from "@/lib/indexer/db";

export type Payment = {
	id: string;
	amount: number;
	status: "pending" | "processing" | "success" | "failed";
	email: string;
};

export const data: Payment[] = [
	{
		id: "m5gr84i9",
		amount: 316,
		status: "success",
		email: "ken99@yahoo.com",
	},
	{
		id: "3u1reuv4",
		amount: 242,
		status: "success",
		email: "Abe45@gmail.com",
	},
	{
		id: "derv1ws0",
		amount: 837,
		status: "processing",
		email: "Monserrat44@gmail.com",
	},
	{
		id: "5kma53ae",
		amount: 874,
		status: "success",
		email: "Silas22@gmail.com",
	},
	{
		id: "bhqecj4p",
		amount: 721,
		status: "failed",
		email: "carmella@hotmail.com",
	},
];

export const cookJarMockData = [
	{
		chainId: 5,
		type: "ERC20CookieJar6551",
		periodLength: "5000",
		owner: "0xA8cadC2268B01395f8573682fb9DD00Bd582E8A0",
		name: "Cookie Jar DAO",
		link: "https://cookiejar.wtf",
		id: "0xA8cadC2268B01395f8573682fb9DD00Bd5829283",
		description: "This is a test cookie jar for the cookie jar DAO",
		cookieToken: "0x0000000000000000000000000000000000000000",
		cookieAmount: "1000000000000000000",
	},
	{
		chainId: 5,
		type: "ERC20CookieJar6551",
		periodLength: "6000",
		owner: "0xA8cadC2268B01395f8573682fb9DD00Bd582E8A0",
		name: "Doughnut Jar DAO",
		link: "https://doughnutjar.io",
		id: "0xA8cadC2268B01395f8573682fb9DD00Bd5820003",
		description: "A mock doughnut jar for the doughnut jar DAO",
		cookieToken: "0x0000000000000000000000000000000000000000",
		cookieAmount: "2000000000000000000",
	},
	{
		chainId: 5,
		type: "ERC20CookieJar6551",
		periodLength: "7000",
		owner: "0xC7e0D2cA8Bf6A29f8E9F6B5d8Fb6E3d3D7F9B0c0",
		name: "Brownie Jar DAO",
		link: "https://browniejar.com",
		id: "0xA8cadC2268B01395f8573682fb9DD00Bd5820004",
		description: "This is a test brownie jar for the brownie jar DAO",
		cookieToken: "0x0000000000000000000000000000000000000000",
		cookieAmount: "3000000000000000000",
	},
	{
		chainId: 5,
		type: "ERC20CookieJar6551",
		periodLength: "8000",
		owner: "0xA8cadC2268B01395f8573682fb9DD00Bd582E8A0",
		name: "Candy Jar DAO",
		link: "https://candyjar.xyz",
		id: "0xA8cadC2268B01395f8573682fb9DD00Bd5820005",
		description: "This is a sample candy jar for the candy jar DAO",
		cookieToken: "0x0000000000000000000000000000000000000000",
		cookieAmount: "4000000000000000000",
	},
	{
		chainId: 5,
		type: "ERC20CookieJar6551",
		periodLength: "9000",
		owner: "0xA8cadC2268B01395f8573682fb9DD00Bd582E8A0",
		name: "Muffin Jar DAO",
		link: "https://muffinjar.app",
		id: "0xA8cadC2268B01395f8573682fb9DD00Bd5820006",
		description: "A mock muffin jar for the muffin jar DAO",
		cookieToken: "0x0000000000000000000000000000000000000000",
		cookieAmount: "5000000000000000000",
	},
];
