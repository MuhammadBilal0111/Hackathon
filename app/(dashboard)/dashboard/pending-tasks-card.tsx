"use client";
import { AlertCircle } from "lucide-react";
import { Activity } from "./dashboard";
import { useLocalization } from "@/lib/localization";

export function PendingTasksCard({
  pendingTasks,
}: {
  pendingTasks: Activity[];
}) {
  const { t } = useLocalization();

  return (
    <div className="bg-card rounded-2xl p-6  shadow-sm border border-border hover:shadow-md transition-shadow">
      {pendingTasks.length == 0 ? (
        <p className="text-sm text-muted-foreground">{t("noPendingTasks")}</p>
      ) : (
        <>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">
                {t("pendingTasks").toUpperCase()}
              </p>
              <h3 className="text-4xl font-bold text-foreground">
                {pendingTasks.length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shadow-md">
              <AlertCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-3 h-48 overflow-y-scroll">
            {pendingTasks.map((task, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                    task.priority === "High" ? "bg-green-600" : "bg-green-300"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                    {task.priority} {t("priority")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">{t("dueToday")}</p>
          </div>
        </>
      )}
    </div>
  );
}
