"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface AnalysisResultsProps {
  detectedCrop: string;
  healthStatus: "Healthy" | "At Risk" | "Critical";
  pestDisease: string;
  treatmentPlan: string;
  onSave: () => void;
  onAskAI: () => void;
  isLoading?: boolean;
}

export function AnalysisResults({
  detectedCrop,
  healthStatus,
  pestDisease,
  treatmentPlan,
  onSave,
  onAskAI,
  isLoading = false,
}: AnalysisResultsProps) {
  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case "Healthy":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "At Risk":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "Critical":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  const resultItems = [
    { label: "Detected Crop", value: detectedCrop, color: "text-green-700" },
    {
      label: "Health Status",
      value: healthStatus,
      icon: getHealthStatusIcon(healthStatus),
    },
    { label: "Identified Pest/Disease", value: pestDisease },
    {
      label: "Recommended Treatment Plan",
      value: treatmentPlan,
      color: "text-green-700",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resultItems.map((item, index) => (
          <Card key={index} className="p-4 bg-card border border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {item.label}
            </p>
            <div className="flex items-center gap-2">
              {item.icon && <div>{item.icon}</div>}
              <p
                className={`text-base font-semibold ${
                  item.color || "text-foreground"
                }`}
              >
                {item.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={onSave}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Save Result
        </Button>
        <Button onClick={onAskAI} disabled={isLoading} variant="outline">
          Ask AI
        </Button>
      </div>
    </div>
  );
}
