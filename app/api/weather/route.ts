// app/api/weather/route.ts
import { NextResponse } from "next/server";

type WeatherAPIResponse = any;

function toAbsoluteIcon(iconUrl: string) {
  if (!iconUrl) return "";
  if (iconUrl.startsWith("//")) return `https:${iconUrl}`;
  if (iconUrl.startsWith("http")) return iconUrl;
  return `https://${iconUrl}`;
}

function dayLabel(index: number) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return `Day ${index + 1}`;
}

function generateTips(current: any, forecast: any[]) {
  const tips: string[] = [];

  // Current conditions
  if (current.uv >= 8) {
    tips.push(
      "High UV index — protect seedlings from direct sun during peak hours."
    );
  }

  if (current.humidity <= 40) {
    tips.push(
      "Low humidity — consider irrigation and mulching to conserve moisture."
    );
  }

  if (current.wind_kph && current.wind_kph >= 40) {
    tips.push(
      "Strong winds expected — secure plastic covers and young plants."
    );
  }

  // Forecast-based tips
  const rainLikely = forecast.some(
    (f) => (f.day?.daily_chance_of_rain || 0) >= 60
  );
  if (rainLikely) {
    tips.push(
      "Significant chance of rain in the next days — postpone fertilizer application and check drainage."
    );
  }

  const hotDay = forecast.some((f) => (f.day?.maxtemp_c || 0) >= 35);
  if (hotDay) {
    tips.push(
      "High daytime temperatures expected — prioritize watering in early morning or late evening."
    );
  }

  if (tips.length === 0) {
    tips.push(
      "Conditions look stable. Continue regular monitoring and irrigation as needed."
    );
  }

  return tips.join(" ");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");

    if (!location) {
      return NextResponse.json(
        { error: "location parameter is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.WEATHERAPI_KEY || process.env.WEATHER_API;
    if (!apiKey) {
      console.error("WEATHERAPI_KEY or WEATHER_API is not configured");
      return NextResponse.json(
        { error: "Weather API key not configured" },
        { status: 500 }
      );
    }

    // Build WeatherAPI forecast request for 3 days
    const base = "http://api.weatherapi.com/v1/forecast.json";
    const params = new URLSearchParams({
      key: apiKey,
      q: location,
      days: "3",
      aqi: "no",
      alerts: "no",
    });

    const resp = await fetch(`${base}?${params.toString()}`);
    if (!resp.ok) {
      const text = await resp.text();
      console.error("WeatherAPI request failed:", resp.status, text);
      return NextResponse.json(
        { error: `Weather provider error: ${resp.status}` },
        { status: 502 }
      );
    }

    const body: WeatherAPIResponse = await resp.json();

    // Map the WeatherAPI response to our frontend shape
    const current = body.current || {};
    const forecastDays = (body.forecast?.forecastday || []).slice(0, 3);

    const mappedForecast = forecastDays.map((fd: any, idx: number) => ({
      day: dayLabel(idx),
      temperature: Math.round(fd.day?.avgtemp_c ?? fd.day?.maxtemp_c ?? 0),
      condition: fd.day?.condition?.text ?? fd.day?.condition ?? "",
      icon: toAbsoluteIcon(
        fd.day?.condition?.icon ?? fd.day?.condition?.icon ?? ""
      ),
      // preserve raw day object for decision making (e.g., daily_chance_of_rain)
      dayRaw: fd.day,
    }));

    const tempMin = Math.round(
      Math.min(...forecastDays.map((d: any) => d.day?.mintemp_c ?? Infinity))
    );
    const tempMax = Math.round(
      Math.max(...forecastDays.map((d: any) => d.day?.maxtemp_c ?? -Infinity))
    );

    const mapped = {
      location: body.location?.name
        ? `${body.location.name}, ${
            body.location.region || body.location.country || ""
          }`.trim()
        : location,
      current: {
        temperature: Math.round(current.temp_c ?? 0),
        humidity: current.humidity ?? 0,
        windSpeed: Math.round(current.wind_kph ?? 0),
        condition: current.condition?.text ?? "",
        icon: toAbsoluteIcon(current.condition?.icon ?? ""),
        uv: current.uv ?? null,
        precip_mm: current.precip_mm ?? null,
      },
      forecast: mappedForecast.map((m: any) => ({
        day: m.day,
        temperature: m.temperature,
        condition: m.condition,
        icon: m.icon,
      })),
      temperatureRange: {
        min: isFinite(tempMin) ? tempMin : 0,
        max: isFinite(tempMax) ? tempMax : 0,
      },
      tips: generateTips(
        current,
        forecastDays.map((d: any) => ({ day: d }))
      ),
    };

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error("Error in /api/weather:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
