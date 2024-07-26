import { useChainId } from "wagmi";
import { getApiEndpoint } from "@/config/endpoint";

export const useGraphApiEndpoint = () => {
	const chainId = useChainId();
	const endpoint = getApiEndpoint(chainId);
	return endpoint;
};
