"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createReview,
  getReviewsByUser,
  Review,
} from "@/lib/api/reviews-api";
import { motion } from "framer-motion";
import {
  Calendar,
  MessageSquare,
  Send,
  Star,
  StarOff,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Project {
  _id: string;
  id?: string;
  title: string;
  status: string;
}

export function ClientReviews() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [selectedProject, setSelectedProject] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

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
            setReviews(reviewsResponse.data.reviews || []);
          }

          // Fetch client's completed projects
          const projectsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projects/owner/${userId}`
            ||
            `localhost:5001/api/v1/projects/owner/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (projectsResponse.ok) {
            const projectsData = await projectsResponse.json();
            if (
              projectsData.success &&
              projectsData.data &&
              Array.isArray(projectsData.data)
            ) {
          
              const projectsWithCompletedSprints = [];
              
              for (const project of projectsData.data) {
                try {
              
                  const submissionsResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/work-submissions/project/${project._id}`
                    ||
                    `localhost:5001/api/v1/work-submissions/project/${project._id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    }
                  );

                  if (submissionsResponse.ok) {
                    const submissionsData = await submissionsResponse.json();
                    if (submissionsData.success && submissionsData.data) {
                      const submissions = submissionsData.data;
                     
                      const approvedCount = submissions.filter(
                        (sub: any) => sub.status === "approved"
                      ).length;

                     
                      if (approvedCount >= 3) {
                        projectsWithCompletedSprints.push(project);
                      }
                    }
                  }
                } catch (err) {
                  console.error(`Error checking sprints for project ${project._id}:`, err);
                }
              }
              
              setProjects(projectsWithCompletedSprints);
            }
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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!selectedProject) {
      setError("Please select a project");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Please enter a comment");
      return;
    }

    setSubmitting(true);

    try {
      const user = session?.user as {
        id?: string;
        accessToken?: string;
      };
      const accessToken = user?.accessToken;

      if (!accessToken) {
        setError("Authentication required");
        return;
      }
      const project = projects.find(
        (p) => (p._id || p.id) === selectedProject
      );

      if (!project) {
        setError("Project not found");
        return;
      }

      try {
        const bidsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bids/project/${selectedProject}`
          ||
          `localhost:5001/api/v1/bids/project/${selectedProject}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!bidsResponse.ok) {
          setError("Failed to fetch project bids");
          return;
        }

        const bidsData = await bidsResponse.json();
        if (!bidsData.success || !bidsData.data) {
          setError("No bids found for this project");
          return;
        }
        const acceptedBid = bidsData.data.find(
          (bid: any) => bid.status === "accepted"
        );

        if (!acceptedBid) {
          setError("No accepted bid found for this project");
          return;
        }
        const freelancerId =
          typeof acceptedBid.freelancerId === "string"
            ? acceptedBid.freelancerId
            : acceptedBid.freelancerId._id;

        if (!freelancerId) {
          setError("Could not find freelancer ID");
          return;
        }
        const response = await createReview(
          {
            projectId: selectedProject,
            revieweeId: freelancerId,
            reviewerType: "client",
            rating,
            comment: comment.trim(),
          },
          accessToken
        );

        if (response.success) {
          setSuccessMessage("Review submitted successfully!");
          setSelectedProject("");
          setRating(0);
          setComment("");
          const userId = user.id;
          if (userId) {
            const reviewsResponse = await getReviewsByUser(
              userId,
              50,
              1,
              accessToken
            );
            if (reviewsResponse.success && reviewsResponse.data) {
              setReviews(reviewsResponse.data.reviews || []);
            }
          }
        } else {
          setError(response.message || "Failed to submit review");
        }
      } catch (bidError) {
        console.error("Error fetching bids:", bidError);
        setError("Failed to fetch freelancer information");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("An error occurred while submitting the review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = interactive
            ? star <= (hoverRating || rating)
            : star <= count;

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && setRating(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`${
                interactive
                  ? "cursor-pointer hover:scale-110 transition-transform"
                  : "cursor-default"
              }`}
            >
              {filled ? (
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

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
          View reviews you've received and provide feedback for projects with all 3 sprints completed
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Submit a Review
            </CardTitle>
            <CardDescription>
              Provide feedback for freelancers on projects with all 3 sprints completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-6">
        
              <div className="space-y-2">
                <Label htmlFor="project">Select Project</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Choose a project with 3 completed sprints" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No projects with 3 completed sprints yet
                      </SelectItem>
                    ) : (
                      projects.map((project) => (
                        <SelectItem
                          key={project._id || project.id}
                          value={project._id || project.id || ""}
                        >
                          {project.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex items-center gap-2">
                  {renderStars(rating, true)}
                  {rating > 0 && (
                    <span className="text-sm text-muted-foreground ml-2">
                      {rating} out of 5 stars
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience working with the freelancer..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {successMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting || projects.length === 0}
                className="w-full sm:w-auto"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Reviews Received
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
                You haven't received any reviews from freelancers yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            Freelancer Review
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(review.createdAt).toLocaleDateString()}
                          </CardDescription>
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
