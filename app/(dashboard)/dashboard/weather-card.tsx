"use client";

import { Cloud, Droplets, Wind, Loader2, MapPin } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useLocalization } from "@/lib/localization";

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
  };
}

export function WeatherCard() {
  const { t } = useLocalization();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Location access denied: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes cache
        }
      );
    });
  };

  const fetchWeatherData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user's current location
      const location = await getCurrentLocation();
      const locationString = `${location.latitude},${location.longitude}`;

      // Fetch weather data from API
      const response = await fetch(
        `/api/weather?location=${encodeURIComponent(locationString)}`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Weather fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-green-100 via-white to-green-200 rounded-xl p-6 shadow-lg border border-green-200">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-600">{t("loadingWeatherData")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-gradient-to-br from-green-100 via-white to-green-200 rounded-xl p-6 shadow-lg border border-green-200">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <Cloud className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600 mb-2">{t("weatherError")}</p>
            <button
              onClick={fetchWeatherData}
              className="text-xs text-green-600 hover:text-green-800 underline"
            >
              {t("tryAgain")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-100 via-white to-green-200 rounded-xl p-6 shadow-lg border border-green-200">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-green-700 mb-1 flex items-center gap-2">
            <Cloud className="inline w-4 h-4 text-green-500" />{" "}
            {t("weather").toUpperCase()}
          </p>
          <p className="text-xs text-green-600 mb-4 flex items-center gap-1">
            <MapPin className="inline w-3 h-3" />
            {weatherData.location}
          </p>
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shadow-md">
          {weatherData.current.icon ? (
            <Image
              src={weatherData.current.icon}
              alt={weatherData.current.condition}
              width={32}
              height={32}
              className="w-8 h-8"
            />
          ) : (
            <Cloud className="w-6 h-6 text-green-600" />
          )}
        </div>
      </div>
      <div className="mb-6 flex items-center gap-8">
        <div className="flex flex-col items-center justify-center">
          <p className="text-5xl font-bold text-green-700 flex items-center gap-2">
            {weatherData.current.temperature}°C
          </p>
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <Cloud className="inline w-4 h-4 text-green-400" />
            {weatherData.current.condition}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center shadow-inner">
            <Droplets className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-green-700 mt-2">{t("humidity")}</p>
          <p className="text-sm font-bold text-green-900">
            {weatherData.current.humidity}%
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center shadow-inner">
            <Wind className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-green-700 mt-2">{t("wind")}</p>
          <p className="text-sm font-bold text-green-900">
            {weatherData.current.windSpeed} km/h
          </p>
        </div>
      </div>
    </div>
  );
}
