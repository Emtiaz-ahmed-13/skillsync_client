"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReviewPromptProps {
  projectId: string;
  revieweeId: string;
  revieweeName: string;
  open: boolean;
  onClose: () => void;
}

export function ReviewPrompt({
  projectId,
  revieweeId,
  revieweeName,
  open,
  onClose,
}: ReviewPromptProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const token = (session?.user as { accessToken?: string })?.accessToken;

  const submit = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/v1/reviews", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, revieweeId, rating, comment }),
      });
      if (res.ok) {
        toast.success("Review submitted!");
        onClose();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to submit review");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {revieweeName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Rating: {rating}/5</Label>
            <input
              type="range"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <Label>Comment</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
            />
          </div>
          <Button onClick={submit} disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
