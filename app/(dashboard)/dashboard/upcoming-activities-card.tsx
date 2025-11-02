"use client";
import { Calendar } from "lucide-react";
import { useLocalization } from "@/lib/localization";

interface Activity {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  estimatedDuration: string;
  status: "pending" | "completed";
}

interface MonthlyPlan {
  month: string;
  activities: Activity[];
}

interface AnnualPlanData {
  annualPlan: MonthlyPlan[];
}

interface UpcomingActivitiesCardProps {
  planData?: AnnualPlanData | null;
}

export function UpcomingActivitiesCard({
  planData,
}: UpcomingActivitiesCardProps) {
  const { t } = useLocalization();
  // Get upcoming months (current + next 2 months)
  const getUpcomingMonths = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentMonthIndex = new Date().getMonth();
    const upcomingMonths = [];

    for (let i = 0; i < 2; i++) {
      const monthIndex = (currentMonthIndex + i) % 12;
      upcomingMonths.push(months[monthIndex]);
    }

    return upcomingMonths;
  };

  // Filter activities for upcoming months
  const getUpcomingActivities = () => {
    if (!planData?.annualPlan) return [];

    const upcomingMonths = getUpcomingMonths();
    const upcomingActivities: (Activity & { month: string })[] = [];

    planData.annualPlan.forEach((monthPlan) => {
      if (upcomingMonths.includes(monthPlan.month)) {
        monthPlan.activities.forEach((activity) => {
          upcomingActivities.push({
            ...activity,
            month: monthPlan.month,
          });
        });
      }
      console.log("Upcoming Activities:", upcomingActivities);
    });

    // Sort by priority (High -> Medium -> Low) and status (pending first)
    return upcomingActivities
      .sort((a, b) => {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        const statusOrder = { pending: 2, completed: 1 };

        if (a.status !== b.status) {
          return statusOrder[b.status] - statusOrder[a.status];
        }

        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 4); // Show only top 4 activities
  };

  const upcomingActivities = getUpcomingActivities();
  // Helper functions
  const getStatusColor = (status: string) => {
    return status === "pending" ? "text-red-500" : "text-green-600";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getActivityIcon = (priority: string, status: string) => {
    if (status === "completed") return "✅";
    if (priority === "High") return "🔴";
    if (priority === "Medium") return "🟡";
    return "🟢";
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">
            {t("upcomingActivitiesTitle")}
          </p>
          <h3 className="text-2xl font-bold text-foreground">
            {upcomingActivities.length} {t("upcomingActivities")}
          </h3>
        </div>
        <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-accent" />
        </div>
      </div>
      <div className="space-y-3 overflow-y-scroll h-64">
        {upcomingActivities.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {t("noActivitiesPlanned")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {!planData
                ? t("loadingAnnualPlan")
                : t("allActivitiesCompleted")}
            </p>
          </div>
        ) : (
          upcomingActivities.map((activity, i) => (
            <div
              key={`${activity.month}-${i}`}
              className=" p-4 bg-secondary/50 rounded-lg border border-border/30 hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl shrink-0 mt-0.5">
                  {getActivityIcon(activity.priority, activity.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-foreground">
                      {activity.title}
                    </p>
                    <span
                      className={`text-xs font-bold ${getStatusColor(
                        activity.status
                      )}`}
                    >
                      {activity.status === "pending" ? t("urgent") : t("scheduled")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {activity.month} • {activity.estimatedDuration}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(
                        activity.priority
                      )}`}
                    >
                      {activity.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
