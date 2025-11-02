"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Send } from "lucide-react";

interface LocationSelectorProps {
  onSubmit: (location: string) => void;
  selectedLocation: string;
  loading: boolean;
}

// List of Pakistani cities and agricultural regions
const LOCATIONS = [
  { value: "lahore", label: "Lahore, Punjab" },
  { value: "karachi", label: "Karachi, Sindh" },
  { value: "islamabad", label: "Islamabad" },
  { value: "rawalpindi", label: "Rawalpindi, Punjab" },
  { value: "faisalabad", label: "Faisalabad, Punjab" },
  { value: "multan", label: "Multan, Punjab" },
  { value: "peshawar", label: "Peshawar, Khyber Pakhtunkhwa" },
  { value: "quetta", label: "Quetta, Balochistan" },
  { value: "hyderabad", label: "Hyderabad, Sindh" },
  { value: "gujranwala", label: "Gujranwala, Punjab" },
  { value: "sialkot", label: "Sialkot, Punjab" },
  { value: "bahawalpur", label: "Bahawalpur, Punjab" },
  { value: "sargodha", label: "Sargodha, Punjab" },
  { value: "sukkur", label: "Sukkur, Sindh" },
  { value: "larkana", label: "Larkana, Sindh" },
  { value: "sheikhupura", label: "Sheikhupura, Punjab" },
  { value: "jhang", label: "Jhang, Punjab" },
  { value: "rahim-yar-khan", label: "Rahim Yar Khan, Punjab" },
  { value: "mardan", label: "Mardan, Khyber Pakhtunkhwa" },
  { value: "kasur", label: "Kasur, Punjab" },
];

export function LocationSelector({
  onSubmit,
  selectedLocation,
  loading,
}: LocationSelectorProps) {
  const [location, setLocation] = useState(selectedLocation);

  const handleSubmit = () => {
    if (location) {
      onSubmit(location);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && location) {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start gap-4 flex-col sm:flex-row">
        {/* Location Input */}
        <div className="flex-1 w-full">
          <label
            htmlFor="location-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <MapPin className="w-4 h-4 inline mr-1 text-green-600" />
            Select Your Location
          </label>
          <Select
            value={location}
            onValueChange={setLocation}
            disabled={loading}
          >
            <SelectTrigger
              id="location-select"
              className="w-full h-11 text-base"
              onKeyDown={handleKeyPress}
            >
              <SelectValue placeholder="Enter your location" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Allow Access Button */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2 invisible">
            Action
          </label>
          <Button
            onClick={handleSubmit}
            disabled={!location || loading}
            className="bg-green-600 hover:bg-green-700 text-white h-11 px-6 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Loading...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Allow Access
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 mt-3">
        Select your location to get accurate weather forecasts and farming tips
        for your area
      </p>
    </div>
  );
}
