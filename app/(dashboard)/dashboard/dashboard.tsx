"use client";

import { PendingTasksCard } from "./pending-tasks-card";
import { CompletedTasksCard } from "./completed-tasks-card";
import { WeatherCard } from "./weather-card";
import { CropsCard } from "./crops-card";
import { UpcomingActivitiesCard } from "./upcoming-activities-card";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocalization } from "@/lib/localization";

export interface Activity {
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
interface FarmInfo {
  location: string;
  farmSize: string;
  soilType: string;
  primaryCrops: string[];
}
interface SeasonalTip {
  season: string;
  tips: string[];
}
interface CriticalDate {
  date: string;
  event: string;
  description: string;
}
interface AnnualPlanData {
  farmInfo: FarmInfo;
  annualPlan: MonthlyPlan[];
  seasonalTips: SeasonalTip[];
  criticalDates: CriticalDate[];
  generatedAt: string;
  tavilyContext?: {
    summary: string;
    sources: Array<{ title: string; content: string; url: string }>;
  };
}

let USER_ID: string | undefined;
if (typeof window !== "undefined") {
  try {
    const userStr = localStorage.getItem("user");
    const parsedUser = userStr ? JSON.parse(userStr) : null;
    USER_ID = parsedUser?.uid;
  } catch (e) {
    console.warn("Failed to parse stored user:", e);
    USER_ID = undefined;
  }
}

export function Dashboard() {
  const { t } = useLocalization();
  const [planData, setPlanData] = useState<AnnualPlanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingTasks, setPendingTasks] = useState<Activity[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Activity[]>([]);

  const fetchPlan = useCallback(async () => {
    try {
      setIsLoading(true);
      const planRef = doc(db, "annual_plans", USER_ID);
      const planSnap = await getDoc(planRef);

      if (planSnap.exists()) {
        const data = planSnap.data() as AnnualPlanData;
        setPlanData(data);
        console.log(data);

        // Clear arrays first to prevent duplication
        const newPendingTasks: Activity[] = [];
        const newCompletedTasks: Activity[] = [];

        data?.annualPlan.forEach((monthActivity) => {
          monthActivity.activities.forEach((activity) => {
            if (activity.status == "pending") {
              newPendingTasks.push(activity);
            } else if (activity.status == "completed") {
              newCompletedTasks.push(activity);
            }
          });
        });

        // Set the arrays once with all collected tasks
        setPendingTasks(newPendingTasks);
        setCompletedTasks(newCompletedTasks);
      } else {
        // No plan exists, show modal
        console.log("No annual plan found for user:", USER_ID);
      }
    } catch (error) {
      console.error("Error fetching plan:", error);
      toast.error(t("failedToLoadPlan"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <main className="flex-1">
        {/* Dashboard Grid */}
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t("welcomeBack")}
            </h2>
            <p className="text-muted-foreground">{t("farmOverview")}</p>
          </div>

          <div className="space-y-6">
            {/* Row 1: Pending & Completed Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PendingTasksCard pendingTasks={pendingTasks} />
              <CompletedTasksCard
                completedTasks={completedTasks}
                allTasks={pendingTasks.concat(completedTasks)}
              />
            </div>

            {/* Row 2: Weather */}
            <div>
              <WeatherCard />
            </div>

            {/* Row 3: Crops & Upcoming Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CropsCard user={USER_ID} />
              <UpcomingActivitiesCard planData={planData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
