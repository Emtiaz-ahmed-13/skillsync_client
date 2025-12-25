"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, DollarSign, Play, Square } from "lucide-react";
import { useState } from "react";

interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  task: string;
  notes: string;
  rate: number;
  total: number;
}

export default function TimeTracking({ projectId }: { projectId: string }) {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [currentNotes, setCurrentNotes] = useState("");
  const [hourlyRate, setHourlyRate] = useState(50);

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: "1",
      date: "2025-01-10",
      startTime: "09:00",
      endTime: "11:30",
      duration: "2h 30m",
      task: "Design Homepage",
      notes: "Created initial mockups",
      rate: 50,
      total: 125,
    },
    {
      id: "2",
      date: "2025-01-10",
      startTime: "13:00",
      endTime: "15:45",
      duration: "2h 45m",
      task: "Implement Login",
      notes: "Added OAuth functionality",
      rate: 50,
      total: 137.5,
    },
  ]);

  let intervalId: NodeJS.Timeout | null = null;

  const startTimer = () => {
    if (isTracking) return;

    setIsTracking(true);
    setStartTime(new Date());
    setElapsedTime(0);

    intervalId = setInterval(() => {
      if (startTime) {
        const now = new Date();
        const elapsed = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000
        );
        setElapsedTime(elapsed);
      }
    }, 1000) as unknown as NodeJS.Timeout;
  };

  const stopTimer = () => {
    if (!isTracking || !startTime) return;

    if (intervalId) {
      clearInterval(intervalId);
    }

    setIsTracking(false);

    // Calculate duration in hours and minutes
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const duration = `${hours}h ${minutes}m`;

    // Calculate total based on hourly rate
    const totalHours = elapsedTime / 3600;
    const total = parseFloat((totalHours * hourlyRate).toFixed(2));

    // Create new time entry
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      startTime: startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration,
      task: currentTask,
      notes: currentNotes,
      rate: hourlyRate,
      total,
    };

    setTimeEntries([newEntry, ...timeEntries]);

    // Reset form
    setCurrentTask("");
    setCurrentNotes("");
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalHours = timeEntries.reduce((sum, entry) => {
    const [hours, minutes] = entry.duration.split(" ");
    const hourValue = parseInt(hours);
    const minuteValue = parseInt(minutes.replace("m", ""));
    return sum + hourValue + minuteValue / 60;
  }, 0);

  const totalAmount = timeEntries.reduce((sum, entry) => sum + entry.total, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timer Section */}
          <div className="flex flex-col items-center">
            <div className="text-3xl font-mono mb-4">
              {formatTime(elapsedTime)}
            </div>
            <div className="flex gap-3">
              {!isTracking ? (
                <Button onClick={startTimer} disabled={!currentTask.trim()}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Timer
                </Button>
              ) : (
                <Button onClick={stopTimer} variant="destructive">
                  <Square className="w-4 h-4 mr-2" />
                  Stop Timer
                </Button>
              )}
            </div>
            <div className="mt-4 w-full max-w-md">
              <Label htmlFor="current-task">Current Task</Label>
              <Input
                id="current-task"
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                placeholder="What are you working on?"
                disabled={isTracking}
              />
              <Label htmlFor="current-notes" className="mt-3 block">
                Notes
              </Label>
              <Textarea
                id="current-notes"
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                placeholder="Add notes about your work..."
                disabled={isTracking}
              />
              <Label htmlFor="hourly-rate" className="mt-3 block">
                Hourly Rate ($)
              </Label>
              <Input
                id="hourly-rate"
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                disabled={isTracking}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Hours</div>
              <div className="text-2xl font-bold">{totalHours.toFixed(2)}</div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Entries</div>
              <div className="text-2xl font-bold">{timeEntries.length}</div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Amount</div>
              <div className="text-2xl font-bold">
                ${totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Time Entries */}
          <div>
            <h3 className="font-medium mb-3">Time Entries</h3>
            {timeEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No time entries yet
              </p>
            ) : (
              <div className="space-y-3">
                {timeEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 border rounded-lg bg-card shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{entry.task}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {entry.notes}
                        </p>
                      </div>
                      <Badge>${entry.total.toFixed(2)}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{entry.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {entry.startTime} - {entry.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>
                          {entry.duration} @ ${entry.rate}/hr
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
