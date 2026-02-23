import fs from "fs";
import path from "path";
import React from "react";
import Footer from "../Nav";
import { BookOpen, ExternalLink, Calendar } from "lucide-react";

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
        <div className="min-h-screen px-100 py-13">
            <div className="mt-10">
                <Footer />
            </div>
            <header className="pb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                        <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Good Reads
                    </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Interesting articles, tweets, and resources I've come across.
                </p>
            </header>

            {data.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">Coming soon</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.map((item, idx) => (
                        <article
                            key={idx}
                            className=""
                        >
                            <div className="">
                                <div >
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xl font-semibold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors inline-flex items-center gap-2"
                                    >
                                        {item.name}
                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                    {item.description && (
                                        <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {item.date && (
                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    <span>{item.date}</span>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}

        </div>
    );
}