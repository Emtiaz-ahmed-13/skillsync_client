"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, X } from "lucide-react";
import { useState } from "react";

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (milestone: {
    title: string;
    description: string;
    dueDate: string;
  }) => void;
}

export function AddMilestoneModal({
  isOpen,
  onClose,
  onAdd,
}: AddMilestoneModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!dueDate) {
      setError("Due date is required");
      return;
    }

    // Reset error and call onAdd
    setError(null);
    onAdd({ title, description, dueDate });

    // Reset form
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  const handleClose = () => {
    // Reset form and error
    setTitle("");
    setDescription("");
    setDueDate("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border border-gray-200 bg-white">
        <CardHeader className="relative">
          <CardTitle className="text-gray-900">Add New Milestone</CardTitle>
          <CardDescription className="text-gray-600">
            Create a new milestone for your project
          </CardDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 hover:bg-gray-100"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-900">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter milestone title"
                className="border-gray-300 text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-900">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter milestone description"
                className="border-gray-300 text-gray-900"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-gray-900">
                Due Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="pl-10 border-gray-300 text-gray-900"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-skillsync-cyan text-skillsync-dark-blue hover:bg-skillsync-cyan/90"
              >
                Add Milestone
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
