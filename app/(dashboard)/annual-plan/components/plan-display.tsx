"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Circle,
  MapPin,
  Wheat,
  Calendar,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CalendarClock,
} from "lucide-react";
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

interface PlanDisplayProps {
  planData: AnnualPlanData;
  onActivityStatusChange: (monthIndex: number, activityIndex: number) => void;
  isGenerating: boolean;
}

const MONTHS = [
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

export function PlanDisplay({
  planData,
  onActivityStatusChange,
  isGenerating,
}: PlanDisplayProps) {
  const { t } = useLocalization();
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [selectedMonth, setSelectedMonth] = useState<string>(
    planData.annualPlan[0]?.month || "January"
  );

  const toggleMonthExpansion = (month: string) => {
    setExpandedMonths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(month)) {
        newSet.delete(month);
      } else {
        newSet.add(month);
      }
      return newSet;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50";
      case "Medium":
        return "text-orange-600 bg-orange-50";
      case "Low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getMonthStats = (month: MonthlyPlan) => {
    const completed = month.activities.filter(
      (a) => a.status === "completed"
    ).length;
    const total = month.activities.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  return (
    <div className="space-y-6">
      {/* Farm Info Card */}
      <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            {t("planDisplay_farmInfo_title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("location")}</p>
              <p className="font-semibold text-lg">
                {planData.farmInfo.location}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("planDisplay_farmSize")}
              </p>
              <p className="font-semibold text-lg">
                {planData.farmInfo.farmSize}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("planDisplay_soilType")}
              </p>
              <p className="font-semibold text-lg">
                {planData.farmInfo.soilType}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("planDisplay_primaryCrops")}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {planData.farmInfo.primaryCrops.map((crop, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {t("planDisplay_generatedOn")}:{" "}
            {new Date(planData.generatedAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-transparent border-b rounded-none h-auto p-0">
          <TabsTrigger
            value="monthly"
            className="rounded-lg border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-semibold text-base"
          >
            {t("planDisplay_monthlyPlan")}
          </TabsTrigger>
          <TabsTrigger
            value="tips"
            className="rounded-lg border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-semibold text-base"
          >
            {t("planDisplay_seasonalTips")}
          </TabsTrigger>
          <TabsTrigger
            value="dates"
            className="rounded-lg border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-semibold text-base"
          >
            {t("planDisplay_criticalDates")}
          </TabsTrigger>
        </TabsList>

        {/* Monthly Plan Tab */}
        <TabsContent value="monthly" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Month Selector */}
            <div className="lg:col-span-1">
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">
                    Select Month
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {MONTHS.map((month) => {
                    const monthPlan = planData.annualPlan.find(
                      (m) => m.month === month
                    );
                    const stats = monthPlan ? getMonthStats(monthPlan) : null;

                    return (
                      <button
                        key={month}
                        onClick={() => setSelectedMonth(month)}
                        className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                          selectedMonth === month
                            ? "bg-green-600 text-white"
                            : "bg-white hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{month}</span>
                          {stats && (
                            <span className="text-sm font-medium">
                              {stats.completed}/{stats.total}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Activities for Selected Month */}
            <div className="lg:col-span-3">
              {planData.annualPlan
                .filter((monthPlan) => monthPlan.month === selectedMonth)
                .map((monthPlan, monthIndex) => {
                  const realMonthIndex = planData.annualPlan.findIndex(
                    (m) => m.month === selectedMonth
                  );
                  const stats = getMonthStats(monthPlan);

                  return (
                    <Card key={monthPlan.month} className="shadow-sm">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-6 w-6 text-gray-600" />
                            <div>
                              <CardTitle className="text-2xl font-bold">
                                {monthPlan.month}
                              </CardTitle>
                              <CardDescription className="text-base mt-1">
                                {stats.completed} of {stats.total} activities
                                completed ({stats.percentage}%)
                              </CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-bold text-green-600">
                              {stats.percentage}%
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              Complete
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {monthPlan.activities.map(
                            (activity, activityIndex) => (
                              <div
                                key={activityIndex}
                                className={`bg-white border rounded-lg p-5 transition-all ${
                                  activity.status === "completed"
                                    ? "opacity-60"
                                    : ""
                                }`}
                              >
                                <div className="flex items-start gap-4">
                                  {/* Status Checkbox */}
                                  <button
                                    onClick={() =>
                                      onActivityStatusChange(
                                        realMonthIndex,
                                        activityIndex
                                      )
                                    }
                                    disabled={isGenerating}
                                    className="mt-0.5 transition-transform hover:scale-110 disabled:cursor-not-allowed flex-shrink-0"
                                  >
                                    {activity.status === "completed" ? (
                                      <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center">
                                        <CheckCircle2 className="h-4 w-4 text-white" />
                                      </div>
                                    ) : (
                                      <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                                    )}
                                  </button>

                                  {/* Activity Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3">
                                      <h4
                                        className={`font-semibold text-lg ${
                                          activity.status === "completed"
                                            ? "line-through text-gray-500"
                                            : "text-gray-900"
                                        }`}
                                      >
                                        {activity.title}
                                      </h4>
                                      <span
                                        className={`px-3 py-1 rounded-md text-sm font-semibold flex-shrink-0 ${getPriorityColor(
                                          activity.priority
                                        )}`}
                                      >
                                        {activity.priority}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                      {activity.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                      <CalendarClock className="h-4 w-4 text-gray-400" />
                                      <span className="text-sm text-gray-500">
                                        {activity.estimatedDuration}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        </TabsContent>

        {/* Seasonal Tips Tab */}
        <TabsContent value="tips" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planData.seasonalTips.map((seasonalTip, idx) => (
              <Card key={idx} className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    {seasonalTip.season}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {seasonalTip.tips.map((tip, tipIdx) => (
                      <li
                        key={tipIdx}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="text-yellow-600 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Critical Dates Tab */}
        <TabsContent value="calendar" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Important Dates to Remember
              </CardTitle>
              <CardDescription>
                Mark these critical dates in your calendar for optimal farming
                outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {planData.criticalDates.map((date, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-16 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="shrink-0 w-16 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {date.date}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900">
                        {date.event}
                      </h4>
                      <p className="text-sm text-red-700 mt-1">
                        {date.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Context Information (if available) */}
      {planData.tavilyContext && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <TrendingUp className="h-5 w-5" />
              Research-Based Insights
            </CardTitle>
            <CardDescription className="text-blue-700">
              This plan is based on authentic agricultural research and
              location-specific data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-900">
              {planData.tavilyContext.summary}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
