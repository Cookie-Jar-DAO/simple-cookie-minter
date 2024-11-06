import Image from "next/image";
import cookieBackground from "@/assets/cookie-background.webp";
import ChainsList from "@/components/chains-list";

export default async function JarsPage() {
  return (
    <div className="max-w-3x container my-8">
      <section className="relative flex w-full flex-col items-center gap-8 overflow-hidden rounded-3xl p-20">
        <div className="absolute inset-0 bg-amber-900 opacity-30" />
        <Image
          src={cookieBackground}
          alt="Background of cookie jars and cookies"
          className="-z-10 bg-center object-cover blur-sm"
          fill
        />
        <ChainsList />
      </section>
    </div>
  );
}
