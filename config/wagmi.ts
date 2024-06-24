import {
	createConfig,
	http,
	fallback,
	createStorage,
	cookieStorage,
} from "wagmi";
import { walletConnect } from "wagmi/connectors";
import { sepolia } from "wagmi/chains";

export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
	name: "Cookie Jar",
	description: "Give your friends cookies",
	url: "http://cookiejar.wtf/", // origin must match your domain & subdomain
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const wagmiConfig = createConfig({
	chains: [sepolia],
	ssr: true,
	connectors: [
		walletConnect({
			projectId: projectId,
		}),
	],
	storage: createStorage({
		storage: cookieStorage,
	}),
	transports: {
		[sepolia.id]: http(
			`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
		),
		fallback: fallback([
			http(`https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`),
		]),
	},
});
