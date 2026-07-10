import fs from "fs";
import path from "path";
import Footer from "../Nav";

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
    <div className="min-h-screen pt-24 md:pt-28 px-6 md:px-12 lg:px-20">
      <div className="w-full max-w-3xl mx-auto">
        <Footer />

        <main className="mt-10">
          <section className="space-y-5 text-base md:text-lg leading-relaxed text-neutral-800">
            <p className="text-lg md:text-xl text-neutral-900 font-bold">
              Good reads.
            </p>
            <p>
              Links I&apos;ve enjoyed recently — articles, threads, and tools.
            </p>
          </section>

          {data.length === 0 ? (
            <p className="mt-16 text-center text-neutral-600 text-lg">
              Coming soon.
            </p>
          ) : (
            <section className="mt-10 space-y-6">
              {data.map((item, idx) => (
                <div key={idx}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base md:text-lg font-semibold text-neutral-900 underline underline-offset-2 hover:text-neutral-600"
                  >
                    {item.name}
                  </a>
                  {item.description && (
                    <p className="mt-1 text-base leading-relaxed text-neutral-800">
                      {item.description}
                    </p>
                  )}
                  {item.date && (
                    <p className="mt-1 text-sm text-neutral-600">
                      {item.date}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
