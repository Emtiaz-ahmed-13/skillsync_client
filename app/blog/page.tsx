import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Tips for Managing Remote Teams Effectively",
      excerpt:
        "Discover proven strategies for leading distributed teams and maintaining productivity across time zones.",
      date: "Oct 15, 2025",
      readTime: "5 min read",
      category: "Management",
    },
    {
      id: 2,
      title: "The Future of Freelance Marketplaces",
      excerpt:
        "How platforms like SkillSync are reshaping the gig economy with advanced collaboration tools.",
      date: "Oct 8, 2025",
      readTime: "7 min read",
      category: "Industry Trends",
    },
    {
      id: 3,
      title: "Maximizing Your Earnings on SkillSync",
      excerpt:
        "Expert advice on building a strong profile, setting competitive rates, and winning more projects.",
      date: "Oct 1, 2025",
      readTime: "4 min read",
      category: "Freelancing",
    },
    {
      id: 4,
      title: "Building Trust with Clients in the Digital Age",
      excerpt:
        "Essential communication skills and practices for establishing strong client relationships remotely.",
      date: "Sep 25, 2025",
      readTime: "6 min read",
      category: "Communication",
    },
    {
      id: 5,
      title: "Project Milestone Best Practices",
      excerpt:
        "How to structure project milestones for clear deliverables, realistic timelines, and smooth payments.",
      date: "Sep 18, 2025",
      readTime: "5 min read",
      category: "Project Management",
    },
    {
      id: 6,
      title: "Security Tips for Freelancers and Clients",
      excerpt:
        "Protecting sensitive information and ensuring secure transactions on collaborative platforms.",
      date: "Sep 12, 2025",
      readTime: "4 min read",
      category: "Security",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A192F] text-gray-900 dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0A192F]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#64FFDA] to-[#0A8B8B] rounded-xl flex items-center justify-center shadow-md">
                <Zap className="w-6 h-6 text-[#0A192F]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-[#0A192F] to-[#0A192F]/70 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
                  SkillSync
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Professional Collaboration
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Back to Home
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            SkillSync Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Insights, tips, and industry trends for freelancers and clients
            working together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-[#112240] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-xl hover:border-[#64FFDA]/50 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {post.date}
                  </span>
                </div>

                <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {post.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {post.readTime}
                  </span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/blog/${post.id}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
