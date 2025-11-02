"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { updateProduct, type CreateProductData } from "@/lib/firebase-products";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters.")
    .max(100, "Product name must be at most 100 characters."),
  vendor: z
    .string()
    .min(2, "Vendor name must be at least 2 characters.")
    .max(50, "Vendor name must be at most 50 characters."),
  price: z
    .number()
    .min(0, "Price must be a positive number.")
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(500, "Description must be at most 500 characters."),
  category: z.string().min(1, "Please select a category."),
  stock: z
    .number()
    .int()
    .min(0, "Stock must be a positive number.")
    .or(z.string().regex(/^\d+$/, "Stock must be a whole number")),
  tag: z.string().optional(),
  image: z
    .any()
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "Max file size is 5MB."
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

interface Product {
  id: number | string | undefined;
  slug: string;
  name: string;
  vendor: string;
  price: number;
  reviews: number;
  rating: number;
  image: string;
  tag?: string;
  description?: string;
  category?: string;
  stock?: number;
}

interface UpdateProductFormProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateProductForm({
  product,
  isOpen,
  onClose,
}: UpdateProductFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    product.image || null
  );
  const [uploadedImageUrl, setUploadedImageUrl] = React.useState<string | null>(
    product.image || null
  );
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name || "",
      vendor: product.vendor || "",
      price: product.price || 0,
      description: product.description || "",
      category: product.category || "",
      stock: product.stock || 0,
      tag: product.tag || "",
    },
  });

  // Upload image to Cloudinary using secure server-side API
  const uploadToCloudinary = async (file: File): Promise<string> => {
    console.log("🔧 Starting upload:", {
      fileSize: file.size,
      fileName: file.name,
      fileType: file.type,
    });

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size must be less than 10MB");
    }

    const formData = new FormData();
    formData.append("file", file);

    console.log("📤 Uploading to server...");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Upload failed:", data);
        throw new Error(data.error || "Failed to upload image");
      }

      toast.success("Image uploaded successfully!");
      return data.url;
    } catch (error: unknown) {
      toast.error("Image upload failed. Please try again.");
      const message = error instanceof Error ? error.message : "Network error occurred";
      throw new Error(message);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Set the file in form
      form.setValue("image", file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setUploadedImageUrl(null);
    form.setValue("image", undefined);
    // Reset file input
    const fileInput = document.getElementById("image-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      let finalImageUrl = uploadedImageUrl;

      // If there's a new image file, upload it
      if (values.image && values.image instanceof File) {
        console.log("📸 New image detected, uploading...");
        finalImageUrl = await uploadToCloudinary(values.image);
        setUploadedImageUrl(finalImageUrl);
      }

      const productData: CreateProductData = {
        name: values.name,
        vendor: values.vendor,
        price: typeof values.price === "string" ? parseFloat(values.price) : values.price,
        description: values.description,
        category: values.category,
        stock: typeof values.stock === "string" ? parseInt(values.stock) : values.stock,
        tag: values.tag || undefined,
        image: finalImageUrl || "",
      };

      console.log("💾 Updating product:", productData);
      const updated: any = await updateProduct(product.id.toString(), productData);
      console.log(updated)
      toast.success("Product updated successfully!", {
        description: `${values.name} has been updated.`,
      });
      router.push('/products/' + updated.slug || product.slug);
      form.reset();
      setImagePreview(null);
      setUploadedImageUrl(null);
      
      
      onClose();
    } catch (error: unknown) {
      console.error("❌ Update error:", error);
      const message = error instanceof Error ? error.message : "Please try again later.";
      toast.error("Failed to update product", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>
            Update the product information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Enter product name"
              className={form.formState.errors.name ? "border-red-500" : ""}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Vendor */}
          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor</Label>
            <Input
              id="vendor"
              {...form.register("vendor")}
              placeholder="Enter vendor name"
              className={form.formState.errors.vendor ? "border-red-500" : ""}
            />
            {form.formState.errors.vendor && (
              <p className="text-sm text-red-500">
                {form.formState.errors.vendor.message}
              </p>
            )}
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (Rs)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...form.register("price", { valueAsNumber: true })}
                placeholder="0.00"
                className={form.formState.errors.price ? "border-red-500" : ""}
              />
              {form.formState.errors.price && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                {...form.register("stock", { valueAsNumber: true })}
                placeholder="0"
                className={form.formState.errors.stock ? "border-red-500" : ""}
              />
              {form.formState.errors.stock && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* Category and Tag */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.watch("category")}
                onValueChange={(value) => form.setValue("category", value)}
              >
                <SelectTrigger className={form.formState.errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fertilizers">Fertilizers</SelectItem>
                  <SelectItem value="seeds">Seeds</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="pesticides">Pesticides</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag (Optional)</Label>
              <Input
                id="tag"
                {...form.register("tag")}
                placeholder="e.g., New, Sale, Featured"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...form.register("description")}
              rows={4}
              placeholder="Enter product description"
              className={`w-full px-3 py-2 border rounded-md resize-none ${
                form.formState.errors.description ? "border-red-500" : "border-input"
              }`}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                    >
                      Choose Image
                    </label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              )}
            </div>
            {form.formState.errors.image && (
              <p className="text-sm text-red-500">
                {form.formState.errors.image.message as string}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}