"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Milestone {
  id: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  deliverables: string[];
}

export default function MilestoneManagement({
  projectId,
}: {
  projectId: string;
}) {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      title: "Initial Design",
      description: "Create initial design mockups and wireframes",
      deadline: "2025-01-15",
      completed: false,
      deliverables: ["Design mockups", "Wireframes", "Style guide"],
    },
    {
      id: "2",
      title: "Development Phase 1",
      description: "Frontend development for core features",
      deadline: "2025-02-01",
      completed: false,
      deliverables: [
        "HTML/CSS templates",
        "Component library",
        "Basic functionality",
      ],
    },
  ]);

  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    deadline: "",
    deliverables: "",
  });

  const handleAddMilestone = () => {
    if (
      !newMilestone.title ||
      !newMilestone.description ||
      !newMilestone.deadline
    )
      return;

    const deliverablesArray = newMilestone.deliverables
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d);

    const milestone: Milestone = {
      id: Date.now().toString(),
      title: newMilestone.title,
      description: newMilestone.description,
      deadline: newMilestone.deadline,
      completed: false,
      deliverables: deliverablesArray,
    };

    setMilestones([...milestones, milestone]);
    setNewMilestone({
      title: "",
      description: "",
      deadline: "",
      deliverables: "",
    });
  };

  const toggleMilestoneCompletion = (id: string) => {
    setMilestones(
      milestones.map((milestone) =>
        milestone.id === id
          ? { ...milestone, completed: !milestone.completed }
          : milestone
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Milestone Management</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Milestone</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Milestone</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Milestone Title</Label>
                  <Input
                    id="title"
                    value={newMilestone.title}
                    onChange={(e) =>
                      setNewMilestone({
                        ...newMilestone,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newMilestone.description}
                    onChange={(e) =>
                      setNewMilestone({
                        ...newMilestone,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newMilestone.deadline}
                    onChange={(e) =>
                      setNewMilestone({
                        ...newMilestone,
                        deadline: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="deliverables">
                    Deliverables (comma separated)
                  </Label>
                  <Textarea
                    id="deliverables"
                    placeholder="e.g., design mockups, wireframes, style guide"
                    value={newMilestone.deliverables}
                    onChange={(e) =>
                      setNewMilestone({
                        ...newMilestone,
                        deliverables: e.target.value,
                      })
                    }
                  />
                </div>
                <Button onClick={handleAddMilestone}>Add Milestone</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`p-4 border rounded-lg ${
                milestone.completed ? "bg-green-50" : "bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={milestone.completed}
                  onCheckedChange={() =>
                    toggleMilestoneCompletion(milestone.id)
                  }
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3
                      className={`font-medium ${
                        milestone.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {milestone.title}
                    </h3>
                    <Badge
                      variant={milestone.completed ? "default" : "secondary"}
                    >
                      {milestone.completed ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Deadline:{" "}
                    {new Date(milestone.deadline).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-2">{milestone.description}</p>
                  <div className="mt-3">
                    <p className="text-sm font-medium">Deliverables:</p>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      {milestone.deliverables.map((deliverable, idx) => (
                        <li key={idx}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
