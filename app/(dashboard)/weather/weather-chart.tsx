"use client";

import { useEffect, useRef } from "react";
import type { ForecastDay, TemperatureRange } from "./types";

interface WeatherChartProps {
  forecast: ForecastDay[];
  temperatureRange: TemperatureRange;
}

export function WeatherChart({
  forecast,
  temperatureRange,
}: WeatherChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Chart dimensions
    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;

    // Calculate temperature scale
    const tempMin = temperatureRange.min - 2;
    const tempMax = temperatureRange.max + 2;
    const tempRange = tempMax - tempMin;

    // Function to map temperature to Y coordinate
    const tempToY = (temp: number) => {
      return (
        chartHeight - ((temp - tempMin) / tempRange) * chartHeight + padding
      );
    };

    // Calculate X positions for each forecast day
    const xStep = chartWidth / (forecast.length - 1);
    const points = forecast.map((day, index) => ({
      x: padding + index * xStep,
      y: tempToY(day.temperature),
      temp: day.temperature,
    }));

    // Draw smooth curve
    ctx.beginPath();
    ctx.strokeStyle = "#10b981"; // green-500
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Move to first point
    ctx.moveTo(points[0].x, points[0].y);

    // Draw smooth bezier curve through points
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlPointX = (current.x + next.x) / 2;

      ctx.bezierCurveTo(
        controlPointX,
        current.y,
        controlPointX,
        next.y,
        next.x,
        next.y
      );
    }

    ctx.stroke();

    // Draw gradient fill under curve
    const gradient = ctx.createLinearGradient(0, padding, 0, rect.height);
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)"); // green-500 with opacity
    gradient.addColorStop(1, "rgba(16, 185, 129, 0.02)");

    ctx.lineTo(points[points.length - 1].x, rect.height - padding);
    ctx.lineTo(points[0].x, rect.height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw points and labels
    points.forEach((point, index) => {
      // Draw point circle
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#10b981"; // green-500
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw temperature label above point
      ctx.fillStyle = "#374151"; // gray-700
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${point.temp}°C`, point.x, point.y - 15);

      // Draw day label below chart
      ctx.fillStyle = "#6b7280"; // gray-500
      ctx.font = "12px system-ui";
      ctx.fillText(forecast[index].day, point.x, rect.height - padding + 20);
    });

    // Draw Y-axis temperature markers
    const tempSteps = 4;
    for (let i = 0; i <= tempSteps; i++) {
      const temp = tempMin + (tempRange / tempSteps) * i;
      const y = tempToY(temp);

      // Draw horizontal grid line
      ctx.beginPath();
      ctx.strokeStyle = "#e5e7eb"; // gray-200
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.moveTo(padding, y);
      ctx.lineTo(rect.width - padding, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw temperature label
      ctx.fillStyle = "#9ca3af"; // gray-400
      ctx.font = "11px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(`${Math.round(temp)}°`, padding - 10, y + 4);
    }
  }, [forecast, temperatureRange]);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">Temperature</p>
          <p className="text-2xl font-bold text-gray-900">
            {forecast[0].temperature}°C
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Next 3 Days</p>
          <p className="text-sm font-medium text-green-600">
            +{temperatureRange.max - temperatureRange.min}°C range
          </p>
        </div>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: "200px" }}
        />
      </div>
    </div>
  );
}
