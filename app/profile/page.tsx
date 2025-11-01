"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FarmerProfileForm } from "@/components/forms/farmer-profile-form";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Sprout, Award, Calendar } from "lucide-react";
import { getProfile } from "@/src/services/profileService";

interface ProfileData {
  userId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  primaryCrops: string;
  farmingExperience: string;
  avatar?: string;
  registeredAt?: string;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Fetch profile data from API
        const data = await getProfile();

        setProfileData({
          userId: data.email,
          name: data.name,
          email: data.email,
          phone: data.phone,
          location: data.location,
          primaryCrops: data.crops?.[0] || "",
          farmingExperience: data.role || "",
          avatar: data.avatar,
          registeredAt: data.registeredAt,
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-green-50 to-blue-50">
        <Loader2 className="w-12 h-12 animate-spin text-green-500 mb-4" />
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center space-y-4 p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground">Oops!</h2>
          <p className="text-muted-foreground">
            We couldn't load your profile data. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-green-50/30 to-background">
      {/* Profile Header with Banner */}
      <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="relative max-w-5xl mx-auto px-6 py-12 max-h-screen">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">My Profile</h1>
              <p className="text-green-100 mt-1">
                Manage your farming profile and preferences
              </p>
            </div>
          </div>

          {/* Profile Summary Card */}
          <Card className="shadow-2xl border-0">
            <CardContent>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative group">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-green-200 border-4 border-white shadow-xl">
                    <Image
                      src={profileData.avatar || "/images/avatar.png"}
                      alt={profileData.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center border-4 border-white shadow-lg">
                    ✓
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {profileData.name}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {profileData.email}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center md:justify-start">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span>{profileData.location || "Not set"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center md:justify-start">
                      <Sprout className="w-4 h-4 text-green-500" />
                      <span>{profileData.primaryCrops || "Not set"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center md:justify-start">
                      <Award className="w-4 h-4 text-green-500" />
                      <span>{profileData.farmingExperience || "Not set"}</span>
                    </div>
                  </div>

                  {profileData.registeredAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 justify-center md:justify-start">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Member since{" "}
                        {new Date(profileData.registeredAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Form */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Edit Profile
          </h2>
          <p className="text-muted-foreground">
            Update your personal information and farming details
          </p>
        </div>

        <FarmerProfileForm
          initialData={profileData}
          onSuccess={(data) => {
            setProfileData({ ...profileData, ...data });
          }}
        />
      </div>
    </div>
  );
}
