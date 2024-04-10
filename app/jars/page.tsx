"use client";
import { useJars } from "../hooks/useJars";
import { JarCard } from "@/components/JarCard";
import CreateJarFormERC20 from "../../components/CreateJarFormERC20";

export default function Home() {
  const { cookieJars } = useJars();

  if (!cookieJars)
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <CreateJarFormERC20 />
      </main>
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {cookieJars.length > 0 ? (
        <JarCard cookieJar={cookieJars[0]} />
      ) : (
        <CreateJarFormERC20 />
      )}
    </main>
  );
}
