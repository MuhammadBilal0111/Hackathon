"use client"

import { Calendar, CheckCheck, AlertCircle } from "lucide-react"

export function UpcomingActivitiesCard() {
  const activities = [
    { task: "Harvest Wheat", date: "2024-12-15", status: "scheduled", icon: "🚜" },
    { task: "Spray Pesticides", date: "2024-12-08", status: "pending", icon: "💨" },
    { task: "Soil Testing", date: "2024-12-20", status: "scheduled", icon: "🧪" },
  ]

  const getStatusColor = (status: string) => {
    return status === "pending" ? "text-red-500" : "text-accent"
  }

  const getStatusBg = (status: string) => {
    return status === "pending" ? "bg-red-500/10" : "bg-accent/10"
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">UPCOMING ACTIVITIES</p>
          <h3 className="text-2xl font-bold text-foreground">Annual Plan</h3>
        </div>
        <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-accent" />
        </div>
      </div>

      <div className="space-y-3">
        {activities.map((activity, i) => (
          <div
            key={i}
            className="p-4 bg-secondary/50 rounded-lg border border-border/30 hover:border-accent/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0 mt-0.5">{activity.icon}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-foreground">{activity.task}</p>
                  <span className={`text-xs font-bold ${getStatusColor(activity.status)}`}>
                    {activity.status === "pending" ? "URGENT" : "SCHEDULED"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
            </div>

            {/* Status indicator bar */}
            <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusBg(activity.status)}`}>
              {activity.status === "pending" ? (
                <>
                  <AlertCircle className={`w-3.5 h-3.5 ${getStatusColor(activity.status)}`} />
                  <span className={`text-xs font-medium ${getStatusColor(activity.status)}`}>Requires attention</span>
                </>
              ) : (
                <>
                  <CheckCheck className={`w-3.5 h-3.5 ${getStatusColor(activity.status)}`} />
                  <span className={`text-xs font-medium ${getStatusColor(activity.status)}`}>On track</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
