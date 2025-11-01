// src/services/cropService.ts
import apiClient from "./apiClient";
import type {
  CropAnalysisResult,
  CropAnalysisDetailed,
} from "../types/api.types";

export const getCropAnalysis = async (): Promise<CropAnalysisResult> => {
  try {
    const response = await apiClient.get<CropAnalysisResult>("/crop-analysis");
    return response.data;
  } catch (error) {
    console.error("Error fetching crop analysis:", error);
    throw error;
  }
};

export const analyzeCrop = async (
  formData: FormData
): Promise<CropAnalysisDetailed> => {
  try {
    const response = await apiClient.post<CropAnalysisDetailed>(
      "/crop-analysis",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error analyzing crop:", error);
    throw error;
  }
};
