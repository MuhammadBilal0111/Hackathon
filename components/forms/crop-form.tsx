"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Calendar, Wheat } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createCrop, updateCrop, type Crop, type CreateCropData, type UpdateCropData } from "@/lib/firebase-crops";

const formSchema = z.object({
  cropName: z.string().min(2, "Crop name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  sowDate: z.string().min(1, "Please select a sow date"),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
});

interface CropFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  crop?: Crop | null;
  farmerId: string;
}

export default function CropForm({ 
  isOpen, 
  onClose, 
  onSuccess, 
  crop, 
  farmerId 
}: CropFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!crop;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropName: crop?.cropName || "",
      category: crop?.category || "",
      sowDate: crop?.sowDate || "",
      condition: crop?.condition || "good",
    },
  });

  // Reset form when crop changes
  useEffect(() => {
    if (crop) {
      form.reset({
        cropName: crop.cropName,
        category: crop.category,
        sowDate: crop.sowDate,
        condition: crop.condition,
      });
    } else {
      form.reset({
        cropName: "",
        category: "",
        sowDate: "",
        condition: "good",
      });
    }
  }, [crop, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (isEditing && crop) {
        const updateData: UpdateCropData = {
          cropName: values.cropName,
          category: values.category,
          sowDate: values.sowDate,
          condition: values.condition,
        };
        
        await updateCrop(crop.id, updateData);
        toast.success("Crop updated successfully!");
      } else {
        const cropData: CreateCropData = {
          cropName: values.cropName,
          category: values.category,
          sowDate: values.sowDate,
          condition: values.condition,
          farmerId,
        };
        
        await createCrop(cropData);
        toast.success("Crop created successfully!");
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving crop:", error);
      toast.error(isEditing ? "Failed to update crop" : "Failed to create crop");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wheat className="w-5 h-5 text-green-600" />
            {isEditing ? "Update Crop" : "Add New Crop"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the crop information below" 
              : "Fill in the details to add a new crop to your inventory"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Crop Name */}
          <div className="space-y-2">
            <Label htmlFor="cropName" className="text-sm font-medium flex items-center gap-1">
              <Wheat className="w-4 h-4" />
              Crop Name
            </Label>
            <Input
              id="cropName"
              {...form.register("cropName")}
              placeholder="e.g., Wheat, Rice, Corn"
              className={form.formState.errors.cropName ? "border-red-500" : ""}
            />
            {form.formState.errors.cropName && (
              <p className="text-sm text-red-500">{form.formState.errors.cropName.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Category</Label>
            <Select
              value={form.watch("category")}
              onValueChange={(value) => form.setValue("category", value)}
            >
              <SelectTrigger className={form.formState.errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select crop category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grains">Grains</SelectItem>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="legumes">Legumes</SelectItem>
                <SelectItem value="herbs">Herbs & Spices</SelectItem>
                <SelectItem value="nuts">Nuts & Seeds</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
            )}
          </div>

          {/* Sow Date */}
          <div className="space-y-2">
            <Label htmlFor="sowDate" className="text-sm font-medium flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Sow Date
            </Label>
            <Input
              id="sowDate"
              type="date"
              {...form.register("sowDate")}
              className={form.formState.errors.sowDate ? "border-red-500" : ""}
            />
            {form.formState.errors.sowDate && (
              <p className="text-sm text-red-500">{form.formState.errors.sowDate.message}</p>
            )}
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label htmlFor="condition" className="text-sm font-medium">Condition</Label>
            <Select
              value={form.watch("condition")}
              onValueChange={(value) => form.setValue("condition", value as "excellent" | "good" | "fair" | "poor")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">🟢 Excellent</SelectItem>
                <SelectItem value="good">🔵 Good</SelectItem>
                <SelectItem value="fair">🟡 Fair</SelectItem>
                <SelectItem value="poor">🔴 Poor</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.condition && (
              <p className="text-sm text-red-500">{form.formState.errors.condition.message}</p>
            )}
          </div>



          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEditing ? "Update Crop" : "Create Crop"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}