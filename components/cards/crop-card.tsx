"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit3, Trash2, User, Wheat } from "lucide-react";
import { toast } from "sonner";
import { deleteCrop, type Crop } from "@/lib/firebase-crops";

// Badge component inline
const Badge = ({ variant = "default", className, children, ...props }: {
  variant?: "default" | "secondary" | "outline";
  className?: string;
  children: React.ReactNode;
}) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold";
  const variantClasses = {
    default: "bg-primary text-primary-foreground border-transparent",
    secondary: "bg-secondary text-secondary-foreground border-transparent", 
    outline: "text-foreground"
  };
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
};
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CropCardProps {
  crop: Crop;
  onUpdate: (crop: Crop) => void;
  onDelete: (cropId: string) => void;
}

const getConditionColor = (condition: string) => {
  switch (condition) {
    case "excellent":
      return "bg-green-100 text-green-800 border-green-200";
    case "good":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "fair":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "poor":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function CropCard({ crop, onUpdate, onDelete }: CropCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCrop(crop.id);
      toast.success("Crop deleted successfully");
      onDelete(crop.id);
    } catch (error) {
      console.error("Error deleting crop:", error);
      toast.error("Failed to delete crop");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Wheat className="w-5 h-5 text-green-600" />
              {crop.cropName}
            </CardTitle>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <User className="w-4 h-4" />
              Farmer Crop
            </p>
          </div>
          <Badge
            variant="outline"
            className={`${getConditionColor(crop.condition)} font-medium`}
          >
            {crop.condition.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Category</span>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {crop.category}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Sow Date
            </span>
            <span className="text-sm text-gray-900 font-medium">
              {formatDate(crop.sowDate)}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500 pt-2 border-t">
          <div className="flex justify-between">
            <span>Created: {formatDate(crop.createdAt)}</span>
            <span>Updated: {formatDate(crop.updatedAt)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t bg-gray-50/50">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdate(crop)}
            className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Crop</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &ldquo;{crop.cropName}&rdquo;? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}