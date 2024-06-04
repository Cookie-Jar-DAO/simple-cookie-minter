import { useState, useEffect } from "react";
import { Address, isAddress } from "viem";
// import { FetchTokenResult, fetchToken } from "wagmi/actions";
import { ZERO_ADDRESS } from "@/app/constants";
import type { CookieJar } from "@/lib/indexer/db";
// import { useNetwork } from "wagmi";

const useCookieJarToken = ({ cookieJar }: { cookieJar: CookieJar }) => {
	// const { cookieToken } = cookieJar.initializer;
	// const { chainId } = cookieJar;
	// const { chains } = useNetwork();
	// const [token, setToken] = useState<
	//   | FetchTokenResult
	//   | { address: Address; decimals: number; name: string; symbol: string }
	//   | undefined
	// >(undefined);

	// useEffect(() => {
	//   if (cookieToken !== ZERO_ADDRESS && isAddress(cookieToken)) {
	//     const getToken = async () => {
	//       const token = await fetchToken({
	//         address: cookieToken,
	//         chainId: chainId,
	//       });
	//       setToken(token);
	//     };

	//     getToken();
	//   }

	//   if (cookieToken === ZERO_ADDRESS) {
	//     const chain = chains.find((c) => c.id === chainId);
	//     if (!chain) return;
	//     setToken({
	//       address: ZERO_ADDRESS,
	//       decimals: chain?.nativeCurrency.decimals,
	//       name: chain?.nativeCurrency.name,
	//       symbol: chain?.nativeCurrency.symbol,
	//     });
	//   }
	// }, []);

	// return { token };
	return;
};

export default useCookieJarToken;
