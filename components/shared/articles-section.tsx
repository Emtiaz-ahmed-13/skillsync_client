import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Article, getArticles } from "@/lib/api/articles-api";
import { ArrowRight, Calendar, Clock, Eye, Heart, MessageCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Navbar } from "./navbar";

export function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getArticles(1, 3);
        if (response.success && response.data) {
          setArticles(response.data.articles);
        } else {
          setError(response.message || "Failed to load articles");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <>
      <Navbar />
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-background via-background to-muted/20">
      {/* Enhanced Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-muted/30 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Featured Content</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground bg-clip-text">
            Latest Insights & Trends
          </h2>
          
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stay ahead with expert articles, industry insights, and professional tips 
            curated to help you excel in your career.
          </p>
        </div>

        {/* Enhanced Loading State */}
        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <Card
                key={index}
                className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <div className="h-56 bg-gradient-to-br from-muted/50 to-muted/30 animate-pulse" />
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-24 rounded-full bg-muted/50 animate-pulse" />
                    <div className="h-4 w-16 rounded bg-muted/50 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-full rounded bg-muted/50 animate-pulse" />
                    <div className="h-6 w-4/5 rounded bg-muted/50 animate-pulse" />
                  </div>
                  <div className="h-16 w-full rounded bg-muted/30 animate-pulse" />
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex gap-4">
                      <div className="h-4 w-12 rounded bg-muted/50 animate-pulse" />
                      <div className="h-4 w-12 rounded bg-muted/50 animate-pulse" />
                      <div className="h-4 w-12 rounded bg-muted/50 animate-pulse" />
                    </div>
                    <div className="h-4 w-20 rounded bg-muted/50 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <MessageCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Unable to Load Articles
            </h3>
            <p className="text-muted-foreground">
              {error}
            </p>
          </div>
        )}

        {/* Enhanced Articles Grid */}
        {!loading && !error && (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Card
                  key={article._id}
                  className="group relative overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
                >
                  {/* Image with overlay gradient */}
                  {article.imageUrl && (
                    <div className="relative h-56 overflow-hidden bg-muted">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-card/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                    </div>
                  )}

                  <CardContent className={`p-6 space-y-4 ${!article.imageUrl ? "pt-8" : ""}`}>
                    {/* Category and Read Time */}
                    <div className="flex items-center justify-between gap-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors font-medium px-3 py-1">
                        {article.category}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="font-medium">{article.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary line-clamp-2 min-h-[3.5rem]">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 min-h-[4rem]">
                      {article.excerpt}
                    </p>

                    {/* Footer with stats and date */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                          <span className="font-medium">{article.viewCount}</span>
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                          <Heart className="h-3.5 w-3.5" />
                          <span className="font-medium">{article.likeCount}</span>
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span className="font-medium">{article.commentCount}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="font-medium">{article.date}</span>
                      </div>
                    </div>

                    {/* Read More Link */}
                    <div className="pt-2">
                      <a
                        href={`/articles/${article._id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-300"
                      >
                        Read Article
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enhanced Footer CTA */}
            <div className="mt-20 text-center">
              <a
                href="/articles"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-105"
              >
                Explore All Articles
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </>
        )}
      </div>
    </section>
    </>
  );
}
