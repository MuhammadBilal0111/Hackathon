"use client"

import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { PendingTasksCard } from "./pending-tasks-card"
import { CompletedTasksCard } from "./completed-tasks-card"
import { WeatherCard } from "./weather-card"
import { CropsCard } from "./crops-card"
import { UpcomingActivitiesCard } from "./upcoming-activities-card"

export function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Header */}
        <Header />

        {/* Dashboard Grid */}
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Welcome back, Farmer</h2>
            <p className="text-muted-foreground">Here's an overview of your farm activities</p>
          </div>

          <div className="space-y-6">
            {/* Row 1: Pending & Completed Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PendingTasksCard />
              <CompletedTasksCard />
            </div>

            {/* Row 2: Weather */}
            <div>
              <WeatherCard />
            </div>

            {/* Row 3: Crops & Upcoming Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CropsCard />
              <UpcomingActivitiesCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
