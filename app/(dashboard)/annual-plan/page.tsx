"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  CalendarDays,
  Loader2,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
} from "lucide-react";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { PlanFormModal } from "./components/plan-form-modal";
import { PlanDisplay } from "./components/plan-display";
import { ConfirmDialog } from "./components/confirm-dialog";
import { useLocalization } from "@/lib/localization";

// Hardcoded user ID (can be easily replaced with Firebase Auth UID later)
let USER_ID: string | undefined;
if (typeof window !== "undefined") {
  try {
    const userStr = localStorage.getItem("user");
    const parsedUser = userStr ? JSON.parse(userStr) : null;
    USER_ID = parsedUser?.uid;
  } catch (e) {
    console.warn("Failed to parse stored user:", e);
    USER_ID = undefined;
  }
}

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

export default function AnnualPlanPage() {
  const { t } = useLocalization();
  const [planData, setPlanData] = useState<AnnualPlanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);

  // Fetch existing plan from Firestore
  const fetchPlan = useCallback(async () => {
    try {
      setIsLoading(true);
      const planRef = doc(db, "annual_plans", USER_ID);
      const planSnap = await getDoc(planRef);

      if (planSnap.exists()) {
        const data = planSnap.data() as AnnualPlanData;
        setPlanData(data);
        toast.success(t("planLoaded"));
      } else {
        // No plan exists, show modal
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching plan:", error);
      toast.error(t("failedToLoadPlan"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // Initial load
  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  // Save plan to Firestore
  const savePlanToFirestore = async (data: AnnualPlanData) => {
    try {
      const planRef = doc(db, "annual_plans", USER_ID);
      await setDoc(planRef, data);
      toast.success(t("planSaved"));
      return true;
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error(t("failedToSavePlan"));
      return false;
    }
  };

  // Generate new plan
  const handleGeneratePlan = async (formData: any) => {
    try {
      setIsGenerating(true);
      toast.loading(t("generatingPlan"), {
        id: "generating",
      });

      // Call API to generate plan
      const response = await fetch("/api/annual-plan/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("failedToGeneratePlan"));
      }

      const result = await response.json();

      if (result.success && result.data) {
        // Save to Firestore
        const saved = await savePlanToFirestore(result.data);

        if (saved) {
          setPlanData(result.data);
          setIsModalOpen(false);
          toast.success(t("planGenerated"), {
            id: "generating",
          });
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Error generating plan:", error);
      toast.error(error.message || t("failedToGeneratePlan"), {
        id: "generating",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle regenerate with confirmation
  const handleRegenerateClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmRegenerate = (formData: any) => {
    setPendingFormData(formData);
    setIsModalOpen(false);
    setShowConfirmDialog(true);
  };

  const handleConfirmedRegenerate = async () => {
    setShowConfirmDialog(false);
    if (pendingFormData) {
      await handleGeneratePlan(pendingFormData);
      setPendingFormData(null);
    }
  };

  // Update activity status in Firestore
  const handleActivityStatusChange = async (
    monthIndex: number,
    activityIndex: number
  ) => {
    if (!planData) return;

    const updatedPlan = { ...planData };
    const currentStatus =
      updatedPlan.annualPlan[monthIndex].activities[activityIndex].status;
    updatedPlan.annualPlan[monthIndex].activities[activityIndex].status =
      currentStatus === "pending" ? "completed" : "pending";

    try {
      setPlanData(updatedPlan);
      await savePlanToFirestore(updatedPlan);
      toast.success("Activity status updated");
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("Failed to update activity status");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your annual plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-green-800 flex items-center gap-3">
              <CalendarDays className="h-10 w-10 text-primary" />
              Annual Farming Plan
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your crop cycle with a science-backed annual plan
            </p>
          </div>
          {planData && (
            <Button
              onClick={() => {
                setPendingFormData(null);
                setIsModalOpen(true);
              }}
              size="lg"
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Generate New Plan
            </Button>
          )}
        </div>
      </div>

      {/* Plan Display or Empty State */}
      {planData ? (
        <PlanDisplay
          planData={planData}
          onActivityStatusChange={handleActivityStatusChange}
          isGenerating={isGenerating}
        />
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CalendarDays className="h-20 w-20 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Annual Plan Yet</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Create your personalized annual farming plan based on your
              location, crops, and farming goals.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Your First Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Modal */}
      <PlanFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPendingFormData(null);
        }}
        onSubmit={planData ? handleConfirmRegenerate : handleGeneratePlan}
        isGenerating={isGenerating}
        isRegenerate={!!planData}
      />

      {/* Confirm Regenerate Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setPendingFormData(null);
        }}
        onConfirm={handleConfirmedRegenerate}
        title="Regenerate Annual Plan?"
        description="This will overwrite your current annual plan. All existing activities and their statuses will be replaced with a new plan."
        confirmText="Yes, Generate New Plan"
        cancelText="Cancel"
      />
    </div>
  );
}
