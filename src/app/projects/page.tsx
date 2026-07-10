import Footer from "../Nav";

type Project = {
  title: string;
  when: string;
  stack: string;
  description: string;
  link?: string;
};

const PROJECTS: Project[] = [
  {
    title: "LLM Proxy",
    when: "June 2026 – Ongoing",
    stack: "Python / Flask / SQLAlchemy",
    description:
      "REST API gateway that unifies OpenAI, Anthropic, Gemini, and DeepSeek behind a single Anthropic-compatible endpoint. Supports request/response and SSE streaming translation across providers, cross-provider tool-calling across 11+ models, and a hybrid classifier with cost-aware routing that auto-selects the best model per request.",
  },
  {
    title: "AlgoUniversity Online Judge",
    when: "May 2024 – July 2024",
    stack: "React / Node.js / Express / MongoDB / Docker / AWS EC2",
    link: "https://oj-inky.vercel.app",
    description:
      "Designed an end-to-end testing framework for AlgoUniversity's online judge system, improving stability for competitive programming events. Built the platform on the MERN stack with Docker for sandboxing and AWS EC2 for scalable deployment.",
  },
  {
    title: "Shortest Path — Dijkstra's Algorithm",
    when: "June 2023 – July 2023",
    stack: "Python / Algorithms / Data Structures",
    description:
      "Implemented Dijkstra's algorithm to find optimal routes across IIT Ropar's 60-acre campus. Built a graphical visualization comparing path efficiency against alternative approaches.",
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-28 px-6 md:px-12 lg:px-20">
      <div className="w-full max-w-3xl mx-auto">
        <Footer />

        <main className="mt-10">
          <section className="space-y-5 text-base md:text-lg leading-relaxed text-neutral-800">
            <p className="text-lg md:text-xl text-neutral-900 font-medium">
              Things I&apos;ve built.
            </p>
            <p>
              A few side projects I&apos;ve worked on — mostly backend-heavy,
              with some dipping into cryptography, algorithms, and the LLM space.
            </p>
          </section>

          <section className="mt-12 space-y-10">
            {PROJECTS.map((p) => (
              <div key={p.title}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="text-lg md:text-xl font-semibold text-neutral-900">
                      {p.title}
                    </h2>
                    <span className="text-sm text-neutral-500">
                      {p.when}
                    </span>
                  </div>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-900 underline underline-offset-2 hover:text-neutral-600"
                    >
                      {p.link.replace("https://", "")}
                    </a>
                  )}
                </div>
                <p className="mt-1 text-sm font-mono text-neutral-600">
                  {p.stack}
                </p>
                <p className="mt-3 text-base leading-relaxed text-neutral-800">
                  {p.description}
                </p>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
