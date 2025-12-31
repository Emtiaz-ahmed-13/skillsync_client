"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createArticle } from "@/lib/api/articles-api";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateArticleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  "Freelancing",
  "Project Management",
  "Remote Work",
  "Industry Trends",
  "Tips & Tricks",
  "Success Stories",
];

export function CreateArticleModal({
  open,
  onOpenChange,
}: CreateArticleModalProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    category: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!");
    const user = session?.user as any;
    console.log("User:", user);
    
    if (!user?.id) {
        toast.error("You must be logged in to create an article");
        return;
    }

    if (!user?.accessToken) {
        toast.error("Authentication token not found. Please log in again.");
        return;
    }

    setLoading(true);
    console.log("Creating FormData...");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("excerpt", formData.excerpt);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("tags", JSON.stringify([]));
      formDataToSend.append("status", "pending");
      
      if (imageFile) {
        formDataToSend.append("file", imageFile);
      } else if (formData.featuredImage) {
        formDataToSend.append("featuredImage", formData.featuredImage);
      }

      console.log("Calling createArticle API...");
      const result = await createArticle(formDataToSend, user.accessToken);
      console.log("API result:", result);

      if (result.success) {
        toast.success("Article submitted for approval!");
        onOpenChange(false);
        setFormData({
            title: "",
            excerpt: "",
            content: "",
            featuredImage: "",
            category: "",
        });
        setImageFile(null);
      } else {
        toast.error(result.message || "Failed to create article");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto font-sans p-0 bg-background border-border">
        <div className="px-6 pt-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold">Write a New Article</DialogTitle>
            <DialogDescription className="text-base">
              Share your insights with the community. Your article will be reviewed
              by an admin before publishing.
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter article title"
              value={formData.title}
              onChange={handleChange}
              className="font-sans"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select onValueChange={handleCategoryChange} required>
                <SelectTrigger className="font-sans">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100] bg-popover">
                    {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="font-sans">
                            {cat}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-sm font-medium">
              Excerpt <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              placeholder="A short summary of your article"
              value={formData.excerpt}
              onChange={handleChange}
              className="min-h-[80px] font-sans resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage" className="text-sm font-medium">
              Featured Image
            </Label>
            <Input
              id="featuredImage"
              name="featuredImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="font-sans"
            />
            <p className="text-xs text-muted-foreground">
              Upload a cover image for your article (optional)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your article content here..."
              className="min-h-[250px] font-sans resize-none"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit for Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
