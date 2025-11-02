"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useLocalization } from "@/lib/localization";

// Zod validation schema
const getCropPhotoFormSchema = (t: (key: string) => string) =>
  z.object({
    cropType: z
      .string()
      .min(1, t("validationCropTypeRequired")),
    photo: z
      .any()
      .refine((files) => files?.length > 0, t("validationImageRequired"))
      .refine(
        (files) => files?.[0]?.size <= 5 * 1024 * 1024,
        t("validationImageSize")
      )
      .refine((files) => {
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        return validTypes.includes(files?.[0]?.type);
      }, t("validationImageType"))
      .transform((files) => files[0] as File),
    notes: z.string().optional(),
  });

type CropPhotoFormData = z.infer<ReturnType<typeof getCropPhotoFormSchema>>;

interface CropPhotoFormProps {
  onSubmit: (data: CropPhotoFormData) => Promise<void>;
  isLoading?: boolean;
}

export function CropPhotoForm({
  onSubmit,
  isLoading = false,
}: CropPhotoFormProps) {
  const { t } = useLocalization();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const cropPhotoFormSchema = getCropPhotoFormSchema(t);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CropPhotoFormData>({
    resolver: zodResolver(cropPhotoFormSchema),
  });

  const photoField = watch("photo");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: CropPhotoFormData) => {
    try {
      setSubmitError(null);
      await onSubmit(data);
      reset();
      setPreviewUrl(null);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : t("failedToAnalyzeCrop")
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("cropType")}
        </label>
        <input
          type="text"
          placeholder={t("cropTypePlaceholder")}
          {...register("cropType")}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.cropType && (
          <p className="text-destructive text-sm mt-1">
            {errors.cropType.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("cropPhoto")}
        </label>
        <div className="space-y-3">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            {...register("photo")}
            onChange={handlePhotoChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.photo && (
            <p className="text-destructive text-sm">{errors.photo.message}</p>
          )}

          {previewUrl && (
            <div className="relative w-full h-48 rounded-md overflow-hidden bg-muted">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt={t("imagePreview")}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("additionalNotesOptional")}
        </label>
        <textarea
          placeholder={t("additionalNotesPlaceholder")}
          {...register("notes")}
          rows={3}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {submitError && (
        <Card className="bg-destructive/10 border-destructive/30 p-3 flex gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-destructive text-sm">{submitError}</p>
        </Card>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t("analyzing")}
          </>
        ) : (
          t("analyzeCrop")
        )}
      </Button>
    </form>
  );
}