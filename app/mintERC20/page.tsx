"use client";
import { Header } from "../../components/Header";
import CreateJarFormERC20 from "../../components/CreateJarFormERC20";
import Footer from "../../components/Footer";

export default function Mint() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <CreateJarFormERC20 />
      </main>
      <Footer />
    </>
  );
}
