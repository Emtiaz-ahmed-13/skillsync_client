"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { taskApi, Task } from "@/lib/api/task-api";
import { Kanban, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type ColumnStatus = "todo" | "in-progress" | "review" | "completed";

const columns: { id: ColumnStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "completed", title: "Done" },
];

export default function TaskManagement({ projectId }: { projectId: string }) {
  const { data: session } = useSession();
  const accessToken = (session?.user as { accessToken?: string })?.accessToken;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" as const });

  const loadTasks = useCallback(async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const data = await taskApi.getByProject(projectId, accessToken);
      setTasks(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [accessToken, projectId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = async () => {
    if (!accessToken || !newTask.title.trim()) return;
    try {
      await taskApi.create(
        {
          projectId,
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          status: "todo",
        },
        accessToken,
      );
      setNewTask({ title: "", description: "", priority: "medium" });
      await loadTasks();
      toast.success("Task created");
    } catch {
      toast.error("Failed to create task");
    }
  };

  const updateTaskStatus = async (taskId: string, status: ColumnStatus) => {
    if (!accessToken) return;
    try {
      await taskApi.update(taskId, { status }, accessToken);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    } catch {
      toast.error("Failed to update task");
    }
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "bg-red-100 text-red-800";
    if (priority === "low") return "bg-green-100 text-green-800";
    return "bg-yellow-100 text-yellow-800";
  };

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Kanban className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Task Board</h2>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
              </div>
              <Button onClick={handleAddTask} className="w-full">Create Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="rounded-lg border bg-muted/30 p-3 min-h-[300px]">
            <h3 className="font-medium mb-3">{column.title}</h3>
            <div className="space-y-2">
              {tasks
                .filter((t) => t.status === column.id)
                .map((task) => (
                  <div key={task.id} className="rounded-md border bg-background p-3 shadow-sm">
                    <p className="font-medium text-sm">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <Badge className={getPriorityColor(task.priority)} variant="secondary">
                        {task.priority}
                      </Badge>
                      <select
                        className="text-xs border rounded px-1 py-0.5"
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as ColumnStatus)}
                      >
                        {columns.map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
