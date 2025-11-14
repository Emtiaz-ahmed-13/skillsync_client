import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock data for blog posts
const blogPosts = [
  {
    id: "1",
    title: "10 Tips for Managing Remote Teams Effectively",
    excerpt:
      "Discover proven strategies for leading distributed teams and maintaining productivity across time zones.",
    date: "Oct 15, 2025",
    readTime: "5 min read",
    category: "Management",
    content: `
      <p>Managing remote teams has become a critical skill in today's digital workplace. With the right strategies, you can lead your team to success regardless of geographical boundaries.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Establish Clear Communication Channels</h2>
      <p>Set up regular check-ins and define which communication tools to use for different purposes. Whether it's Slack for quick questions or Zoom for team meetings, clarity reduces confusion.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">2. Set Measurable Goals</h2>
      <p>Remote work requires a results-oriented approach. Define clear, measurable objectives that team members can work towards independently.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">3. Foster Team Connection</h2>
      <p>Schedule virtual coffee breaks or team-building activities to maintain personal connections. A strong team bond improves collaboration and morale.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">4. Provide the Right Tools</h2>
      <p>Invest in collaboration platforms, project management software, and security tools that enable seamless remote work.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">5. Trust Your Team</h2>
      <p>Focus on outcomes rather than monitoring every action. Trust empowers team members to take ownership of their work.</p>
      
      <p className="mt-8">These strategies, when implemented consistently, can transform your remote team into a high-performing unit that delivers exceptional results.</p>
    `,
  },
  {
    id: "2",
    title: "The Future of Freelance Marketplaces",
    excerpt:
      "How platforms like SkillSync are reshaping the gig economy with advanced collaboration tools.",
    date: "Oct 8, 2025",
    readTime: "7 min read",
    category: "Industry Trends",
    content: `
      <p>The freelance economy is experiencing unprecedented growth, and platforms like SkillSync are at the forefront of this transformation.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Evolution of Freelance Platforms</h2>
      <p>Traditional freelance marketplaces focused primarily on connecting clients with freelancers. Modern platforms like SkillSync offer comprehensive solutions that support the entire project lifecycle.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Integrated Project Management</h2>
      <p>Today's platforms provide built-in tools for task management, milestone tracking, and time logging, eliminating the need for multiple software solutions.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Secure Payment Systems</h2>
      <p>Escrow services and milestone-based payments protect both clients and freelancers, building trust in the platform ecosystem.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">AI-Powered Matching</h2>
      <p>Advanced algorithms match clients with freelancers based on skills, experience, and project requirements, improving success rates.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">The Road Ahead</h2>
      <p>As technology continues to evolve, we can expect even more sophisticated features that enhance collaboration and streamline the freelance experience.</p>
    `,
  },
  // Add more blog posts as needed
];

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === params.id);

  if (!post) {
    notFound();
  }

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
              <Link href="/blog">
                <Button variant="ghost" size="sm">
                  Back to Blog
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-[#0A8B8B] dark:text-[#64FFDA] hover:underline flex items-center gap-2"
            >
              ← Back to Blog
            </Link>
          </div>

          <div className="bg-white dark:bg-[#112240] rounded-xl border border-gray-200 dark:border-white/10 p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold px-3 py-1.5 bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] rounded-full">
                {post.category}
              </span>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {post.date} • {post.readTime}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              {post.title}
            </h1>

            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          <div className="mt-12 flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/blog">← Back to Blog</Link>
            </Button>
            <Button asChild>
              <Link href="/">Visit SkillSync</Link>
            </Button>
          </div>
        </article>
      </main>
    </div>
  );
}
