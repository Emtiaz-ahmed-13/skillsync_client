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
import { useState } from "react";

interface ProjectClosureProps {
  projectId: string;
  projectName: string;
  onProjectClose: (closureData: {
    finalNotes: string;
    closureReason: string;
  }) => void;
}

export default function ProjectClosure({
  projectId,
  projectName,
  onProjectClose,
}: ProjectClosureProps) {
  const [finalNotes, setFinalNotes] = useState("");
  const [closureReason, setClosureReason] = useState("completed");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProjectClose({ finalNotes, closureReason });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Closure</CardTitle>
        <CardDescription>
          Finalize the project {projectName} and close it out
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="closureReason">Closure Reason</Label>
            <select
              id="closureReason"
              value={closureReason}
              onChange={(e) => setClosureReason(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="completed">Successfully Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="terminated">Terminated</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="finalNotes">Final Notes</Label>
            <Textarea
              id="finalNotes"
              value={finalNotes}
              onChange={(e) => setFinalNotes(e.target.value)}
              placeholder="Add any final notes about the project completion..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">
            Close Project
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
