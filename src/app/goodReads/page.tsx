import fs from "fs";
import path from "path";
import React from "react";
import Footer from "../Nav";
import { ExternalLink, Calendar } from "lucide-react";

type GoodRead = { name: string; description?: string; link?: string; date?: string };

export default function GoodReads() {
    const filePath = path.join(process.cwd(), "src", "app", "data", "goodReads.md");
    let data: GoodRead[] = [];

    try {
        const raw = fs.readFileSync(filePath, "utf8").trim();
        try {
            data = JSON.parse(raw);
        } catch (e) {
            const m = raw.match(/[\[{][\s\S]*[\]}]/);
            if (m) data = JSON.parse(m[0]);
        }
    } catch (err) {
        // file missing or unreadable — leave data empty
    }

    return (
        <div className="relative isolate min-h-screen overflow-hidden pt-24 md:pt-28 px-6 md:px-12 lg:px-20">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 bg-white dark:bg-neutral-950"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[1]
                bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)]
                bg-[size:18px_18px]
                dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.09)_1px,transparent_1px)]
                [mask-image:radial-gradient(ellipse_92%_88%_at_50%_45%,black_25%,transparent_72%)]
                [-webkit-mask-image:radial-gradient(ellipse_92%_88%_at_50%_45%,black_25%,transparent_72%)]"
            />
            <div className="relative z-[2] w-full max-w-3xl mx-auto">
            <Footer />
            <header className="pt-10 pb-10">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Good reads
                </h1>
                <p className="mt-2 text-base md:text-lg text-neutral-600 dark:text-neutral-400">
                    Links I’ve enjoyed recently — articles, threads, and tools.
                </p>
            </header>

            {data.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-neutral-500 dark:text-neutral-400 text-lg">Coming soon</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {data.map((item, idx) => (
                        <article
                            key={idx}
                            className="group rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/40 backdrop-blur px-5 py-4 transition-colors hover:bg-white dark:hover:bg-neutral-950"
                        >
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-start justify-between gap-4 w-full"
                            >
                                <div className="min-w-0">
                                    <h2 className="text-base md:text-lg font-medium text-neutral-900 dark:text-neutral-50 leading-snug">
                                        {item.name}
                                    </h2>
                                    {item.description && (
                                        <p className="mt-1 text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                                <ExternalLink className="w-4 h-4 shrink-0 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors mt-1" />
                            </a>
                            {item.date && (
                                <div className="mt-3 flex items-center gap-2 text-xs md:text-sm text-neutral-500 dark:text-neutral-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>{item.date}</span>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}
            </div>
        </div>
    );
}