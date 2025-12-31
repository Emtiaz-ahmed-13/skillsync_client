"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
      <CardHeader className="border-b pb-4">
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Clock className="w-6 h-6 text-primary" />
                    Time Tracking
                </CardTitle>
                <p className="text-muted-foreground mt-1">Track your hours and earnings for this project</p>
            </div>
            {!isTracking && (
                <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-lg border border-border/50">
                    <div className="px-3 py-1 bg-background rounded-md shadow-sm border text-sm font-medium">
                        ${hourlyRate}/hr
                    </div>
                </div>
            )}
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
          {/* Hero Timer Section */}
          <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-b from-muted/20 to-muted/5 rounded-2xl border border-border/50">
            <div className={`text-6xl md:text-7xl font-mono font-bold tracking-wider mb-8 tabular-nums ${isTracking ? 'text-primary' : 'text-muted-foreground'}`}>
              {formatTime(elapsedTime)}
            </div>
            
            <div className="w-full max-w-xl px-4 space-y-6">
                {!isTracking ? (
                    <div className="flex flex-col gap-4">
                        <Input
                            value={currentTask}
                            onChange={(e) => setCurrentTask(e.target.value)}
                            placeholder="What are you working on right now?"
                            className="h-12 text-lg text-center"
                        />
                         <Button 
                            onClick={startTimer} 
                            disabled={!currentTask.trim()} 
                            size="lg" 
                            className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-primary/20 transition-all rounded-xl"
                        >
                            <Play className="w-5 h-5 mr-2 fill-current" />
                            Start Timer
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="bg-background p-4 rounded-xl border shadow-sm text-center">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Task</span>
                            <p className="text-lg font-medium mt-1 text-foreground">{currentTask}</p>
                        </div>
                        <Button 
                            onClick={stopTimer} 
                            variant="destructive" 
                            size="lg" 
                            className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-red-500/20 transition-all rounded-xl"
                        >
                            <Square className="w-5 h-5 mr-2 fill-current" />
                            Stop Timer & Save Entry
                        </Button>
                        <Input
                            value={currentNotes}
                            onChange={(e) => setCurrentNotes(e.target.value)}
                            placeholder="Add notes (optional)..."
                            className="text-center bg-transparent border-transparent hover:border-input focus:border-input transition-colors"
                        />
                    </div>
                )}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                    <Clock className="w-24 h-24 text-blue-600" />
                </div>
                <CardContent className="p-6">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Total Hours</p>
                    <p className="text-3xl font-bold mt-2 text-blue-700 dark:text-blue-300">{totalHours.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card className="bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                    <DollarSign className="w-24 h-24 text-purple-600" />
                </div>
                <CardContent className="p-6">
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">Total Earnings</p>
                    <p className="text-3xl font-bold mt-2 text-purple-700 dark:text-purple-300 transition-all">
                        ${totalAmount.toFixed(2)}
                    </p>
                </CardContent>
            </Card>
             <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                    <Calendar className="w-24 h-24 text-green-600" />
                </div>
                <CardContent className="p-6">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">Entries Logged</p>
                    <p className="text-3xl font-bold mt-2 text-green-700 dark:text-green-300">{timeEntries.length}</p>
                </CardContent>
            </Card>
          </div>

          {/* Time Entries List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    Recent Activity
                </h3>
                <Button variant="ghost" size="sm">View All History</Button>
            </div>
            
            {timeEntries.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
                <p className="mt-3 text-muted-foreground font-medium">No time entries recorded yet</p>
                <p className="text-sm text-muted-foreground/60">Start the timer above to log your work</p>
              </div>
            ) : (
              <div className="space-y-3">
                {timeEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="group p-4 border rounded-xl bg-card hover:bg-muted/30 hover:border-primary/20 transition-all duration-200 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-lg">{entry.task}</span>
                            <Badge variant="secondary" className="font-mono text-xs font-normal">
                                {entry.startTime} - {entry.endTime}
                            </Badge>
                        </div>
                        {entry.notes && (
                            <p className="text-sm text-muted-foreground pl-1 border-l-2 border-primary/20">
                            {entry.notes}
                            </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                           <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {new Date(entry.date).toLocaleDateString()}
                           </span>
                           <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {entry.duration}
                           </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-6 min-w-[140px]">
                        <div className="text-right">
                             <div className="text-sm text-muted-foreground">Earnings</div>
                             <div className="font-bold text-lg text-primary">${entry.total.toFixed(2)}</div>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground hover:text-red-500"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
      </CardContent>
    </Card>
  );
}
