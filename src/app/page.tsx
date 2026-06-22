import Footer from "./Nav";
import CalligraphDemo from "../components/CalligraphDemo";
import { Calligraph } from "calligraph";

export default function Home() {
  return (
    <div className="min-h-screen pt-24 md:pt-28 px-6 md:px-12 lg:px-20">
      <div className="w-full max-w-3xl mx-auto">
        <Footer/>
        <main className="w-full">
          <CalligraphDemo />

          <p>Hi i am anmol and this is my corner of internet. I am currently living and working in banglore.</p>

          <p>Some of the things i am interesed in:</p>

          <ul>
            <li>finance</li>
            <li>reading</li>
            <li>tech</li>
            <li>anime</li>
          </ul>

          <p>The thing i care about are art</p>
          <Calligraph>text</Calligraph>
        </main>
      </div>
    </div>
  );
}
