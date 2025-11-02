import axios, { type AxiosInstance, type AxiosError } from "axios";

// Create Axios instance with base config
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth tokens if needed
apiClient.interceptors.request.use((config) => {
  // Add any auth headers here
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("API Error:", error.message);
    return Promise.reject(error);
  }
);

// Crop Analysis API calls
export const cropAnalysisApi = {
  // Upload and analyze crop photo
  analyzeCrop: async (file: File, formData?: Record<string, string>) => {
    const data = new FormData();
    data.append("file", file);
    if (formData) {
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
    }
    return apiClient.post("/crop-analysis/analyze", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Get analysis results
  getResults: async (analysisId: string) => {
    return apiClient.get(`/crop-analysis/results/${analysisId}`);
  },

  // Save analysis result
  saveResult: async (analysisId: string, notes?: string) => {
    return apiClient.post(`/crop-analysis/save/${analysisId}`, { notes });
  },

  // Ask AI for more details
  askAI: async (analysisId: string, question: string) => {
    return apiClient.post(`/crop-analysis/ask-ai`, { analysisId, question });
  },
};

// Dashboard API calls
export const dashboardApi = {
  getDashboardData: async () => {
    return apiClient.get("/dashboard");
  },
};

// Crop Management API calls
export const cropManagementApi = {
  getCrops: async () => {
    return apiClient.get("/crops");
  },
  addCrop: async (cropData: Record<string, string>) => {
    return apiClient.post("/crops", cropData);
  },
};

// Weather API calls
export const weatherApi = {
  getForecast: async (location?: string) => {
    return apiClient.get("/weather/forecast", { params: { location } });
  },
};

// Market Insights API calls
export const marketApi = {
  getInsights: async () => {
    return apiClient.get("/market/insights");
  },
};

// Profile API calls
export const profileApi = {
  // Get farmer profile
  getProfile: async (userId: string) => {
    return apiClient.get(`/profile/${userId}`);
  },

  // Create or update farmer profile
  updateProfile: async (
    userId: string,
    profileData: {
      name: string;
      email: string;
      phone: string;
      location: string;
      primaryCrops: string;
      farmingExperience: string;
      avatar?: string;
    }
  ) => {
    return apiClient.put(`/profile/${userId}`, profileData);
  },

  // Upload profile avatar
  uploadAvatar: async (userId: string, file: File) => {
    const data = new FormData();
    data.append("file", file);
    return apiClient.post(`/profile/${userId}/avatar`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Get default crops list
  getCropsList: async () => {
    return apiClient.get("/profile/crops-list");
  },
};

export default apiClient;
