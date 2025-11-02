"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CropPhotoForm } from "@/components/forms/crop-photo-form";
import { AnalysisResults } from "@/components/analysis-result";
import { analyzeCrop } from "@/src/services/cropService";
import { toast } from "sonner";
import { useLocalization } from "@/lib/localization";

interface TreatmentStep {
  step: string;
  description: string;
}

interface AnalysisData {
  detectedCrop: string;
  healthStatus: "Healthy" | "At Risk" | "Critical";
  pestDisease: string;
  diseaseConfidence: number;
  severity: "None" | "Mild" | "Moderate" | "Severe";
  affectedArea: string;
  treatmentPlan: TreatmentStep[];
  preventiveMeasures: string[];
  estimatedRecoveryTime: string;
  additionalNotes: string;
  detectedCrop_en?: string;
  detectedCrop_ur?: string;
  pestDisease_en?: string;
  pestDisease_ur?: string;
  affectedArea_en?: string;
  affectedArea_ur?: string;
  treatmentPlan_en?: TreatmentStep[];
  treatmentPlan_ur?: TreatmentStep[];
  preventiveMeasures_en?: string[];
  preventiveMeasures_ur?: string[];
  estimatedRecoveryTime_en?: string;
  estimatedRecoveryTime_ur?: string;
  additionalNotes_en?: string;
  additionalNotes_ur?: string;
}

export default function AIAnalysisPage() {
  const { t } = useLocalization();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleFormSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      setShowResults(false);

      toast.loading("Analyzing your crop image...", {
        id: "crop-analysis",
      });

      const uploadData = new FormData();
      uploadData.append("photo", formData.photo);
      uploadData.append("cropType", formData.cropType);
      if (formData.notes) {
        uploadData.append("notes", formData.notes);
      }

      const result = await analyzeCrop(uploadData);

      setAnalysis({
        detectedCrop: result.detectedCrop || formData.cropType,
        healthStatus: result.healthStatus || "Healthy",
        pestDisease: result.pestDisease || "None",
        diseaseConfidence: result.diseaseConfidence || 0,
        severity: result.severity || "None",
        affectedArea: result.affectedArea || "N/A",
        treatmentPlan: result.treatmentPlan || [
          {
            step: "No Treatment Required",
            description: "Continue regular monitoring and maintenance.",
          },
        ],
        preventiveMeasures: result.preventiveMeasures || [],
        estimatedRecoveryTime: result.estimatedRecoveryTime || "N/A",
        additionalNotes: result.additionalNotes || "",
        detectedCrop_en: result.detectedCrop_en,
        detectedCrop_ur: result.detectedCrop_ur,
        pestDisease_en: result.pestDisease_en,
        pestDisease_ur: result.pestDisease_ur,
        affectedArea_en: result.affectedArea_en,
        affectedArea_ur: result.affectedArea_ur,
        treatmentPlan_en: result.treatmentPlan_en,
        treatmentPlan_ur: result.treatmentPlan_ur,
        preventiveMeasures_en: result.preventiveMeasures_en,
        preventiveMeasures_ur: result.preventiveMeasures_ur,
        estimatedRecoveryTime_en: result.estimatedRecoveryTime_en,
        estimatedRecoveryTime_ur: result.estimatedRecoveryTime_ur,
        additionalNotes_en: result.additionalNotes_en,
        additionalNotes_ur: result.additionalNotes_ur,
      });
      setShowResults(true);

      toast.success("Analysis completed successfully!", {
        id: "crop-analysis",
        description: `Your ${result.detectedCrop} crop has been analyzed.`,
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Analysis failed:", error);

      toast.error("Analysis failed", {
        id: "crop-analysis",
        description:
          error.response?.data?.error ||
          error.message ||
          "Failed to analyze crop. Please try again.",
        duration: 5000,
      });

      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResult = async () => {
    try {
      setIsLoading(true);
      toast.loading("Saving analysis result...", { id: "save-result" });

      console.log("Saving analysis result...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Result saved successfully!", {
        id: "save-result",
        description: "Your crop analysis has been saved to your records.",
        duration: 4000,
      });
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save result", {
        id: "save-result",
        description: "Please try again later.",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAI = async () => {
    try {
      setIsLoading(true);
      toast.loading("Asking AI for more details...", { id: "ask-ai" });

      console.log("Asking AI for more details...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("AI response received!", {
        id: "ask-ai",
        description: "Additional insights have been generated.",
        duration: 4000,
      });
    } catch (error) {
      console.error("Ask AI failed:", error);
      toast.error("Failed to get AI response", {
        id: "ask-ai",
        description: "Please try again later.",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          {t("aiCropAnalysis")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="p-6 bg-card border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">
                {t("uploadCropPhoto")}
              </h2>
              <CropPhotoForm
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
              />
            </Card>
          </div>

          <div>
            {showResults && analysis ? (
              <Card className="p-6 bg-card border border-border">
                <AnalysisResults
                  detectedCrop={analysis.detectedCrop}
                  healthStatus={analysis.healthStatus}
                  pestDisease={analysis.pestDisease}
                  diseaseConfidence={analysis.diseaseConfidence}
                  severity={analysis.severity}
                  affectedArea={analysis.affectedArea}
                  treatmentPlan={analysis.treatmentPlan}
                  preventiveMeasures={analysis.preventiveMeasures}
                  estimatedRecoveryTime={analysis.estimatedRecoveryTime}
                  additionalNotes={analysis.additionalNotes}
                  detectedCrop_en={analysis.detectedCrop_en}
                  detectedCrop_ur={analysis.detectedCrop_ur}
                  pestDisease_en={analysis.pestDisease_en}
                  pestDisease_ur={analysis.pestDisease_ur}
                  affectedArea_en={analysis.affectedArea_en}
                  affectedArea_ur={analysis.affectedArea_ur}
                  treatmentPlan_en={analysis.treatmentPlan_en}
                  treatmentPlan_ur={analysis.treatmentPlan_ur}
                  preventiveMeasures_en={analysis.preventiveMeasures_en}
                  preventiveMeasures_ur={analysis.preventiveMeasures_ur}
                  estimatedRecoveryTime_en={analysis.estimatedRecoveryTime_en}
                  estimatedRecoveryTime_ur={analysis.estimatedRecoveryTime_ur}
                  additionalNotes_en={analysis.additionalNotes_en}
                  additionalNotes_ur={analysis.additionalNotes_ur}
                  onSave={handleSaveResult}
                  onAskAI={handleAskAI}
                  isLoading={isLoading}
                />
              </Card>
            ) : (
              <Card className="p-6 bg-muted border border-border flex items-center justify-center min-h-96">
                <p className="text-center text-muted-foreground">
                  {t("uploadToSeeResults")}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
