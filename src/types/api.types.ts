// src/types/api.types.ts

/**
 * Profile API Types
 */
export interface Profile {
  name: string;
  role: string;
  location: string;
  registeredAt: string;
  email: string;
  phone: string;
  farmSize: string;
  crops: string[];
  avatar?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  location?: string;
  email?: string;
  phone?: string;
  farmSize?: string;
  crops?: string[];
  primaryCrops?: string;
  farmingExperience?: string;
}

export interface UpdateProfileResponse extends Profile {
  updatedAt: string;
  message: string;
}

/**
 * Crop Analysis API Types
 */
export interface CropAnalysisResult {
  crop: string;
  healthStatus: string;
  pestDetected: boolean;
  recommendation: string;
}

export interface TreatmentStep {
  step: string;
  description: string;
}

export interface CropAnalysisDetailed {
  // English fields (primary, for backward compatibility)
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

  // Bilingual support - English versions
  detectedCrop_en: string;
  pestDisease_en: string;
  affectedArea_en: string;
  treatmentPlan_en: TreatmentStep[];
  preventiveMeasures_en: string[];
  estimatedRecoveryTime_en: string;
  additionalNotes_en: string;

  // Bilingual support - Urdu versions (in Urdu script)
  detectedCrop_ur: string;
  pestDisease_ur: string;
  affectedArea_ur: string;
  treatmentPlan_ur: TreatmentStep[];
  preventiveMeasures_ur: string[];
  estimatedRecoveryTime_ur: string;
  additionalNotes_ur: string;

  analysis: {
    confidence: number;
    uploadedAt: string;
    notes: string;
    modelUsed?: string;
  };
}

export interface AnalyzeCropPayload {
  photo: File;
  cropType: string;
  notes?: string;
}

/**
 * Form Types
 */
export interface CropPhotoFormData {
  cropType: string;
  photo: File;
  notes?: string;
}

/**
 * API Error Types
 */
export interface APIError {
  error: string;
  message?: string;
  statusCode?: number;
}
