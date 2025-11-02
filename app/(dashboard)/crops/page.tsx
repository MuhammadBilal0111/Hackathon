"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Filter, Search, Wheat, AlertCircle } from "lucide-react";
import { toast } from "sonner";

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import CropCard from "@/components/cards/crop-card";
import CropForm from "@/components/forms/crop-form";
import { getAllCrops, type Crop } from "@/lib/firebase-crops";

export default function CropsPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");

  // Mock farmer ID - in real app, this would come from auth context
  const farmerId = "6gkZbTyO5xvYpL3Jh1Rw";

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    try {
      setLoading(true);
      const allCrops = await getAllCrops({ farmerId });
      setCrops(allCrops);
    } catch (error) {
      console.error("Error loading crops:", error);
      toast.error("Failed to load crops");
    } finally {
      setLoading(false);
    }
  };

  const filterCrops = useCallback(() => {
    let filtered = [...crops];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (crop) =>
          crop.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crop.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((crop) => {
        if (categoryFilter === "All") return true;
        return crop.category === categoryFilter;
      });
    }

    // Condition filter
    if (conditionFilter) {
      filtered = filtered.filter((crop) => {
        if (conditionFilter === "All") return true;
        return crop.condition === conditionFilter;
      });
    }

    setFilteredCrops(filtered);
  }, [crops, searchQuery, categoryFilter, conditionFilter]);

  useEffect(() => {
    filterCrops();
  }, [filterCrops]);

  const handleCropUpdate = (crop: Crop) => {
    setEditingCrop(crop);
    setIsFormOpen(true);
  };

  const handleCropDelete = (cropId: string) => {
    setCrops((prev) => prev.filter((crop) => crop.id !== cropId));
  };

  const handleFormSuccess = () => {
    loadCrops();
    setEditingCrop(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCrop(null);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setConditionFilter("");
  };

  const getStatistics = () => {
    const total = crops.length;
    const byCondition = crops.reduce((acc, crop) => {
      acc[crop.condition] = (acc[crop.condition] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCategory = crops.reduce((acc, crop) => {
      acc[crop.category] = (acc[crop.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, byCondition, byCategory };
  };

  const stats = getStatistics();
  const categories = [...new Set(crops.map((crop) => crop.category))];
  const conditions = [...new Set(crops.map((crop) => crop.condition))];
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Wheat className="w-16 h-16 text-green-500 animate-pulse mx-auto" />
            <p className="text-gray-600">Loading your crops...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Wheat className="w-8 h-8 text-green-600" />
              My Crops
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track your crop inventory
            </p>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Crop
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Crops</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {stats.total}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Excellent</CardDescription>
            <CardTitle className="text-2xl text-green-500">
              {stats.byCondition.excellent || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Good</CardDescription>
            <CardTitle className="text-2xl text-blue-500">
              {stats.byCondition.good || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Need Attention</CardDescription>
            <CardTitle className="text-2xl text-red-500">
              {(stats.byCondition.fair || 0) + (stats.byCondition.poor || 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={
                    crops.length === 0
                      ? "No crops to search"
                      : "Search crops..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  disabled={crops.length === 0}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              {categories.length != 0 && (
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                  disabled={categories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        categories.length === 0
                          ? "No categories available"
                          : "All categories"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label>Condition</Label>
              {conditions.length != 0 && (
              <Select
                  value={conditionFilter}
                  onValueChange={setConditionFilter}
                  disabled={conditions.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        conditions.length === 0
                          ? "No conditions available"
                          : "All conditions"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All conditions</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
                disabled={crops.length === 0}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <p className="text-gray-600">
            Showing {filteredCrops.length} of {crops.length} crops
          </p>
          {(searchQuery || categoryFilter || conditionFilter) && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              Filtered
            </Badge>
          )}
        </div>
      </div>

      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {crops.length === 0
                ? "No crops yet"
                : "No crops match your filters"}
            </h3>
            <p className="text-gray-600 mb-6">
              {crops.length === 0
                ? "Get started by adding your first crop to track your inventory."
                : "Try adjusting your search criteria or clear the filters."}
            </p>
            {crops.length === 0 && (
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Crop
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCrops.map((crop) => (
            <CropCard
              key={crop.id}
              crop={crop}
              onUpdate={handleCropUpdate}
              onDelete={handleCropDelete}
            />
          ))}
        </div>
      )}

      {/* Crop Form Modal */}
      <CropForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        crop={editingCrop}
        farmerId={farmerId}
      />
    </div>
  );
}
