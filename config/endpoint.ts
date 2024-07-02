const production = "https://cookiejar.wtf";
const development = "https://cookiejar-dev.wtf";
const localhost = "http://localhost:3000";

export const getUrl = () => {
	if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "production") {
		return production;
	}
	if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "development") {
		return development;
	}
	return localhost;
};
