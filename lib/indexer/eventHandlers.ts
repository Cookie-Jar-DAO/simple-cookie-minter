import { parseAbi, parseAbiItem, parseAbiParameters } from "abitype";
import {
  BaalInitializer,
  Cookie,
  CookieJar,
  CookieJarInitializer,
  ERC20Initializer,
  ERC721Initializer,
  Initializer,
  ListInitializer,
  db,
} from "./db";
import {
  Log,
  decodeAbiParameters,
  decodeFunctionData,
  stringToBytes,
  keccak256,
} from "viem";
import { PublicClient } from "wagmi";
import _ from "lodash";

export type EventHandlers = "StoreCookieJar" | "StoreCookie";

type SummonLog = {
  cookieJar: `0x${string}`;
  initializer: `0x${string}`;
  details: string;
  uid: string;
};

type GiveCookieLog = {
  cookieMonster: string;
  _uid: string;
  amount: bigint;
};

const hasArgs = (obj: unknown): obj is { args: unknown } => {
  return typeof obj === "object" && obj !== null && "args" in obj;
};

type Details6551 = {
  type: string;
  title: string;
  description: string;
  link: string;
};

const DETAILS = {
  ERC20: "ERC20 Cookie Jar V2",
  ERC721: "NFT Cookie Jar V2",
  List: "List Cookie Jar V2",
  Open: "Open Cookie Jar V2",
  Baal: "Baal CookieJar V2",
};

const parameterString = {
  baal: "address safeTarget, uint256 periodLenght, uint256 cookieAmount, address cookieToken, address _dao, uint256 _threshold, bool _useShares, bool _useLoot",
  erc20:
    "address safeTarget, uint256 periodLenght, uint256 cookieAmount, address cookieToken, address _erc20addr, uint256 _threshold",
  erc721:
    "address safeTarget, uint256 periodLenght, uint256 cookieAmount, address cookieToken, address _erc721addr",
  list: "address safeTarget, uint256 periodLenght, uint256 cookieAmount, address cookieToken, address[] allowlist",
  open: "address safeTarget, uint256 periodLenght, uint256 cookieAmount, address cookieToken",
};

const isSummonLog = (obj: unknown): obj is SummonLog => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "cookieJar" in obj &&
    "initializer" in obj &&
    "details" in obj &&
    "uid" in obj
  );
};

const isGiveCookieLog = (obj: unknown): obj is GiveCookieLog => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "cookieMonster" in obj &&
    "_uid" in obj &&
    "amount" in obj
  );
};

const storeCookieJar = async (
  summonCookieJarLog: Log,
  publicClient: PublicClient
) => {
  if (!hasArgs(summonCookieJarLog)) {
    console.error("Invalid log");
    return;
  }

  if (!isSummonLog(summonCookieJarLog.args)) {
    console.error("Invalid summon log");
    return;
  }

  const chainId = await publicClient.getChainId();

  const res = parseSummonArguments(summonCookieJarLog.args);

  if (!res) {
    console.error("Failed to parse summon arguments");
    return;
  }

  const { cookieJar, uid, initializer, details } = res;

  const _decodedCookieJar = {
    ...details,
    chainId,
    jarUid: uid,
    address: cookieJar.toLowerCase() as `0x${string}`,
    initializer,
  } as CookieJar;

  try {
    console.log("Storing cookieJar", _decodedCookieJar);
    const id = await db.cookieJars
      .put(_decodedCookieJar, uid)
      .then(async () => {
        if (chainId === 5 || chainId === 100) {
          await db.subscriptions.add({
            chainId,
            address: _decodedCookieJar.address as `0x${string}`,
            event: parseAbiItem(
              "event GiveCookie(address indexed cookieMonster, uint256 amount, string _uid)"
            ),
            eventHandler: "StoreCookie",
            fromBlock: summonCookieJarLog.blockNumber!,
            lastBlock: summonCookieJarLog.blockNumber!,
          });
        }
      });

    console.log(`Stored cookieJar ${_decodedCookieJar} at ${id}`);
  } catch (e) {
    console.error("Failed to store cookieJar", e);
  }
};

const storeCookie = async (giveCookieLog: Log, publicClient: PublicClient) => {
  if (!hasArgs(giveCookieLog)) {
    console.error("Invalid log");
    return;
  }

  if (!isGiveCookieLog(giveCookieLog.args)) {
    console.error("Invalid giveCookie log");
    return;
  }

  console.log("Parsing cookie event: ", giveCookieLog);

  const { cookieMonster, amount, _uid } = giveCookieLog.args;
  const cookieJar = await db.cookieJars
    .where("address")
    .equals(giveCookieLog.address)
    .first();

  if (!cookieJar) {
    console.error("Could not find cookieJar for event", giveCookieLog);
    return;
  }

  const cookie = {
    jarUid: cookieJar.jarUid,
    cookieGiver: "",
    cookieMonster,
    cookieUid: _uid,
    amount,
    reasonTag: await calculateReasonTag(cookieJar.jarUid, _uid),
    assessTag: await calculateAssessTag(cookieJar.jarUid, _uid),
  } as Cookie;

  console.log("Found cookie: ", cookie);

  try {
    console.log("Storing cookie", cookie);
    await db.cookies
      .put(cookie, cookie.jarUid + cookie.cookieUid)
      .then((id) => console.log(`Stored cookie ${cookie} at ${id}`));
  } catch (e) {
    console.error("Failed to store cookie", e);
  }
};

