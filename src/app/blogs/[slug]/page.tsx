import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "../../Nav";
import { blogs } from "../../data/blogs";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt,
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-24 md:pt-28 px-6 md:px-12 lg:px-20">
      <div className="w-full max-w-3xl mx-auto">
        <Footer />
        <main className="w-full mt-12">
          <Link
            href="/blogs"
            className="inline-block mb-8 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            ← Back to all posts
          </Link>

          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-neutral-900">{blog.title}</h1>

              <time className="text-sm block mb-4 text-neutral-600">
                {new Date(blog.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>

              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div className="prose prose-gray max-w-none">
              {blog.content.split("\n").map((paragraph, index) => {
                if (paragraph.trim() === "") {
                  return null;
                }

                // Handle headings
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-neutral-900">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }

                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-neutral-900">
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }

                // Handle list items
                if (paragraph.startsWith("- ")) {
                  return (
                    <li key={index} className="ml-6 mb-2 text-neutral-800">
                      {paragraph.replace("- ", "").replace(/\*\*(.*?)\*\*/g, (_, text) => text)}
                    </li>
                  );
                }

                // Handle numbered lists
                if (/^\d+\.\s/.test(paragraph)) {
                  return (
                    <li key={index} className="ml-6 mb-2 text-neutral-800">
                      {paragraph.replace(/^\d+\.\s/, "")}
                    </li>
                  );
                }

                // Handle code blocks
                if (paragraph.startsWith("```")) {
                  return null; // Skip code block markers for now
                }

                // Regular paragraphs with basic markdown support
                const processedParagraph = paragraph
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 py-0.5 rounded text-sm">$1</code>');

                return (
                  <p
                    key={index}
                    className="mb-4 leading-relaxed text-neutral-800"
                    dangerouslySetInnerHTML={{ __html: processedParagraph }}
                  />
                );
              })}
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
