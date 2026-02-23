import Image from "next/image";
import {Notebook} from "lucide-react"
import Footer from "./Nav";

export default function Home() {
  return (
    <div className="items-center flex flex-col gap-6 min-h-screen p-24 px-100">
      <Footer/>
      <main className="w-full">

        Hi i am anmol and this is my corner of internet. I am currently living and working in banglore.

        Some of the things i am interesed in:

        finance

        reading 

        tech

        anime

        The thing i care about are art
      </main>

      
    </div>
  );
}
