import { BlogHeaderActions } from "@/components/features/blog/blog-header-actions";
import { Navbar } from "@/components/shared/navbar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Article,
  getArticles
} from "@/lib/api/articles-api";
import {
  ArrowRight,
  Eye,
  Filter,
  Heart,
  MessageCircle,
  Search,
} from "lucide-react";
import Link from "next/link";

const categories = [
  "Freelancing",
  "Project Management",
  "Remote Work",
  "Industry Trends",
  "Tips & Tricks",
  "Success Stories",
];

export default async function BlogPage() {
  let articles: Article[] = [];
  let featuredArticles: Article[] = [];
  let popularArticles: Article[] = [];

  try {
    const articlesResponse = await getArticles(1, 12);
    if (articlesResponse.success && articlesResponse.data) {
      articles = articlesResponse.data.articles;
    }
  } catch (error) {
    console.error("Error fetching blog data:", error);
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="mx-auto bg-primary/10 text-primary border-primary/20">
              Articles
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Latest Insights & Trends
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest trends, tips, and insights in
              freelancing, project management, and remote work.
            </p>
            
            <div className="flex justify-center pt-4">
              <BlogHeaderActions />
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center space-x-2 border border-input rounded-lg px-3 py-3">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select className="bg-transparent border-0 focus:outline-none focus:ring-0 text-sm">
                  <option>All Categories</option>
                  <option>Freelancing</option>
                  <option>Project Management</option>
                  <option>Remote Work</option>
                  <option>Industry Trends</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
      {featuredArticles.length > 0 && (
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-foreground">
                Featured Articles
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <Link href={`/articles/${article._id}`} key={article._id}>
                  <Card className="group bg-card border-border hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden">
                    {article.imageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent
                      className={`p-6 ${article.imageUrl ? "pt-4" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{article.viewCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{article.likeCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{article.commentCount}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {article.date}
                          </span>
                          <ArrowRight className="w-4 h-4 text-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                All Articles
              </h2>
              <div className="text-sm text-muted-foreground">
                {articles.length} articles
              </div>
            </div>

            {articles.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {articles.map((article) => (
                  <Link href={`/articles/${article._id}`} key={article._id}>
                    <Card className="group bg-card border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden">
                      {article.imageUrl && (
                        <div className="h-40 overflow-hidden">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent
                        className={`p-6 ${article.imageUrl ? "pt-4" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-muted text-foreground border-border">
                            {article.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {article.readTime}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors mb-2">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{article.viewCount}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-3 h-3" />
                              <span>{article.likeCount}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>{article.commentCount}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {article.date}
                            </span>
                            <ArrowRight className="w-4 h-4 text-foreground group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-foreground">
                  No articles found
                </h3>
                <p className="text-muted-foreground mt-2">
                  Check back later for new content
                </p>
              </div>
            )}
            <div className="flex justify-center mt-12 space-x-2">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    page === 1
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="w-10 h-10 rounded-full border border-border hover:bg-muted flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="lg:w-1/3 space-y-8">
        
            <Card>
              <CardHeader>
                <CardTitle>Popular Articles</CardTitle>
                <CardDescription>
                  Most viewed articles this month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {popularArticles.map((article, index: number) => (
                  <Link
                    href={`/articles/${article._id}`}
                    key={article._id}
                    className="flex items-start space-x-3 group"
                  >
                    <span className="text-lg font-semibold text-muted-foreground min-w-[24px]">
                      {index + 1}.
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <span>{article.viewCount} views</span>
                        <span>•</span>
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Explore articles by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className="px-3 py-1.5 text-sm rounded-full bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stay Updated</CardTitle>
                <CardDescription>
                  Subscribe to our newsletter for the latest articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Subscribe
                  </button>
                  <p className="text-xs text-muted-foreground">
                    By subscribing, you agree to our Privacy Policy and consent
                    to receive updates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
