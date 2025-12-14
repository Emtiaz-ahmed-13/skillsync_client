import { getBlogPost } from "@/utils/api/blog";
import { formatDate } from "@/utils/helpers/date";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";

export default async function BlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getBlogPost(params.id);

  if (!post) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link
            href="/blog"
            className="text-link hover:underline flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

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
        <article className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="text-link hover:underline flex items-center gap-2 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>

          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="mb-6">
              <span className="text-sm font-semibold px-3 py-1.5 bg-skillsync-cyan/10 text-skillsync-cyan-dark rounded-full">
                {post.category}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-primary-heading font-medium">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-primary-heading">
                  {post.author.name}
                </div>
                <div className="text-sm text-gray-500">
                  {post.author.role}, {post.author.company}
                </div>
              </div>
            </div>

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </main>
    </div>
  );
}
