"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Plus } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
}

const mockMilestones: Milestone[] = [
  {
    id: "1",
    title: "Project Kickoff & Requirements Gathering",
    description:
      "Initial meeting with stakeholders to define project scope and requirements.",
    dueDate: "Oct 5, 2025",
    completed: true,
    completedDate: "Oct 3, 2025",
  },
  {
    id: "2",
    title: "Wireframes & Design Mockups",
    description:
      "Creation of wireframes and high-fidelity design mockups for all pages.",
    dueDate: "Oct 20, 2025",
    completed: true,
    completedDate: "Oct 18, 2025",
  },
  {
    id: "3",
    title: "Frontend Development",
    description: "Implementation of the frontend using React and Tailwind CSS.",
    dueDate: "Nov 15, 2025",
    completed: false,
  },
  {
    id: "4",
    title: "Backend Integration",
    description: "Integration with backend APIs and payment systems.",
    dueDate: "Nov 30, 2025",
    completed: false,
  },
];

export function MilestonesSection() {
  const getStatusBadgeClass = (completed: boolean) => {
    return completed
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-900">Milestones</CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </CardHeader>
      <CardContent>
        {mockMilestones.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No milestones have been created for this project yet.
          </p>
        ) : (
          <div className="space-y-6">
            {mockMilestones.map((milestone) => {
              const completed = milestone.completed;
              return (
                <div
                  key={milestone.id}
                  className={`p-4 rounded-lg border ${
                    completed
                      ? "border-green-200 bg-green-50/30"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        )}
                        <h4
                          className={`font-semibold text-gray-900 ${
                            completed ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {milestone.title}
                        </h4>
                        <Badge className={getStatusBadgeClass(completed)}>
                          {completed ? "Completed" : "In Progress"}
                        </Badge>
                      </div>

                      <span className="text-xs text-gray-500">
                        {completed
                          ? `Completed on ${milestone.completedDate}`
                          : `Due ${milestone.dueDate}`}
                      </span>

                      <p
                        className={`text-sm text-gray-600 mb-2 ${
                          completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {milestone.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {completed
                              ? `Completed on ${milestone.completedDate}`
                              : `Due ${milestone.dueDate}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!completed && (
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          completed
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200"
                        }
                      >
                        {completed ? "Completed" : "Mark Complete"}
                      </Button>
                    )}
                  </div>

                  {completed && (
                    <div className="mt-2 pt-2 border-t border-green-100">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm">Milestone completed</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
