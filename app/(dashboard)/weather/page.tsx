"use client";

import { useState } from "react";
import { WeatherDisplay } from "./weather-display";
import { LocationSelector } from "./location-selector";
import { Cloud, MapPin } from "lucide-react";
import type { WeatherData } from "./types";
import { useLanguage } from "@/context/LanguageContext";

export default function WeatherPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [geminiTipsLoading, setGeminiTipsLoading] = useState(false);
  const [language1, setLanguage] = useState<"en" | "ur">("en");

  const {language} = useLanguage()

  const fetchGeminiTips = async (data: WeatherData, location: string) => {
    try {
      setGeminiTipsLoading(true);
      const response = await fetch("/api/weather/gemini-tips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weatherData: data,
          location,
        }),
      });

      if (!response.ok) {
        console.error("Failed to fetch Gemini tips");
        return;
      }

      const result = await response.json();
      setWeatherData((prev) =>
        prev ? { ...prev, geminiTips: result.tips } : prev
      );
    } catch (err) {
      console.error("Error fetching Gemini tips:", err);
    } finally {
      setGeminiTipsLoading(false);
    }
  };

  const handleLocationSubmit = async (location: string) => {
    if (!location.trim()) {
      setError("Please select a location");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSubmitted(true);

    try {
      // Call internal API route which proxies WeatherAPI (server-side)
      const response = await fetch(
        `/api/weather?location=${encodeURIComponent(location)}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Weather service error: ${response.status} ${response.statusText} ${text}`
        );
      }

      const data: WeatherData = await response.json();
      setWeatherData(data);
      setSelectedLocation(location);

      // Fetch Gemini tips in the background
      fetchGeminiTips(data, location);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data"
      );
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Cloud className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === "en" ? "Weather and Location" : "موسم اور مقام"}
              </h1>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setLanguage("en")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  language === "en"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("ur")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  language === "ur"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                اردو
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-sm ml-14">
            {language === "en"
              ? "Get real-time weather updates and forecasts for your farm location"
              : "اپنے کھیت کے مقام کے لیے حقیقی وقت کے موسمی اپ ڈیٹس اور پیشن گوئیاں حاصل کریں"}
          </p>
        </div>

        {/* Location Selector */}
        <LocationSelector
          onSubmit={handleLocationSubmit}
          selectedLocation={selectedLocation}
          loading={loading}
        />

        {/* Weather Display */}
        {loading && (
          <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                <Cloud className="w-8 h-8 text-green-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-gray-600 font-medium">
                {language === "en"
                  ? "Fetching weather data..."
                  : "موسم کی معلومات حاصل کی جا رہی ہیں..."}
              </p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  {language === "en"
                    ? "Error Loading Weather Data"
                    : "موسم کی معلومات لوڈ کرنے میں خرابی"}
                </h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {weatherData && !loading && !error && (
          <WeatherDisplay
            data={weatherData}
            location={selectedLocation}
            geminiTipsLoading={geminiTipsLoading}
            language={language}
          />
        )}

        {!hasSubmitted && !loading && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {language === "en"
                  ? "Select Your Location"
                  : "اپنا مقام منتخب کریں"}
              </h3>
              <p className="text-gray-600 text-sm max-w-md">
                {language === "en"
                  ? "Choose your location from the dropdown above and click submit to view current weather conditions and 3-day forecast"
                  : "موجودہ موسمی حالات اور 3 دن کی پیشن گوئی دیکھنے کے لیے اوپر سے اپنا مقام منتخب کریں اور جمع کرائیں پر کلک کریں"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
