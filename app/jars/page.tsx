"use client";
import Header from "../../components/Header";
import CreateJarForm from "../../components/CreateJarForm";
import Footer from "../../components/Footer";
import { useJars } from "../hooks/useJars";
import JarCard from "@/components/JarCard";

export default function Home() {
  const { cookieJars } = useJars();

  if (!cookieJars)
    return (
      <>
        <Header />

        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <CreateJarForm />
        </main>

        <Footer />
      </>
    );

  return (
    <>
      <Header />

      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {cookieJars.length > 0 ? (
          <JarCard cookieJar={cookieJars[0]} />
        ) : (
          <CreateJarForm />
        )}
      </main>

      <Footer />
    </>
  );
}
