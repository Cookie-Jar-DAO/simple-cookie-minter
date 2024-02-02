"use client";
import { Header } from "../../components/Header";
import CreateJarFormBaal from "../../components/CreateJarFormBaal";
import Footer from "../../components/Footer";

export default function Mint() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <CreateJarFormBaal />
      </main>
      <Footer />
    </>
  );
}
