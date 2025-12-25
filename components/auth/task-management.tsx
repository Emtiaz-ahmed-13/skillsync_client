"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Calendar, Kanban, Plus, User } from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  assignee: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
}

export default function TaskManagement({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design Homepage",
      description: "Create initial design for homepage",
      status: "todo",
      assignee: "John Doe",
      priority: "high",
      dueDate: "2025-01-15",
    },
    {
      id: "2",
      title: "Implement Login",
      description: "Create login functionality with OAuth",
      status: "in-progress",
      assignee: "Jane Smith",
      priority: "high",
      dueDate: "2025-01-20",
    },
    {
      id: "3",
      title: "Write Documentation",
      description: "Document API endpoints",
      status: "review",
      assignee: "Bob Johnson",
      priority: "medium",
      dueDate: "2025-01-25",
    },
    {
      id: "4",
      title: "Setup Database",
      description: "Initialize database schema",
      status: "done",
      assignee: "Alice Williams",
      priority: "medium",
      dueDate: "2025-01-10",
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
  });

  const statuses: { id: Task["status"]; title: string }[] = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
  ];

  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignee) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      assignee: newTask.assignee,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
      dueDate: "",
    });
  };

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Task Management</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    value={newTask.assignee}
                    onChange={(e) =>
                      setNewTask({ ...newTask, assignee: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          priority: e.target.value as "low" | "medium" | "high",
                        })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleAddTask}>Add Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
          {statuses.map((status) => (
            <div
              key={status.id}
              className="flex flex-col w-64 min-w-[256px] mr-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Kanban className="w-4 h-4" />
                <h3 className="font-medium">{status.title}</h3>
                <Badge variant="secondary">
                  {tasks.filter((t) => t.status === status.id).length}
                </Badge>
              </div>
              <div className="space-y-3">
                {tasks
                  .filter((task) => task.status === status.id)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-3 border rounded-lg bg-card shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>{task.assignee}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <select
                            value={task.status}
                            onChange={(e) =>
                              updateTaskStatus(
                                task.id,
                                e.target.value as Task["status"]
                              )
                            }
                            className="text-xs p-1 border rounded bg-background"
                          >
                            {statuses.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
