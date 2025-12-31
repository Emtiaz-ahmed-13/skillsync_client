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
import { Calendar, Kanban, Plus } from "lucide-react";
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
      <div className="flex flex-col h-full space-y-4">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Kanban className="w-6 h-6 text-primary" />
                    Task Board
                </h3>
                <p className="text-muted-foreground">Manage project tasks and track progress</p>
            </div>
            <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" className="gap-2 shadow-md hover:shadow-lg transition-all">
                <Plus className="w-5 h-5" />
                Add New Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <p className="text-sm text-muted-foreground">Add a new task to your board.</p>
                </DialogHeader>
                <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="title" className="font-semibold">Task Title</Label>
                    <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                    }
                    placeholder="e.g., Design Homepage"
                    className="h-10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description" className="font-semibold">Description</Label>
                    <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                    }
                    placeholder="Detailed description of the task..."
                    className="min-h-[100px]"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="assignee" className="font-semibold">Assignee</Label>
                        <Input
                        id="assignee"
                        value={newTask.assignee}
                        onChange={(e) =>
                            setNewTask({ ...newTask, assignee: e.target.value })
                        }
                        placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dueDate" className="font-semibold">Due Date</Label>
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
                <div className="space-y-2">
                    <Label htmlFor="priority" className="font-semibold">Priority</Label>
                    <div className="flex gap-4">
                        {['low', 'medium', 'high'].map((p) => (
                             <label key={p} className={`flex-1 cursor-pointer border rounded-md p-3 text-center capitalize transition-all ${newTask.priority === p ? 'bg-primary/10 border-primary font-semibold text-primary' : 'hover:bg-muted'}`}>
                                <input 
                                    type="radio" 
                                    name="priority" 
                                    className="hidden" 
                                    checked={newTask.priority === p} 
                                    onChange={() => setNewTask({ ...newTask, priority: p as "low" | "medium" | "high" })} 
                                />
                                {p}
                             </label>
                        ))}
                    </div>
                </div>
                <Button onClick={handleAddTask} className="w-full mt-4" size="lg">Create Task</Button>
                </div>
            </DialogContent>
            </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full min-h-[500px]">
          {statuses.map((status) => {
            const statusTasks = tasks.filter((task) => task.status === status.id);
            return (
              <div
                key={status.id}
                className="flex flex-col h-full rounded-xl bg-muted/30 border border-border/50"
              >
                <div className="p-4 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                             status.id === 'todo' ? 'bg-slate-400' :
                             status.id === 'in-progress' ? 'bg-blue-500' :
                             status.id === 'review' ? 'bg-purple-500' :
                             'bg-green-500'
                        }`} />
                        <h3 className="font-semibold text-sm uppercase tracking-wider">{status.title}</h3>
                    </div>
                    <Badge variant="secondary" className="bg-background shadow-sm border">
                        {statusTasks.length}
                    </Badge>
                </div>
                
                <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                    {statusTasks.length === 0 ? (
                        <div className="h-24 border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
                            <p className="text-xs text-muted-foreground font-medium">No tasks</p>
                        </div>
                    ) : (
                        statusTasks.map((task) => (
                            <div
                            key={task.id}
                            className="group p-4 bg-background border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative"
                            >
                                {/* Priority Indicator */}
                                <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-md ${
                                    task.priority === 'high' ? 'bg-red-500' :
                                    task.priority === 'medium' ? 'bg-yellow-500' :
                                    'bg-green-500'
                                }`} />

                                <div className="pl-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-sm line-clamp-2 leading-tight">{task.title}</h4>
                                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 border-0 ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                                        {task.description}
                                    </p>
                                    
                                    <div className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1.5" title="Assignee">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                                                {task.assignee.charAt(0)}
                                            </div>
                                            <span className="truncate max-w-[80px]">{task.assignee}</span>
                                        </div>
                                        <div className="flex items-center gap-1" title="Due Date">
                                            <Calendar className="w-3 h-3" />
                                            <span>
                                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action to move task (simplified for now) */}
                                    <div className="mt-2 pt-2 border-t border-dashed hidden group-hover:block">
                                        <select
                                            value={task.status}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) =>
                                                updateTaskStatus(
                                                    task.id,
                                                    e.target.value as Task["status"]
                                                )
                                            }
                                            className="w-full text-xs p-1 rounded bg-muted/50 border-0 focus:ring-1 focus:ring-primary cursor-pointer hover:bg-muted"
                                        >
                                            <option value="" disabled>Move to...</option>
                                            {statuses.map((s) => (
                                                <option key={s.id} value={s.id} disabled={s.id === task.status}>
                                                     → {s.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
  );
}