export const getEventHandler = (handler: EventHandlers) => {
  switch (handler) {
    case "StoreCookie":
      return storeCookie;
    case "StoreCookieJar":
      return storeCookieJar;
    default:
      console.error(`No event handler found for ${handler}`);
      return undefined;
  }
};

const calculateReasonTag = async (cookieJarUid: string, cookieUid: string) => {
  const reasonTag = keccak256(
    stringToBytes(`CookieJar.${cookieJarUid}.reason.${cookieUid}`)
  );

  console.log(`Calculated reasonTag: ${reasonTag} for cookie ${cookieUid}`);
  return reasonTag;
};

const calculateAssessTag = async (cookieJarUid: string, cookieUid: string) => {
  const assessTag = keccak256(
    stringToBytes(`CookieJar.${cookieJarUid}.reaction.${cookieUid}`)
  );

  console.log(`Calculated assessTag: ${assessTag} for cookie ${cookieUid}`);
  return assessTag;
};

const parseSummonArguments = (log: SummonLog) => {
  const { cookieJar, initializer, details, uid } = log;
  const decoded = decodeFunctionData({
    abi: parseAbi(["function setUp(bytes)"]),
    data: initializer,
  });

  const isSimpleDetails = (details: string) => {
    console.log("DETAILS: ", details);

    return Object.values(DETAILS).includes(details as string);
  };

  if (isSimpleDetails(details)) {
    try {
      const { _details, _initializer } = handleSimpleDetails(details, decoded);

      return {
        cookieJar,
        uid,
        initializer: _initializer,
        details: _details,
      };
    } catch (e) {
      console.error(
        `Failed to parse details ${details} as simple cookiejar: ${e}}`
      );
    }
  }

  if (details && !isSimpleDetails(details)) {
    try {
      const { _details, _initializer } = handleJSONDetails(details, decoded);

      if (_.isEmpty(_details) || !_initializer || _.isEmpty(_initializer)) {
        throw new Error("Invalid details or initializer");
      }

      return {
        cookieJar,
        uid,
        initializer: _initializer,
        details: _details,
      };
    } catch (e) {
      console.error("Failed to parse details as json cookiejar", e);
    }
  }
};

const handleJSONDetails = (
  details: string,
  decodedSetup: {
    args: readonly [`0x${string}`];
    functionName: "setUp";
  }
) => {
  const _details = JSON.parse(details as string) as {
    type: string;
    title: string;
    description: string;
    link: string;
  };

  let _initializer: Initializer | undefined;

  if (_details.type.toLowerCase() === "baal") {
    const decodedAbiParameters = decodeAbiParameters(
      parseAbiParameters(parameterString.baal),
      decodedSetup.args[0]
    );

    _initializer = {
      safeTarget: decodedAbiParameters[0],
      periodLength: decodedAbiParameters[1],
      cookieAmount: decodedAbiParameters[2],
      cookieToken: decodedAbiParameters[3],
      _dao: decodedAbiParameters[4],
      _threshold: decodedAbiParameters[5],
      _useShares: decodedAbiParameters[6],
      _useLoot: decodedAbiParameters[7],
    } as BaalInitializer;
  }

  if (_details.type.toLowerCase() === "erc20") {
    const decodedAbiParameters = decodeAbiParameters(
      parseAbiParameters(parameterString.erc20),
      decodedSetup.args[0]
    );

    _initializer = {
      safeTarget: decodedAbiParameters[0],
      periodLength: decodedAbiParameters[1],
      cookieAmount: decodedAbiParameters[2],
      cookieToken: decodedAbiParameters[3],
      _erc20addr: decodedAbiParameters[4],
      _threshold: decodedAbiParameters[5],
    } as ERC20Initializer;
  }

  if (_details.type.toLowerCase() === "list") {
    const decodedAbiParameters = decodeAbiParameters(
      parseAbiParameters(parameterString.list),
      decodedSetup.args[0]
    );

    _initializer = {
      safeTarget: decodedAbiParameters[0],
      periodLength: decodedAbiParameters[1],
      cookieAmount: decodedAbiParameters[2],
      cookieToken: decodedAbiParameters[3],
      allowList: (decodedAbiParameters[4] as string[]).map((addr: string) =>
        addr.toLowerCase()
      ),
    } as ListInitializer;
  }

  if (_details.type.toLowerCase() === "erc721") {
    const decodedAbiParameters = decodeAbiParameters(
      parseAbiParameters(parameterString.erc721),
      decodedSetup.args[0]
    );

    _initializer = {
      safeTarget: decodedAbiParameters[0],
      periodLength: decodedAbiParameters[1],
      cookieAmount: decodedAbiParameters[2],
      cookieToken: decodedAbiParameters[3],
      _erc721addr: decodedAbiParameters[4],
    } as ERC721Initializer;
  }

  if (_details.type.toLowerCase() === "open") {
    const decodedAbiParameters = decodeAbiParameters(
      parseAbiParameters(parameterString.open),
      decodedSetup.args[0]
    );

    _initializer = {
      safeTarget: decodedAbiParameters[0],
      periodLength: decodedAbiParameters[1],
      cookieAmount: decodedAbiParameters[2],
      cookieToken: decodedAbiParameters[3],
    } as CookieJarInitializer;
  }

  if (_details.type === "6551") {
    const decodedAbiParameters = decodeAbiParameters(
      parseAbiParameters(parameterString.list),
      decodedSetup.args[0]
    );

    _initializer = {
      safeTarget: decodedAbiParameters[0],
      periodLength: decodedAbiParameters[1],
      cookieAmount: decodedAbiParameters[2],
      cookieToken: decodedAbiParameters[3],
      allowList: decodedAbiParameters[4],
    } as ListInitializer;
  }

  return { _details, _initializer };
};

