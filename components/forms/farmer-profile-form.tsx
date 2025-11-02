"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { updateProfile } from "@/src/services/profileService";
import {
  Loader2,
  User,
  MapPin,
  Sprout,
  Award,
  Upload,
  Camera,
} from "lucide-react";
import { useLocalization } from "@/lib/localization";

// Zod validation schema
const getFarmerProfileSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z.string().min(2, t("validationNameMin")).max(50),
      email: z.string().email(t("validationEmailInvalid")),
      phone: z
        .string()
        .regex(/^[\d\s\-+$$$$]+$/, t("validationPhoneInvalid"))
        .min(10),
      location: z.string().min(2, t("validationLocationRequired")).max(100),
      primaryCrops: z.string().min(1, t("validationPrimaryCropsRequired")),
      farmingExperience: z
        .string()
        .min(1, t("validationFarmingExperienceRequired")),
    })
    .extend({
      avatar: z
        .any()
        .refine(
          (files) =>
            !files || files.length === 0 || files?.[0]?.size <= 5 * 1024 * 1024,
          t("validationImageSize")
        )
        .refine(
          (files) =>
            !files ||
            files.length === 0 ||
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
              files?.[0]?.type
            ),
          t("validationImageType")
        )
        .transform((files) => (files && files.length > 0 ? files[0] : undefined))
        .optional(),
    });

type FarmerProfileFormData = z.infer<ReturnType<typeof getFarmerProfileSchema>>;

interface FarmerProfileFormProps {
  initialData?: Partial<FarmerProfileFormData> & { userId: string };
  onSuccess?: (data: FarmerProfileFormData) => void;
}

const CROP_OPTIONS = [
  "Corn",
  "Wheat",
  "Rice",
  "Soybeans",
  "Cotton",
  "Sugarcane",
  "Vegetables",
  "Fruits",
  "Pulses",
  "Oilseeds",
];

const EXPERIENCE_LEVELS = [
  "Beginner (0-2 years)",
  "Intermediate (2-5 years)",
  "Experienced (5-10 years)",
  "Expert (10+ years)",
];

export function FarmerProfileForm({
  initialData,
  onSuccess,
}: FarmerProfileFormProps) {
  const { t } = useLocalization();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const farmerProfileSchema = getFarmerProfileSchema(t);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FarmerProfileFormData>({
    resolver: zodResolver(farmerProfileSchema),
    defaultValues: initialData,
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const onSubmit = async (data: FarmerProfileFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const { avatar, ...profileData } = data;

      console.log("Submitting profile data:", profileData);

      const result = await updateProfile(profileData);

      console.log("Profile update result:", result);

      setSubmitSuccess(true);
      onSuccess?.(data);

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("failedToUpdateProfile");
      setSubmitError(errorMessage);
      console.error("Profile update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-2 border-dashed hover:border-green-400 transition-colors overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative group">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={t("avatarPreview")}
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-100 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center border-4 border-green-100 shadow-lg">
                  <Camera className="w-12 h-12 text-green-600" />
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <Label
                htmlFor="avatar"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Upload className="w-4 h-4" />
                {avatarPreview ? t("changePhoto") : t("uploadPhoto")}
              </Label>
              <Input
                id="avatar"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                {...register("avatar", {
                  onChange: handleAvatarChange,
                })}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                {t("maxFileSize")}
              </p>
              {errors.avatar && (
                <p className="text-sm text-red-500">
                  {typeof errors.avatar.message === "string"
                    ? errors.avatar.message
                    : t("invalidFile")}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-green-600" />
            <CardTitle>{t("personalInformation")}</CardTitle>
          </div>
          <CardDescription>{t("basicContactDetails")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                {t("fullName")}
              </Label>
              <Input
                id="name"
                placeholder={t("fullNamePlaceholder")}
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <span className="text-muted-foreground">📞</span>
                {t("phoneNumber")}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                {...register("phone")}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <span className="text-muted-foreground">✉️</span>
              {t("emailAddress")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <CardTitle>{t("farmLocation")}</CardTitle>
          </div>
          <CardDescription>{t("farmLocationDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            {t("location")}
          </Label>
          <Input
            id="location"
            placeholder={t("locationPlaceholder")}
            {...register("location")}
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location.message}</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-green-600" />
            <CardTitle>{t("farmingDetails")}</CardTitle>
          </div>
          <CardDescription>
            {t("farmingDetailsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryCrops" className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-muted-foreground" />
              {t("primaryCrops")}
            </Label>
            <Select
              value={watch("primaryCrops") || ""}
              onValueChange={(value) => setValue("primaryCrops", value)}
            >
              <SelectTrigger
                id="primaryCrops"
                className={errors.primaryCrops ? "border-red-500" : ""}
              >
                <SelectValue placeholder={t("primaryCropsPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {CROP_OPTIONS.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {t(crop.toLowerCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.primaryCrops && (
              <p className="text-sm text-red-500">
                {errors.primaryCrops.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="farmingExperience"
              className="flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-muted-foreground" />
              {t("farmingExperience")}
            </Label>
            <Select
              value={watch("farmingExperience") || ""}
              onValueChange={(value) => setValue("farmingExperience", value)}
            >
              <SelectTrigger
                id="farmingExperience"
                className={errors.farmingExperience ? "border-red-500" : ""}
              >
                <SelectValue placeholder={t("farmingExperiencePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {t(level.replace(/\s|\(|\)|\+/g, "").toLowerCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.farmingExperience && (
              <p className="text-sm text-red-500">
                {errors.farmingExperience.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      {submitError && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold">{t("error")}</p>
            <p className="text-sm">{submitError}</p>
          </div>
        </div>
      )}
      {submitSuccess && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 flex items-start gap-3 animate-in slide-in-from-top">
          <span className="text-xl">✅</span>
          <div>
            <p className="font-semibold">{t("success")}</p>
            <p className="text-sm">
              {t("profileUpdatedSuccess")}
            </p>
          </div>
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => window.history.back()}
        >
          {t("cancel")}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("savingChanges")}
            </>
          ) : (
            <>
              <span>💾</span>
              <span className="ml-2">{t("saveProfile")}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
