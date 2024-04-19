import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <section className="container flex flex-col items-center gap-8">
      <h1 className="text-5xl font-semibold">Welcome to the COOKIE JAR</h1>
      <Image
        src={"/cookie.png"}
        alt="cookie"
        height={150}
        width={150}
        priority
      />
      <section className="mb-3 text-lg text-white-500 dark:text-white-400 text-center">
        <p className="mb-2">Cookie Jar is a DAO owned slush fund</p>
        <p className="mb-2">
          Cookies have daily limits and can be claimed by anyone on the
          allowlist
        </p>
        <p className="mb-2">Allowlist is managed by theDAO</p>
        <p className="mb-2">Take out the trash? Claim a cookie.</p>
        <p className="mb-2">Don&apos;t forget to leave a note!</p>
        <p className="mb-2">
          But be careful, if you take too many cookies without good reason, you
          might just get kicked out of the DAO!
        </p>
      </section>

      <div>
        <Link href="/jars">
          <Button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Jars
          </Button>
        </Link>
        <Link href="/mintERC20">
          <Button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Mint ERC20 gated Jar
          </Button>
        </Link>
      </div>
    </section>
  );
}
