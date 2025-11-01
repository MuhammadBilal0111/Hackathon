"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/src/services/profileService";
import { getCropAnalysis } from "@/src/services/cropService";

export default function Dashboard() {
  const [profileData, setProfileData] = useState<any>(null);
  const [cropData, setCropData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch profile data
        const profile = await getProfile();
        console.log("Profile Data:", profile);
        setProfileData(profile);

        // Fetch crop analysis data
        const crop = await getCropAnalysis();
        console.log("Crop Analysis:", crop);
        setCropData(crop);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Dashboard - API Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Data Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Profile Data
            </h2>
            {profileData ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {profileData.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Role:</span> {profileData.role}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Location:</span>{" "}
                  {profileData.location}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{" "}
                  {profileData.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Farm Size:</span>{" "}
                  {profileData.farmSize}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Registered:</span>{" "}
                  {profileData.registeredAt}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </div>

          {/* Crop Analysis Data Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Crop Analysis
            </h2>
            {cropData ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Crop:</span> {cropData.crop}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Health Status:</span>{" "}
                  {cropData.healthStatus}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Pest Detected:</span>{" "}
                  {cropData.pestDetected ? "Yes" : "No"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Recommendation:</span>{" "}
                  {cropData.recommendation}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </div>
        </div>

        {/* Console Log Notice */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>✓ API Test Complete!</strong>
            <br />
            Check your browser console to see the JSON responses from both APIs.
          </p>
        </div>

        {/* Raw JSON Display */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Profile JSON</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(profileData, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Crop Analysis JSON</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(cropData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
