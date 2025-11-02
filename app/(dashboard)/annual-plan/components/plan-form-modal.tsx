"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Sparkles,
  MapPin,
  Wheat,
  Droplets,
  Target,
} from "lucide-react";
import { toast } from "sonner";

interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  isGenerating: boolean;
  isRegenerate?: boolean;
}

const SOIL_TYPES = [
  "Clay",
  "Sandy",
  "Loamy",
  "Silty",
  "Peaty",
  "Chalky",
  "Saline",
  "Red Soil",
  "Black Soil",
  "Alluvial",
];

const COMMON_CROPS = [
  "Wheat",
  "Rice",
  "Corn/Maize",
  "Cotton",
  "Sugarcane",
  "Soybean",
  "Potato",
  "Tomato",
  "Onion",
  "Mango",
  "Banana",
  "Orange",
  "Apple",
  "Grapes",
  "Other",
];

const EXPERIENCE_LEVELS = [
  "Beginner (0-2 years)",
  "Intermediate (3-5 years)",
  "Experienced (6-10 years)",
  "Expert (10+ years)",
];

const FARMING_TYPES = ["Traditional", "Organic", "Hydroponic", "Mixed"];

const WATER_AVAILABILITY = ["Abundant", "Moderate", "Limited", "Seasonal"];

export function PlanFormModal({
  isOpen,
  onClose,
  onSubmit,
  isGenerating,
  isRegenerate = false,
}: PlanFormModalProps) {
  const [formData, setFormData] = useState({
    location: "",
    farmSize: "",
    soilType: "",
    primaryCrops: [] as string[],
    customCrop: "",
    experienceLevel: "",
    availableResources: "",
    farmingGoals: "",
    waterAvailability: "",
    farmingType: "",
  });

  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

  const handleCropToggle = (crop: string) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.location.trim()) {
      toast.error("Please enter your location");
      return;
    }

    if (!formData.farmSize.trim()) {
      toast.error("Please enter your farm size");
      return;
    }

    if (!formData.soilType) {
      toast.error("Please select soil type");
      return;
    }

    let crops = [...selectedCrops];
    if (formData.customCrop.trim()) {
      crops.push(formData.customCrop.trim());
    }

    if (crops.length === 0) {
      toast.error("Please select at least one crop");
      return;
    }

    // Submit data
    onSubmit({
      ...formData,
      primaryCrops: crops,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-green-900">
            {isRegenerate
              ? "Generate New Annual Plan"
              : "Create Your Annual Farming Plan"}
          </DialogTitle>
          <DialogDescription>
            Provide details about your farm to generate a personalized annual
            plan powered by AI
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location / Region *
            </Label>
            <Input
              id="location"
              placeholder="e.g., Punjab, Pakistan or California, USA"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              disabled={isGenerating}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter your city, state, or region for location-specific
              recommendations
            </p>
          </div>

          {/* Farm Size */}
          <div className="space-y-2">
            <Label htmlFor="farmSize">Farm Size *</Label>
            <Input
              id="farmSize"
              placeholder="e.g., 5 acres, 2 hectares, 10 kanals"
              value={formData.farmSize}
              onChange={(e) => handleInputChange("farmSize", e.target.value)}
              disabled={isGenerating}
              required
            />
          </div>

          {/* Soil Type */}
          <div className="space-y-2">
            <Label htmlFor="soilType">Soil Type *</Label>
            <Select
              value={formData.soilType}
              onValueChange={(value) => handleInputChange("soilType", value)}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                {SOIL_TYPES.map((soil) => (
                  <SelectItem key={soil} value={soil}>
                    {soil}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Primary Crops */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Wheat className="h-4 w-4" />
              Primary Crops * (Select all that apply)
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMMON_CROPS.map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => handleCropToggle(crop)}
                  disabled={isGenerating}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCrops.includes(crop)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {crop}
                </button>
              ))}
            </div>
            <Input
              placeholder="Or enter custom crop name"
              value={formData.customCrop}
              onChange={(e) => handleInputChange("customCrop", e.target.value)}
              disabled={isGenerating}
              className="mt-2"
            />
          </div>

          {/* Water Availability */}
          <div className="space-y-2">
            <Label
              htmlFor="waterAvailability"
              className="flex items-center gap-2"
            >
              <Droplets className="h-4 w-4" />
              Water Availability
            </Label>
            <Select
              value={formData.waterAvailability}
              onValueChange={(value) =>
                handleInputChange("waterAvailability", value)
              }
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select water availability" />
              </SelectTrigger>
              <SelectContent>
                {WATER_AVAILABILITY.map((water) => (
                  <SelectItem key={water} value={water}>
                    {water}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Farming Type */}
          <div className="space-y-2">
            <Label htmlFor="farmingType">Farming Type</Label>
            <Select
              value={formData.farmingType}
              onValueChange={(value) => handleInputChange("farmingType", value)}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select farming type" />
              </SelectTrigger>
              <SelectContent>
                {FARMING_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Select
              value={formData.experienceLevel}
              onValueChange={(value) =>
                handleInputChange("experienceLevel", value)
              }
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Available Resources */}
          <div className="space-y-2">
            <Label htmlFor="availableResources">Available Resources</Label>
            <Input
              id="availableResources"
              placeholder="e.g., Tractor, irrigation system, budget constraints"
              value={formData.availableResources}
              onChange={(e) =>
                handleInputChange("availableResources", e.target.value)
              }
              disabled={isGenerating}
            />
          </div>

          {/* Farming Goals */}
          <div className="space-y-2">
            <Label htmlFor="farmingGoals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Farming Goals
            </Label>
            <Input
              id="farmingGoals"
              placeholder="e.g., Maximize yield, organic farming, sustainable practices"
              value={formData.farmingGoals}
              onChange={(e) =>
                handleInputChange("farmingGoals", e.target.value)
              }
              disabled={isGenerating}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isGenerating}
              className="flex-1 gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {isRegenerate ? "Regenerate Plan" : "Generate Plan"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
