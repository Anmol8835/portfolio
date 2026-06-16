"use client";

import { useEffect, useState } from "react";
import { Calligraph } from "calligraph";

const PHRASES = ["Craft", "Create", "Design", "Build"];

export default function CalligraphDemo() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % PHRASES.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="mb-12" aria-label="Calligraph demo">

      <div className="rounded-2xl bg-neutral-100 dark:bg-neutral-900 px-10 py-16 md:px-14 md:py-20 flex items-center justify-center min-h-[180px]">
        <Calligraph
          as="span"
          variant="text"
          animation="smooth"
          initial
          className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50"
        >
          {PHRASES[index]}
        </Calligraph>
      </div>
    </section>
  );
}
