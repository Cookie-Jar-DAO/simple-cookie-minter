import Link from "next/link";
import Image from "next/image";

import { Cookie, CalendarClock, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    name: "Daily Limits",
    description:
      "Cookie Jars have daily limits and can be claimed by anyone on the allowlist",
    href: "#",
    icon: CalendarClock,
  },
  {
    name: "Take out the trash?",
    description:
      "Claim cookies for doing tasks like taking out the trash, paying for services, but don&apos;t forget to leave a note!",
    href: "#",
    icon: Trash2,
  },
  {
    name: "Managed by your DAO",
    description:
      "Be careful, if you take too many cookies without good reason, you might just get kicked out of the DAO!",
    href: "#",
    icon: Cookie,
  },
];

export default async function Home() {
  return (
    <section className="container flex flex-col items-center gap-8 my-8 max-w-3x">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-amber-100 rounded-xl border-4 p-8 border-amber-950">
          Welcome to
        </h1>
        <Image
          src={"/cookie-jar.png"}
          alt="Cookie Jar"
          height={450}
          width={450}
          priority
        />
      </div>
      <div className="flex flex-col gap-8 text-center bg-amber-100 bg-opacity-90 rounded-xl p-8">
        <div className="mb-2">
          <h2 className="text-3xl font-bold">What is Cookie Jar?</h2>
          <p className="mb">A DAO owned slush fund</p>
        </div>
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex flex-col items-center justify-center gap-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-16 w-16 flex-none text-amber-600"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <Link href="/jars">
            <Button className="text-white bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Jars
            </Button>
          </Link>
          <Link href="/mintERC20">
            <Button className="text-white bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Mint ERC20 gated Jar
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
