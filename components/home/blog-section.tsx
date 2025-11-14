import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function BlogSection() {
  const articles = [
    {
      title: "10 Tips for Managing Remote Teams Effectively",
      excerpt:
        "Discover proven strategies for leading distributed teams and maintaining productivity across time zones.",
      date: "Oct 15, 2025",
      readTime: "5 min read",
      category: "Management",
    },
    {
      title: "The Future of Freelance Marketplaces",
      excerpt:
        "How platforms like SkillSync are reshaping the gig economy with advanced collaboration tools.",
      date: "Oct 8, 2025",
      readTime: "7 min read",
      category: "Industry Trends",
    },
    {
      title: "Maximizing Your Earnings on SkillSync",
      excerpt:
        "Expert advice on building a strong profile, setting competitive rates, and winning more projects.",
      date: "Oct 1, 2025",
      readTime: "4 min read",
      category: "Freelancing",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-[#0A192F]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="mx-auto bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] border-[#64FFDA]/20">
            Blog
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Latest Insights
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Stay updated with the latest trends and tips for professional
            collaboration
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Card
              key={index}
              className="group bg-white dark:bg-[#112240] border-gray-200 dark:border-white/10 hover:shadow-xl hover:border-[#64FFDA]/50 transition-all duration-300"
            >
              <CardContent className="p-6 space-y-4">
                <div>
                  <Badge className="mb-3 bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] border-[#64FFDA]/20">
                    {article.category}
                  </Badge>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-[#64FFDA] transition-colors">
                    {article.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span>{article.date}</span> •{" "}
                    <span>{article.readTime}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#64FFDA] group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 text-[#0A8B8B] dark:text-[#64FFDA] font-semibold hover:underline">
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
