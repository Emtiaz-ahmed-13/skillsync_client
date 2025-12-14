import { getBlogPosts } from "@/utils/api/blog";
import { formatDate } from "@/utils/helpers/date";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-white"
                >
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="m10 11 5 3-5 3Z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-skillsync-dark-blue to-skillsync-dark-blue/70 bg-clip-text text-transparent">
                SkillSync
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-secondary hover:text-primary-heading transition-colors"
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="text-secondary hover:text-primary-heading transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-secondary hover:text-primary-heading transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary-heading">
            Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest insights, tutorials, and news from the
            SkillSync team.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-skillsync-cyan/50 transition-all duration-300"
              >
                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-skillsync-cyan/10 text-skillsync-cyan-dark rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {post.readTime} min read
                    </span>
                  </div>

                  <h2 className="text-xl font-bold mb-3 text-gray-900">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 mb-4">{post.excerpt}</p>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-primary-heading font-medium text-sm">
                      {post.author.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-primary-heading text-sm">
                        {post.author.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {post.author.role}, {post.author.company}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
