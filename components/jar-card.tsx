import Link from "next/link";

import { truncateEthereumAddress } from "@/lib/utils";
import { CookieJar } from "@/lib/indexer/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const JarCard = ({ cookieJar }: { cookieJar: CookieJar }) => {
  return (
    <Link href={`/jars/${cookieJar.id}`}>
      <Card className="w-full cursor-pointer hover:bg-amber-200 ">
        <CardHeader>
          <CardTitle>{cookieJar.name}</CardTitle>
          <CardDescription>{cookieJar.description}</CardDescription>
        </CardHeader>
        {/* <CardContent>
          <p>Cookie Jar Token: {cookieJar.cookieToken}</p>
          <p>Cookie Amount: {cookieJar.cookieAmount}</p>

          <p>
            Link:
            {cookieJar.link}
          </p>
        </CardContent> */}
        <CardFooter className=" justify-between">
          <p>Owned by: {truncateEthereumAddress(cookieJar.owner)}</p>
          <p>Claimable every {cookieJar.periodLength} seconds</p>
        </CardFooter>
      </Card>
    </Link>
  );
};
