"use client";
import { Leaf, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getAllCrops, type Crop } from "@/lib/firebase-crops";
import { toast } from "sonner";

export function CropsCard({user}: {user?: string}) {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user ID from localStorage

  const fetchCrops = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userId = user;
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      const fetchedCrops = await getAllCrops({ farmerId: userId });
      console.log(fetchedCrops)
      setCrops(fetchedCrops);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch crops";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Crops fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  // Helper function to get health percentage based on condition
  const getHealthPercentage = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent": return 95;
      case "good": return 80;
      case "fair": return 65;
      case "poor": return 40;
      default: return 75;
    }
  };
  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading crops...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <Leaf className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600 mb-2">{error}</p>
            <button 
              onClick={fetchCrops}
              className="text-xs text-accent hover:text-accent/80 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">
            YOUR CROPS
          </p>
          <h3 className="text-2xl font-bold text-foreground">
            {crops.length} Active Crops
          </h3>
        </div>
        <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
          <Leaf className="w-6 h-6 text-accent" />
        </div>
      </div>
      <div className="space-y-4">
        {crops.length === 0 ? (
          <div className="text-center py-8">
            <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No crops found</p>
            <p className="text-xs text-muted-foreground mt-1">Add your first crop to get started</p>
          </div>
        ) : (
          crops.map((crop) => (
            <div
              key={crop.id}
              className="p-4 bg-secondary/50 rounded-lg border border-border/30 hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🌾</div>
                  <div>
                    <p className="font-semibold text-foreground">{crop.cropName}</p>
                    <p className="text-xs text-muted-foreground">{crop.category}</p>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  crop.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                  crop.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                  crop.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {crop.condition}
                </span>
                <span className="text-xs text-muted-foreground">
                  Sown: {new Date(crop.sowDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
