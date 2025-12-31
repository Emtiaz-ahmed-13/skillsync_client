"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getReviewsByUser,
  Review,
} from "@/lib/api/reviews-api";
import { motion } from "framer-motion";
import {
  Calendar,
  MessageSquare,
  Star,
  StarOff,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ReviewWithDetails extends Review {
  projectTitle?: string;
  clientName?: string;
}

export function FreelancerReviews() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user) {
        try {
          const user = session.user as {
            id?: string;
            accessToken?: string;
          };
          const accessToken = user.accessToken;
          const userId = user.id;

          if (!accessToken || !userId) {
            setError("Authentication required");
            setLoading(false);
            return;
          }

          const reviewsResponse = await getReviewsByUser(
            userId,
            50,
            1,
            accessToken
          );

          if (reviewsResponse.success && reviewsResponse.data) {
            const reviewsData = reviewsResponse.data.reviews || [];
            
            const reviewsWithDetails = await Promise.all(
              reviewsData.map(async (review) => {
                let projectTitle = "Unknown Project";
                let clientName = "Unknown Client";

                try {
                  // Safe ID extraction
                  const projectIdStr = typeof review.projectId === 'object' && review.projectId !== null
                    ? (review.projectId as any)._id || (review.projectId as any).id
                    : review.projectId;

                  if (projectIdStr) {
                    const projectResponse = await fetch(
                      `/api/v1/projects/${projectIdStr}`,
                      {
                        headers: {
                          Authorization: `Bearer ${accessToken}`,
                        },
                      }
                    );

                    if (projectResponse.ok) {
                      const projectData = await projectResponse.json();
                      if (projectData.success && projectData.data) {
                        projectTitle = projectData.data.title;
                        
                       
                        const owner = projectData.data.ownerId;
                        if (owner && typeof owner === 'object' && (owner as any).name) {
                          clientName = (owner as any).name;
                        } else if (owner && typeof owner === 'object' && (owner as any).email) {
                          
                           clientName = (owner as any).email.split('@')[0];
                        }
                      }
                    }
                  }
                
                  if (clientName === "Unknown Client" && review.reviewerId) {
                     const reviewerIdStr = typeof review.reviewerId === 'object' 
                        ? (review.reviewerId as any)._id 
                        : review.reviewerId;
                  }

                } catch (err) {
                  console.error(`Error fetching details for review:`, err);
                }
                
                return {
                  ...review,
                  projectTitle,
                  clientName
                };
              })
            );
            
            setReviews(reviewsWithDetails);
          }
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to load reviews");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [session]);

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= count;

          return (
            <div key={star}>
              {filled ? (
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>
    );
  };
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 w-32 bg-muted rounded" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-3/4 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          Reviews & Feedback
        </h1>
        <p className="text-muted-foreground">
          View reviews you've received from clients
        </p>
      </motion.div>

      {/* Stats Card */}
      {reviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {reviews.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Reviews
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
                    {averageRating}
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {reviews.filter(r => r.rating === 5).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    5-Star Reviews
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rating Distribution</CardTitle>
              <CardDescription>Breakdown of your ratings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter(r => r.rating === rating).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-16 text-right">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Reviews Received Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Client Reviews
          </h2>
          <Badge variant="secondary" className="text-sm">
            {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
          </Badge>
        </div>

        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Reviews Yet
              </h3>
              <p className="text-muted-foreground">
                You haven't received any reviews from clients yet. Complete projects to start receiving feedback!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id || `review-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base group flex items-center gap-2">
                            {review.projectTitle || "Project Review"}
                          </CardTitle>
                          <div className="flex flex-col gap-0.5 mt-1">
                            <span className="text-sm font-medium text-foreground/80">
                                {review.clientName || "Client"}
                            </span>
                            <CardDescription className="flex items-center gap-1 text-xs">
                                <Calendar className="h-3 w-3" />
                                {new Date(review.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
