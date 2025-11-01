"use client";

import { CheckCircle } from "lucide-react";

export function CompletedTasksCard() {
  const completedPercentage = 78;
  const completedCount = 24;
  const totalTasks = 30;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">
            COMPLETED TASKS
          </p>
          <h3 className="text-4xl font-bold text-green-800">
            {completedPercentage}%
          </h3>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </div>
        <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-accent" />
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-28 h-28">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-muted/30"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${(completedPercentage / 100) * 282.7} 282.7`}
              className=" transition-all duration-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-foreground">
              {completedPercentage}%
            </span>
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalTasks}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">Completed</p>
          <p className="text-xl font-semibold text-accent">{completedCount}</p>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">Remaining</p>
          <p className="text-xl font-semibold text-foreground">
            {totalTasks - completedCount}
          </p>
        </div>
      </div>
    </div>
  );
}
