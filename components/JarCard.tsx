import { CookieJar } from "@/lib/indexer/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { truncateEthereumAddress } from "@/lib/utils";

export const JarCard = ({ cookieJar }: { cookieJar: CookieJar }) => {
  return (
    <Card className="w-full">
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
  );
};
