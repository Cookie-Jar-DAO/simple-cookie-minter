export const CookieJarFactory = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "donationToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "donationAmount",
        type: "uint256",
      },
    ],
    name: "DonationReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "cookieJar",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "initializer",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "string",
        name: "details",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "uid",
        type: "string",
      },
    ],
    name: "SummonCookieJar",
    type: "event",
  },
  {
    inputs: [],
    name: "SUSTAINABILITY_ADDR",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_moduleProxyFactory",
        type: "address",
      },
    ],
    name: "setProxyFactory",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_singleton",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_initializer",
        type: "bytes",
      },
      {
        internalType: "string",
        name: "_details",
        type: "string",
      },
      {
        internalType: "address",
        name: "donationToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "donationAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_saltNonce",
        type: "uint256",
      },
    ],
    name: "summonCookieJar",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
