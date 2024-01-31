"use client";
import { Header } from "../../components/Header";
import CreateJarForm from "../../components/CreateJarFormERC20";
import Footer from "../../components/Footer";

export default function Mint() {
  return (
    <>
      <Header />

      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <CreateJarForm />
      </main>

      <Footer />
    </>
  );
}
