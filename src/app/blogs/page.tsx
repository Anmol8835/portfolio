import Link from "next/link";
import Footer from "../Nav";
import { blogs } from "../data/blogs";

export default function Blogs() {
  const sortedBlogs = [...blogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen pt-24 md:pt-28 px-6 md:px-12 lg:px-20">
      <div className="w-full max-w-3xl mx-auto">
        <Footer />
        <main className="w-full mt-12">
          <h1 className="text-4xl font-bold mb-8 text-neutral-900">Blog</h1>

          <div className="space-y-8">
            {sortedBlogs.map((blog) => (
              <article key={blog.slug} className="border-b border-neutral-200 pb-8 last:border-b-0">
                <Link href={`/blogs/${blog.slug}`} className="group">
                  <h2 className="text-2xl font-semibold mb-2 group-hover:underline text-neutral-900">
                    {blog.title}
                  </h2>
                </Link>

                <time className="text-sm mb-3 block text-neutral-600">
                  {new Date(blog.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>

                <p className="mb-4 text-neutral-800">{blog.excerpt}</p>

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
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
