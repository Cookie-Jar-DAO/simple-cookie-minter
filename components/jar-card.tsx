import Link from "next/link";

import { truncateEthereumAddress } from "@/lib/utils";
import type { CookieJar } from "@/lib/indexer/db";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { chainMetadata } from "@/config/endpoint";

export const JarCard = ({ cookieJar }: { cookieJar: CookieJar }) => {
  return (
    <Link href={`/jars/${cookieJar.id}`}>
      <Card className="w-full min-w-[690px] cursor-pointer border-none bg-amber-50 hover:bg-amber-200 hover:bg-opacity-40">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-start">{cookieJar.name}</CardTitle>
            <div className="flex justify-center">
              <Image
                src={chainMetadata[cookieJar.chainId].logo}
                title={chainMetadata[cookieJar.chainId].name}
                alt="Chain logo"
                width={24}
                height={24}
                className="mr-2 inline-block"
              />
              <span className="font-l text-base font-normal">
                {chainMetadata[cookieJar.chainId].name}
              </span>
            </div>
          </div>
          <CardDescription className="flex text-start">
            {cookieJar.description}
          </CardDescription>
        </CardHeader>
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
