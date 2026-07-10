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

          <section className="mt-10 space-y-5 text-base md:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            <p className="text-lg md:text-xl text-neutral-900 dark:text-neutral-100 font-medium">
              Hi, I&apos;m Anmol — a software engineer based in Bangalore. I graduated from IIT Ropar and I spend my days building full-stack web apps and backend systems.
            </p>

            <p>
              I work across the stack — React, Next.js, and TypeScript on the frontend, with NestJS, FastAPI, and Flask on the backend. Lately I&apos;ve been deep into LLMs, building an API gateway that unifies multiple AI providers behind a single endpoint.
            </p>

            <p>
              Off the clock, you&apos;ll find me playing football, reading about finance and tech, watching anime, or grinding competitive programming problems.
            </p>
          </section>

          {/* <Calligraph>text</Calligraph> */}
        </main>
      </div>
    </div>
  );
}
