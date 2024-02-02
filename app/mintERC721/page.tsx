"use client";
import { Header } from "../../components/Header";
import CreateJarFormERC721 from "../../components/CreateJarFormERC721";
import Footer from "../../components/Footer";

export default function Mint() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <CreateJarFormERC721 />
      </main>
      <Footer />
    </>
  );
}
