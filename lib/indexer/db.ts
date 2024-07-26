import { Abi, type AbiEvent } from "abitype";
import Dexie, { type Table } from "dexie";
import type { Address } from "viem";

type EventHandlers = "StoreCookieJar" | "StoreCookie";

export interface CookieJarInitializer {
	safeTarget: string;
	cookieAmount: bigint;
	periodLength: bigint;
	cookieToken: string;
}

export interface ListInitializer extends CookieJarInitializer {
	allowList: string[];
}

export interface ERC20Initializer extends CookieJarInitializer {
	_erc20addr: string;
	_threshold: bigint;
}

export interface ERC721Initializer extends CookieJarInitializer {
	_erc721addr: string;
	_threshold: bigint;
}

export interface BaalInitializer extends CookieJarInitializer {
	_dao: string;
	_threshold: bigint;
	_useShares: boolean;
	_useLoot: boolean;
}

export type Initializer =
	| CookieJarInitializer
	| ListInitializer
	| ERC20Initializer
	| ERC721Initializer
	| BaalInitializer;

export interface CookieJar {
	chainId: number;
	type: string;
	periodLength: string;
	owner: Address;
	name: string;
	link: string;
	id: Address;
	description: string;
	cookieToken: string;
	cookieAmount: string;
}

export interface Claim {
	id: string;
	uuid: string;
	claimer: string;
	receiver: string;
	amount: string;
	timestamp: string;
	reason: ClaimReason;
}

interface ClaimReason {
	id: string;
	link: string;
	reason: string;
	tag: string;
}

export interface Subscription {
	chainId: 5 | 100 | 11155111;
	address: `0x${string}`;
	event: AbiEvent;
	eventHandler: EventHandlers;
	fromBlock: bigint;
	lastBlock: bigint;
}

export interface Cookie {
	cookieUid: string;
	jarUid: string;
	cookieGiver: string;
	cookieMonster: string;
	amount: bigint;
	reasonTag: string;
	assessTag: string;
}

export interface Reason {
	title: string;
	description: string;
	link: string;
	user: string;
	receiver: string;
	reasonTag: string;
}

export interface Rating {
	id?: number;
	assessTag: string;
	user: string;
	isGood: boolean;
}

export class CookieDB extends Dexie {
	// We just tell the typing system this is the case
	subscriptions!: Table<Subscription>;
	cookieJars!: Table<CookieJar>;
	cookies!: Table<Cookie>;
	reasons!: Table<Reason>;
	ratings!: Table<Rating>;
	keyvals!: Table<any>;

	constructor() {
		super("cookieDb");
		this.version(1).stores({
			cookieJars: "&jarUid, address, type, chainId", // Primary key and indexed props
			subscriptions:
				"[chainId+address+event.name], address, lastBlock, event.name, chainId",
			cookies: "[jarUid+cookieUid]",
			reasons: "&reasonTag, user, receiver",
			ratings: "[assessTag+user], assessTag, user, isGood",
			keyvals: "",
		});
	}
}

export const db = new CookieDB();
