// src/services/profileService.ts
import apiClient from "./apiClient";
import type {
  Profile,
  UpdateProfilePayload,
  UpdateProfileResponse,
} from "../types/api.types";

export const getProfile = async (): Promise<Profile> => {
  try {
    const response = await apiClient.get<Profile>("/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (
  profileData: UpdateProfilePayload
): Promise<UpdateProfileResponse> => {
  try {
    const response = await apiClient.put<UpdateProfileResponse>(
      "/profile",
      profileData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