const handleSimpleDetails = (
  details: string,
  decodedSetup: {
    args: readonly [`0x${string}`];
    functionName: "setUp";
  }
) => {
  let _details = { type: "", title: "", description: "", link: "" };
  let _initializer = {};

  if (details === DETAILS.Baal) {
    _details.type = "Baal";
    _details.title = "Cookie Jar V2";

    const decodedAbiParameters = decodeAbiParameters(
      parseAbiParameters(parameterString.baal),
      decodedSetup.args[0]
    );

    _initializer = {
      safeTarget: decodedAbiParameters[0],
      periodLength: decodedAbiParameters[1],
      cookieAmount: decodedAbiParameters[2],
      cookieToken: decodedAbiParameters[3],
      _dao: decodedAbiParameters[4],
      _threshold: decodedAbiParameters[5],
      _useShares: decodedAbiParameters[6],
      _useLoot: decodedAbiParameters[7],
    } as BaalInitializer;
  }

  if (details === DETAILS.ERC20) {
    _details.type = "ERC20";
    _details.title = "Cookie Jar V2";

    const decodedAbiParameters = decodeAbiParameters(
      parseAbiParameters(parameterString.erc20),
      decodedSetup.args[0]
    );

    _initializer = {
      safeTarget: decodedAbiParameters[0],
      periodLength: decodedAbiParameters[1],
      cookieAmount: decodedAbiParameters[2],
      cookieToken: decodedAbiParameters[3],
      _erc20addr: decodedAbiParameters[4],
      _threshold: decodedAbiParameters[5],
    } as ERC20Initializer;
  }

  if (details === DETAILS.List) {
    _details.type = "List";
    _details.title = "Cookie Jar V2";

    const decodedAbiParameters = decodeAbiParameters(
      parseAbiParameters(parameterString.list),
      decodedSetup.args[0]
    );

    _initializer = {
      safeTarget: decodedAbiParameters[0],
      periodLength: decodedAbiParameters[1],
      cookieAmount: decodedAbiParameters[2],
      cookieToken: decodedAbiParameters[3],
      allowList: (decodedAbiParameters[4] as string[]).map((addr: string) =>
        addr.toLowerCase()
      ),
    } as ListInitializer;
  }

  if (details === DETAILS.ERC721) {
    _details.type = "ERC721";
    _details.title = "Cookie Jar V2";

    const decodedAbiParameters = decodeAbiParameters(
      parseAbiParameters(parameterString.erc721),
      decodedSetup.args[0]
    );

    _initializer = {
      safeTarget: decodedAbiParameters[0],
      periodLength: decodedAbiParameters[1],
      cookieAmount: decodedAbiParameters[2],
      cookieToken: decodedAbiParameters[3],
      _erc721addr: decodedAbiParameters[4],
    } as ERC721Initializer;
  }

  if (details === DETAILS.Open) {
    _details.type = "Open";
    _details.title = "Cookie Jar V2";

    const decodedAbiParameters = decodeAbiParameters(
      parseAbiParameters(parameterString.open),
      decodedSetup.args[0]
    );

    _initializer = {
      safeTarget: decodedAbiParameters[0],
      periodLength: decodedAbiParameters[1],
      cookieAmount: decodedAbiParameters[2],
      cookieToken: decodedAbiParameters[3],
    } as CookieJarInitializer;
  }

  return { _details, _initializer };
};
