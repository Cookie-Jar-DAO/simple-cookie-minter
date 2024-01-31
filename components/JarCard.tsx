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
    <Card>
      <CardHeader>
        <CardTitle>{cookieJar.title}</CardTitle>
        <CardDescription>{cookieJar.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mt-3 text-2xl">Your cookieJarId is {cookieJar.jarUid}</p>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
