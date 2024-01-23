import { CookieJar } from "@/app/utils/indexer/db";

const JarCard = ({ cookieJar }: { cookieJar: CookieJar }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <p className="mt-3 text-2xl">Your cookieJarId is {cookieJar.jarUid}</p>
    </div>
  );
};

export default JarCard;
