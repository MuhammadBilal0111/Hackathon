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

export interface CropAnalysisDetailed {
  detectedCrop: string;
  healthStatus: "Healthy" | "At Risk" | "Critical";
  pestDisease: string;
  treatmentPlan: string;
  analysis: {
    confidence: number;
    uploadedAt: string;
    notes: string;
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
