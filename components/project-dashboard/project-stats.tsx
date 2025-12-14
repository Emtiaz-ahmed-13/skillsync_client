"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data for charts
const progressData = [
  { day: "Mon", progress: 30 },
  { day: "Tue", progress: 45 },
  { day: "Wed", progress: 60 },
  { day: "Thu", progress: 67 },
  { day: "Fri", progress: 75 },
  { day: "Sat", progress: 80 },
  { day: "Sun", progress: 85 },
];

const taskData = [
  { name: "Completed", value: 12 },
  { name: "In Progress", value: 8 },
  { name: "Pending", value: 5 },
];

const COLORS = ["#64FFDA", "#0a8b8b", "#cccccc"];

export function ProjectStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Progress Chart */}
      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Progress"]}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Bar
                  dataKey="progress"
                  radius={[4, 4, 0, 0]}
                  className="fill-skillsync-cyan"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Project progress over the last week
          </p>
        </CardContent>
      </Card>

      {/* Tasks Distribution */}
      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle>Task Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {taskData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Tasks"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Distribution of tasks by status
          </p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="space-y-6">
        <Card className="border-gray-200 bg-white">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-3xl font-bold text-gray-900 mb-2">67%</p>
            <p className="text-sm text-gray-600">Overall Progress</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-3xl font-bold text-gray-900 mb-2">25</p>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-3xl font-bold text-gray-900 mb-2">12</p>
            <p className="text-sm text-gray-600">Completed Tasks</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
