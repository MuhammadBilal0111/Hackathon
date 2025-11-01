"use client";

import { Card } from "@/components/ui/card";
import {
  Cloud,
  Droplets,
  Wind,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  AlertCircle,
} from "lucide-react";
import { WeatherChart } from "./weather-chart";
import type { WeatherData, ForecastDay, GeminiTips } from "./types";

interface WeatherDisplayProps {
  data: WeatherData;
  location: string;
  geminiTipsLoading?: boolean;
  language?: "en" | "ur";
}

export function WeatherDisplay({
  data,
  location,
  geminiTipsLoading,
  language = "en",
}: WeatherDisplayProps) {
  const locationLabel = location
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getAlertIcon = (type: "warning" | "caution" | "info") => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "caution":
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertColor = (type: "warning" | "caution" | "info") => {
    switch (type) {
      case "warning":
        return "bg-red-50 border-red-200 text-red-900";
      case "caution":
        return "bg-orange-50 border-orange-200 text-orange-900";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-900";
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Current Weather Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {language === "en" ? "Current Weather" : "موجودہ موسم"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Temperature Card */}
          <Card className="p-6 bg-linear-to-br from-orange-50 to-white border-orange-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {language === "en" ? "Temperature" : "درجہ حرارت"}
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {data.current.temperature}°C
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <img src={data.current.icon} />
                {/* <span className="text-3xl">{data.current.icon}</span> */}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {data.current.condition}
            </p>
          </Card>

          {/* Humidity Card */}
          <Card className="p-6 bg-linear-to-br from-blue-50 to-white border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {language === "en" ? "Humidity" : "نمی"}
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {data.current.humidity}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 h-2 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${data.current.humidity}%` }}
              />
            </div>
          </Card>

          {/* Wind Speed Card */}
          <Card className="p-6 bg-linear-to-br from-green-50 to-white border-green-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {language === "en" ? "Wind Speed" : "ہوا کی رفتار"}
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {data.current.windSpeed}
                  <span className="text-lg font-normal text-gray-600 ml-1">
                    km/h
                  </span>
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Wind className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {data.current.windSpeed > 20
                ? language === "en"
                  ? "Strong winds"
                  : "تیز ہوائیں"
                : data.current.windSpeed > 10
                ? language === "en"
                  ? "Moderate winds"
                  : "معتدل ہوائیں"
                : language === "en"
                ? "Light winds"
                : "ہلکی ہوائیں"}
            </p>
          </Card>
        </div>
      </section>

      {/* 3-Day Forecast Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {language === "en" ? "3-Day Forecast" : "3 دن کی پیشن گوئی"}
        </h2>
        <Card className="p-6 bg-white border-gray-200">
          <WeatherChart
            forecast={data.forecast}
            temperatureRange={data.temperatureRange}
          />

          {/* Forecast Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {data.forecast.map((day: ForecastDay, index: number) => (
              <div
                key={index}
                className="p-4 bg-linear-to-br from-gray-50 to-white rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">
                    {day.day}
                  </p>
                  <img src={day.icon} />
                  {/* <span className="text-2xl">{day.icon}</span> */}
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {day.temperature}°C
                  </p>
                  {index > 0 && (
                    <span className="flex items-center text-sm">
                      {day.temperature > data.forecast[0].temperature ? (
                        <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-blue-500 mr-1" />
                      )}
                      <span
                        className={
                          day.temperature > data.forecast[0].temperature
                            ? "text-red-500"
                            : "text-blue-500"
                        }
                      >
                        {Math.abs(
                          day.temperature - data.forecast[0].temperature
                        )}
                        °
                      </span>
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">{day.condition}</p>
              </div>
            ))}
          </div>

          {/* Temperature Range Info */}
          <div className="mt-6 p-4 bg-linear-to-r from-blue-50 to-orange-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">
                    {language === "en" ? "Minimum" : "کم سے کم"}
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {data.temperatureRange.min}°C
                  </p>
                </div>
              </div>
              <div className="flex-1 mx-6">
                <div className="h-2 bg-linear-to-r from-blue-400 via-green-400 to-orange-400 rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs text-gray-600">
                    {language === "en" ? "Maximum" : "زیادہ سے زیادہ"}
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {data.temperatureRange.max}°C
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Farming Tips Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {language === "en"
            ? "Farming Tips for This Week"
            : "اس ہفتے کے لیے کاشتکاری کے مشورے"}
        </h2>
        <Card className="p-6 bg-linear-to-br from-green-50 via-white to-green-50 border-green-200">
          {geminiTipsLoading && !data.geminiTips && (
            <div className="flex items-center gap-3 py-4">
              <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 text-sm">
                {language === "en"
                  ? "Generating personalized farming recommendations..."
                  : "ذاتی کاشتکاری کی سفارشات تیار کی جا رہی ہیں..."}
              </p>
            </div>
          )}

          {data.geminiTips ? (
            <div className="space-y-6">
              {/* Summary */}
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Cloud className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {language === "en"
                      ? "Weather-Based Recommendations"
                      : "موسم پر مبنی سفارشات"}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {language === "en"
                      ? data.geminiTips.summary_en
                      : data.geminiTips.summary_ur}
                  </p>
                </div>
              </div>

              {/* Alerts */}
              {data.geminiTips.alerts && data.geminiTips.alerts.length > 0 && (
                <div className="space-y-2">
                  {data.geminiTips.alerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-4 rounded-lg border ${getAlertColor(
                        alert.type
                      )}`}
                    >
                      {getAlertIcon(alert.type)}
                      <p className="text-sm font-medium flex-1">
                        {language === "en"
                          ? alert.message_en
                          : alert.message_ur}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Sections */}
              <div className="space-y-4">
                {data.geminiTips.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg border border-gray-200 p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {language === "en"
                          ? section.heading_en
                          : section.heading_ur}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                          section.priority
                        )}`}
                      >
                        {section.priority.charAt(0).toUpperCase() +
                          section.priority.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {language === "en"
                        ? section.content_en
                        : section.content_ur}
                    </p>

                    {/* Subsections */}
                    {section.subsections && section.subsections.length > 0 && (
                      <div className="mt-4 space-y-3 pl-4 border-l-2 border-green-200">
                        {section.subsections.map((sub, subIdx) => (
                          <div key={subIdx}>
                            <h5 className="font-medium text-gray-800 text-sm mb-1">
                              {language === "en"
                                ? sub.subheading_en
                                : sub.subheading_ur}
                            </h5>
                            <p className="text-gray-600 text-sm">
                              {language === "en" ? sub.text_en : sub.text_ur}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                  {language === "en"
                    ? "Enable Notifications"
                    : "اطلاعات فعال کریں"}
                </button>
                <button className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                  {language === "en"
                    ? "Save Recommendations"
                    : "سفارشات محفوظ کریں"}
                </button>
              </div>
            </div>
          ) : !geminiTipsLoading ? (
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Cloud className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {language === "en"
                    ? "Weather-Based Recommendations"
                    : "موسم پر مبنی سفارشات"}
                </h3>
                <p className="text-gray-700 leading-relaxed">{data.tips}</p>
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                    {language === "en"
                      ? "Enable Notifications"
                      : "اطلاعات فعال کریں"}
                  </button>
                  <button className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                    {language === "en" ? "View More Tips" : "مزید مشورے دیکھیں"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </Card>
      </section>
    </div>
  );
}
