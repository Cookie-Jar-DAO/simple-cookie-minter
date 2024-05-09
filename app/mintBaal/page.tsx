import Image from "next/image";

import cookieBackground from "@/assets/cookie-background.webp";
import CreateJarFormBaal from "@/components/CreateJarFormBaal";

export default function Mint() {
  return (
    <div className="max-w-3x container my-8">
      <section className="relative flex w-full flex-col items-center gap-8 overflow-hidden rounded-3xl p-20">
        <div className="absolute inset-0 bg-amber-900 opacity-30" />
        {/* <section className="container relative my-8 flex w-full max-w-3xl flex-col items-center gap-8 rounded-xl bg-amber-100 bg-opacity-30 p-8"> */}
        <Image
          src={cookieBackground}
          alt="Background of cookie jars and cookies"
          className="-z-10 bg-center object-cover blur-sm"
          fill
        />
        <div className="relative z-20">
          <CreateJarFormBaal />
        </div>
      </section>
    </div>
  );
}
