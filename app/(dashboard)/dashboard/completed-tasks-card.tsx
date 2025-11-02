"use client";
import { CheckCircle } from "lucide-react";
import { Activity } from "./dashboard";
export function CompletedTasksCard({
  completedTasks,
  allTasks,
}: {
  completedTasks: Activity[];
  allTasks: Activity[];
}) {
  const completedPercentage = (completedTasks.length / allTasks.length) * 100;
  const completedCount = completedTasks.length;
  const totalTasks = allTasks.length;
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">
            {t("completedTasks")}
          </p>
          <h3 className="text-4xl font-bold text-green-700">
            {completedPercentage?.toFixed(2)}%
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{t("thisMonth")}</p>
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shadow-md">
          <CheckCircle className="w-6 h-6 text-green-600" />
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
              stroke="#e5f9e7"
              strokeWidth="3"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#16a34a"
              strokeWidth="3"
              strokeDasharray={`${(completedPercentage / 100) * 282.7} 282.7`}
              className="transition-all duration-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-green-700">
              {completedPercentage.toFixed(2)}%
            </span>
            <span className="text-xs text-green-500">
              {completedCount}/{totalTasks}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
