import Image from "next/image";

import cookieBackground from "@/assets/cookie-background.webp";
import { Card } from "@/components/ui/card";
import { JarForm } from "@/components/create-jar/jar-form";
import { MultiStepJarForm } from "@/components/create-jar/multi-step-jar-form";

export default function MintJar() {
  return (
    <div className="max-w-3x container my-8">
      <section className="relative flex w-full flex-col items-center gap-8 overflow-hidden rounded-3xl p-20">
        {/* <JarForm /> */}
        <MultiStepJarForm />
      </section>
    </div>
  );
}
