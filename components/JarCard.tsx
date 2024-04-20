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
import { Button } from "./ui/button";

export const JarCard = ({ cookieJar }: { cookieJar: CookieJar }) => {
  return (
    <Link href={`/jars/${cookieJar.id}`}>
      <Card className="w-full cursor-pointer hover:bg-slate-100 ">
        <CardHeader>
          <CardTitle>{cookieJar.name}</CardTitle>
          <CardDescription>{cookieJar.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mt-3 text-2xl">
            Your cookieJarId is {truncateEthereumAddress(cookieJar.id)}
          </p>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </Link>
  );
};
