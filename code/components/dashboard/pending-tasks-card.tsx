"use client"

import { AlertCircle } from "lucide-react"

export function PendingTasksCard() {
  const tasks = [
    { name: "Prepare irrigation system", priority: "high" },
    { name: "Apply nitrogen fertilizer", priority: "medium" },
    { name: "Inspect crop health", priority: "high" },
  ]

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">PENDING TASKS</p>
          <h3 className="text-4xl font-bold text-foreground">{tasks.length}</h3>
        </div>
        <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-accent" />
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
          >
            <div
              className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${task.priority === "high" ? "bg-red-500" : "bg-yellow-500"}`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{task.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 capitalize">{task.priority} priority</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground">Due today and upcoming days</p>
      </div>
    </div>
  )
}
