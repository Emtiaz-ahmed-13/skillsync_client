"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ReviewSystemProps {
  projectId: string;
  projectName: string;
  clientName: string;
  freelancerName: string;
  onReviewSubmit: (review: {
    rating: number;
    comment: string;
    reviewerType: "client" | "freelancer";
    revieweeType: "client" | "freelancer";
  }) => void;
}

export default function ReviewSystem({
  projectId,
  projectName,
  clientName,
  freelancerName,
  onReviewSubmit,
}: ReviewSystemProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerType, setReviewerType] = useState<"client" | "freelancer">(
    "client"
  );
  const [revieweeType, setRevieweeType] = useState<"client" | "freelancer">(
    "freelancer"
  );
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    onReviewSubmit({ rating, comment, reviewerType, revieweeType });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Review System</CardTitle>
        <CardDescription>
          Review the {reviewerType === "client" ? "freelancer" : "client"} for
          project {projectName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Reviewer</Label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="reviewerType"
                  checked={reviewerType === "client"}
                  onChange={() => {
                    setReviewerType("client");
                    setRevieweeType("freelancer");
                  }}
                  className="h-4 w-4"
                />
                <span>Client ({clientName})</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="reviewerType"
                  checked={reviewerType === "freelancer"}
                  onChange={() => {
                    setReviewerType("freelancer");
                    setRevieweeType("client");
                  }}
                  className="h-4 w-4"
                />
                <span>Freelancer ({freelancerName})</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reviewee</Label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="revieweeType"
                  checked={revieweeType === "client"}
                  onChange={() => setRevieweeType("client")}
                  className="h-4 w-4"
                  disabled
                />
                <span>Client ({clientName})</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="revieweeType"
                  checked={revieweeType === "freelancer"}
                  onChange={() => setRevieweeType("freelancer")}
                  className="h-4 w-4"
                  disabled
                />
                <span>Freelancer ({freelancerName})</span>
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              Note: Reviewee is automatically determined based on the reviewer
            </p>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    fill={
                      star <= (hoverRating || rating) ? "currentColor" : "none"
                    }
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {rating > 0
                ? `${rating} star${rating > 1 ? "s" : ""}`
                : "Select rating"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Share your experience with the ${
                revieweeType === "client" ? "client" : "freelancer"
              }...`}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
