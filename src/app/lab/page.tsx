"use client";

import React, { useMemo, useState } from "react";
import Footer from "../Nav";
import { Calligraph } from "calligraph";

const SAMPLE = [
  "A Living Manual for Better Interfaces.",
  "Craft",
  "Build",
  "Design systems, not screens.",
];

export default function LabPage() {
  const [title, setTitle] = useState(SAMPLE[0]);
  const [body, setBody] = useState(
    "This is a sandbox page to experiment with spacing, type, and components. Change values below to see how the UI feels."
  );
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [maxWidth, setMaxWidth] = useState<"2xl" | "3xl" | "4xl">("3xl");

  const container = useMemo(() => {
    const width =
      maxWidth === "2xl"
        ? "max-w-2xl"
        : maxWidth === "4xl"
          ? "max-w-4xl"
          : "max-w-3xl";
    const gap = density === "compact" ? "gap-4" : "gap-6";
    const pad = density === "compact" ? "py-4" : "py-6";
    return { width, gap, pad };
  }, [density, maxWidth]);

  return (
    <div className="relative isolate min-h-screen overflow-hidden pt-24 md:pt-28 px-6 md:px-12 lg:px-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-white dark:bg-[#070B18]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]
        bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)]
        bg-[size:18px_18px]
        dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.09)_1px,transparent_1px)]"
      />
      <div className={`relative z-[2] w-full ${container.width} mx-auto`}>
        <Footer />

        <header className="pt-10 pb-10">
          <p className="text-sm text-[color:#0C214D] dark:text-[color:#DC2626]">
            Lab
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-[color:#0C214D] dark:text-white">
            UI Playground
          </h1>
          <p className="mt-2 text-base md:text-lg text-[color:#2A3F6A] dark:text-neutral-300">
            Tweak controls and refresh styles quickly without touching real pages.
          </p>
        </header>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${container.gap}`}>
          <section className={`rounded-2xl border border-[color:#0C214D]/20 dark:border-[color:#7F1D1D]/35 bg-white/70 dark:bg-[#070B18]/70 backdrop-blur px-5 ${container.pad}`}>
            <h2 className="text-sm font-medium text-[color:#0C214D] dark:text-white">
              Controls
            </h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-[color:#2A3F6A] dark:text-neutral-300">
                  Max width
                </label>
                <div className="flex gap-2">
                  {(["2xl", "3xl", "4xl"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setMaxWidth(v)}
                      className={[
                        "rounded-xl px-3 py-2 text-sm border transition-colors",
                        maxWidth === v
                          ? "border-[color:#991B1B]/70 text-[color:#0C214D] dark:text-white bg-[color:#991B1B]/10"
                          : "border-[color:#0C214D]/20 dark:border-white/10 text-[color:#2A3F6A] dark:text-neutral-300 hover:text-[color:#0C214D] dark:hover:text-white hover:border-[color:#0C214D]/35 dark:hover:border-white/20",
                      ].join(" ")}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[color:#2A3F6A] dark:text-neutral-300">
                  Density
                </label>
                <div className="flex gap-2">
                  {(["comfortable", "compact"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setDensity(v)}
                      className={[
                        "rounded-xl px-3 py-2 text-sm border transition-colors capitalize",
                        density === v
                          ? "border-[color:#991B1B]/70 text-[color:#0C214D] dark:text-white bg-[color:#991B1B]/10"
                          : "border-[color:#0C214D]/20 dark:border-white/10 text-[color:#2A3F6A] dark:text-neutral-300 hover:text-[color:#0C214D] dark:hover:text-white hover:border-[color:#0C214D]/35 dark:hover:border-white/20",
                      ].join(" ")}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[color:#2A3F6A] dark:text-neutral-300">
                  Title text
                </label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[color:#0C214D]/20 dark:border-white/10 bg-white/80 dark:bg-[#070B18]/50 px-3 py-2 text-sm text-[color:#0C214D] dark:text-white"
                >
                  {SAMPLE.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[color:#2A3F6A] dark:text-neutral-300">
                  Body text
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[color:#0C214D]/20 dark:border-white/10 bg-white/80 dark:bg-[#070B18]/50 px-3 py-2 text-sm text-[color:#0C214D] dark:text-white"
                />
              </div>
            </div>
          </section>

          <section className={`rounded-2xl border border-[color:#0C214D]/20 dark:border-[color:#7F1D1D]/35 bg-white/70 dark:bg-[#070B18]/70 backdrop-blur px-5 ${container.pad}`}>
            <h2 className="text-sm font-medium text-[color:#0C214D] dark:text-white">
              Preview
            </h2>

            <div className="mt-5 rounded-2xl bg-[color:#F6F8FF] dark:bg-[#0A1026] px-8 py-12 flex items-center justify-center border border-[color:#0C214D]/10 dark:border-white/10">
              <Calligraph
                as="span"
                initial
                animation="smooth"
                className="text-4xl md:text-5xl font-semibold tracking-tight text-[color:#0C214D] dark:text-white text-center"
              >
                {title}
              </Calligraph>
            </div>

            <p className="mt-4 text-sm md:text-base text-[color:#1F335C] dark:text-neutral-300 leading-relaxed">
              {body}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-xl bg-[color:#991B1B] text-white px-4 py-2 text-sm font-medium hover:bg-[color:#7F1D1D] transition-colors"
              >
                Primary
              </button>
              <button
                type="button"
                className="rounded-xl border border-[color:#0C214D]/25 dark:border-white/15 px-4 py-2 text-sm font-medium text-[color:#0C214D] dark:text-white hover:bg-[color:#0C214D]/5 dark:hover:bg-white/5 transition-colors"
              >
                Secondary
              </button>
              <button
                type="button"
                className="rounded-xl px-4 py-2 text-sm font-medium text-[color:#2A3F6A] dark:text-neutral-300 hover:text-[color:#991B1B] transition-colors"
              >
                Ghost
              </button>
            </div>
          </section>
        </div>

        <div className="h-16" />
      </div>
    </div>
  );
}

