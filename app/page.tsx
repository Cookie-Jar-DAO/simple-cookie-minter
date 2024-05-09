import Link from "next/link";
import Image from "next/image";

import cookieBackground from "@/assets/cookie-background.webp";

import jar from "@/assets/jar.webp";
import calendar from "@/assets/calendar.webp";
import cookieDao from "@/assets/cookie-dao.webp";

import { Button } from "@/components/ui/button";

const features = [
  {
    name: "Daily Limits",
    description:
      "Cookie Jars have daily limits and can be claimed by anyone on the allowlist",
    href: "#",
    img: {
      src: jar,
      alt: "Cookie jar full of cookies",
    },
  },
  {
    name: "Take out the trash?",
    description:
      "Claim cookies for doing tasks like taking out the trash, paying for services, but don&apos;t forget to leave a note!",
    href: "#",
    img: {
      src: calendar,
      alt: "Calendar with a cookies",
    },
  },
  {
    name: "Managed by your DAO",
    description:
      "Be careful, if you take too many cookies without good reason, you might just get kicked out of the DAO!",
    href: "#",
    img: {
      src: cookieDao,
      alt: "Group of people staring at a giant cookie",
    },
  },
];

export default async function Home() {
  return (
    <div className="max-w-3x container my-8 flex flex-col items-center gap-8">
      <header className="relative w-full overflow-hidden rounded-3xl p-20">
        <Image
          src={cookieBackground}
          alt="Background of cookie jars and cookies"
          className="-z-10 bg-center object-cover"
          fill
        />
        <div className="absolute inset-0 bg-amber-900 opacity-30" />
        <div className="relative z-20 flex flex-col items-center text-center">
          <h1 className="font-gluten relative z-30 text-[6rem] font-extrabold text-amber-50">
            Welcome to
          </h1>
          <Image
            src={"/cookie-jar.png"}
            alt="Cookie Jar"
            height={400}
            width={400}
            priority
          />
        </div>
      </header>
      <section className="flex flex-col gap-12 rounded-xl bg-amber-100 bg-opacity-90 p-8 text-center">
        <div className="mx-auto flex max-w-md flex-col gap-4">
          <h2 className="font-gluten text-4xl">What is Cookie Jar?</h2>
          <p className="mb">
            Cookie Jar is a community-driven rewards pool managed by a DAO. It’s
            all about fair play – take only what you need and contribute to the
            community.
          </p>
          <div className="flex justify-center gap-4">
            <Link className="w-[150px]" href="/jars">
              <Button className="w-full" size="lg" variant="outline">
                See all Jars
              </Button>
            </Link>
            <Link className="w-[150px]" href="/mintERC20">
              <Button className="w-full" size="lg">
                Create Jar
              </Button>
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h3 className="font-gluten my-4 text-4xl">How it works</h3>
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex flex-col items-center justify-center gap-6 text-xl font-bold leading-7 text-gray-900">
                  <Image
                    src={feature.img.src}
                    alt={feature.img.alt}
                    height={275}
                    width={215}
                    className="h-[275px] w-[215px] flex-none text-amber-600"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
