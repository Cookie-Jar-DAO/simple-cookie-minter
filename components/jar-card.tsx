import Link from "next/link";

import { truncateEthereumAddress } from "@/lib/utils";
import type { CookieJar } from "@/lib/indexer/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CookieJarBalance } from "./cookie-jar-balance";

export const JarCard = ({ cookieJar }: { cookieJar: CookieJar }) => {
  return (
    <Link href={`/jars/${cookieJar.id}`}>
      <Card className="w-full cursor-pointer border-none bg-amber-50 hover:bg-amber-200 hover:bg-opacity-40">
        <CardHeader>
          <CardTitle className="flex text-start">{cookieJar.name}</CardTitle>
          <CardDescription className="flex text-start">
            {cookieJar.description}
          </CardDescription>
        </CardHeader>
        {/* <CardContent>
          <p>Cookie Jar Token: {cookieJar.cookieToken}</p>
          <p>Cookie Amount: {cookieJar.cookieAmount}</p>
          <p>
            Link:
            {cookieJar.link}
          </p>
        </CardContent> */}
        <CardFooter className="justify-left flex-col items-start">
          <p>
            balance <strong>{cookieJar.cookieAmount}</strong>
          </p>
          <p>
            claimable every <strong>{cookieJar.periodLength} seconds</strong>
          </p>
          <p>
            Owned by:{" "}
            <strong>{truncateEthereumAddress(cookieJar.owner)}</strong>
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
};
