"use client";
import { Leaf, TrendingUp } from "lucide-react";
export function CropsCard() {
  const crops = [
    { name: "Wheat", area: "12 hectares", health: 92, icon: "🌾" },
    { name: "Rice", area: "8 hectares", health: 85, icon: "🌾" },
    { name: "Corn", area: "10 hectares", health: 78, icon: "🌽" },
  ];
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">
            YOUR CROPS
          </p>
          <h3 className="text-2xl font-bold text-foreground">
            {crops.length} Active Crops
          </h3>
        </div>
        <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
          <Leaf className="w-6 h-6 text-accent" />
        </div>
      </div>
      <div className="space-y-4">
        {crops.map((crop, i) => (
          <div
            key={i}
            className="p-4 bg-secondary/50 rounded-lg border border-border/30 hover:border-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{crop.icon}</div>
                <div>
                  <p className="font-semibold text-foreground">{crop.name}</p>
                  <p className="text-xs text-muted-foreground">{crop.area}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-accent">
                {crop.health}%
              </span>
            </div>
            <div className="w-full bg-muted/40 rounded-full h-2">
              <div
                className="bg-accent rounded-full h-2 transition-all duration-300"
                style={{ width: `${crop.health}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
