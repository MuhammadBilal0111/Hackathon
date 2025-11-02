import { Calendar, AlertCircle } from "lucide-react"

export function UpcomingPlanCard() {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">NEXT SCHEDULED ACTIVITY</p>
          <h3 className="text-lg font-semibold text-foreground">Irrigation</h3>
        </div>
        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
          <Calendar className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
          <p className="text-sm font-medium text-foreground">Nov 5, 2025 • 6:00 AM</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
          <AlertCircle className="w-4 h-4 text-accent flex-shrink-0" />
          <span className="text-xs font-medium text-foreground">In Progress</span>
        </div>
      </div>
    </div>
  )
}
