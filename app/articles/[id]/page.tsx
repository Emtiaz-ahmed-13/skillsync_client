import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getArticleById, incrementArticleView } from "@/lib/api/articles-api";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = params;

  let article = null;
  let error = null;

  try {
    // Fetch the article from the API
    const response = await getArticleById(id);
    if (response.success && response.data) {
      article = response.data;

      // Increment the view count
      await incrementArticleView(id);
    } else {
      error = response.message || "Article not found";
    }
  } catch (err) {
    console.error("Error fetching article:", err);
    error = "Failed to load article";
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            {error || "The article you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/articles"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Link>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              {article.category}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {article.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-foreground" />
                </div>
                <span className="font-medium text-foreground">
                  {article.author.name}
                </span>
              </div>

              <div className="hidden md:block w-1 h-1 rounded-full bg-muted-foreground"></div>

              <div className="flex items-center space-x-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{article.date}</span>
              </div>

              <div className="flex items-center space-x-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{article.viewCount}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span>{article.likeCount}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>{article.commentCount}</span>
              </div>
            </div>
          </div>

          {/* Article Image */}
          {article.imageUrl && (
            <div className="mb-10 rounded-xl overflow-hidden">
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={800}
                height={400}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground">
            <p className="text-xl text-muted-foreground mb-6">
              {article.excerpt}
            </p>

            {article.content
              .split("\n")
              .map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}

            <h2 className="text-2xl font-bold mt-8 mb-4">Key Takeaways</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Understand the core principles before implementation</li>
              <li>Plan your approach carefully to avoid common pitfalls</li>
              <li>Test your solution thoroughly before deployment</li>
              <li>Keep learning and adapting to new trends</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
            <p className="mb-6">
              In conclusion, implementing best practices in your workflow can
              significantly improve your results. Whether you're managing a
              team, working on a project, or developing your skills, these
              insights can help you achieve better outcomes.
            </p>
          </div>
        </article>

        {/* Article Actions */}
        <div className="max-w-4xl mx-auto mt-12 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Like ({article.likeCount})</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Comment ({article.commentCount})</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4" />
              <span>Save</span>
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>

        {/* Related Articles */}
        <section className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This would be populated with related articles */}
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-32 bg-muted rounded mb-4"></div>
              <h3 className="font-semibold text-foreground mb-2">
                Related Article Title
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Brief description of the related article...
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  5 min read
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-32 bg-muted rounded mb-4"></div>
              <h3 className="font-semibold text-foreground mb-2">
                Another Related Article
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Brief description of the related article...
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  7 min read
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-32 bg-muted rounded mb-4"></div>
              <h3 className="font-semibold text-foreground mb-2">
                More Related Content
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Brief description of the related article...
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  4 min read
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </section>

        {/* Comments Section */}
        <section className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Comments ({article.commentCount})
          </h2>

          <div className="space-y-6">
            {/* Comment Form */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-4">
                Add a Comment
              </h3>
              <textarea
                placeholder="Share your thoughts..."
                className="w-full p-3 border rounded-lg min-h-[100px]"
              ></textarea>
              <div className="mt-3 flex justify-end">
                <Button>Post Comment</Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {/* Sample comment */}
              <div className="border-b pb-6 last:border-0 last:pb-0">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">John Doe</h4>
                      <span className="text-sm text-muted-foreground">
                        2 days ago
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      This article was really helpful! I implemented some of
                      these strategies and saw great results.
                    </p>
                    <div className="mt-3 flex space-x-4">
                      <button className="text-sm text-muted-foreground hover:text-foreground flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>5</span>
                      </button>
                      <button className="text-sm text-muted-foreground hover:text-foreground">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Another sample comment */}
              <div className="border-b pb-6 last:border-0 last:pb-0">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">
                        Jane Smith
                      </h4>
                      <span className="text-sm text-muted-foreground">
                        1 day ago
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      Great insights! I particularly liked the section about
                      remote team management.
                    </p>
                    <div className="mt-3 flex space-x-4">
                      <button className="text-sm text-muted-foreground hover:text-foreground flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>3</span>
                      </button>
                      <button className="text-sm text-muted-foreground hover:text-foreground">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
