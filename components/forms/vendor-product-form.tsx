"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Upload, X, Loader2 } from "lucide-react";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  type CreateProductData,
} from "@/lib/firebase-products";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface VendorProductFormProps {
  mode: "create" | "edit" | "delete";
  productId?: string;
  initialData?: {
    name: string;
    vendor: string;
    price: number;
    description: string;
    category: string;
    stock: number;
    tag?: string;
    image?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function VendorProductForm({
  mode = "create",
  productId,
  initialData,
  onSuccess,
  onCancel,
}: VendorProductFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    initialData?.image || null
  );
  const [uploadedImageUrl, setUploadedImageUrl] = React.useState<string | null>(
    initialData?.image || null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      vendor: initialData?.vendor || "",
      price: initialData?.price || 0,
      description: initialData?.description || "",
      category: initialData?.category || "",
      stock: initialData?.stock || 0,
      tag: initialData?.tag || "",
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

      console.log("📥 Upload response:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (!response.ok) {
        console.error("❌ Upload API error:", data);
        throw new Error(data.message || data.error || "Upload failed");
      }

      if (!data.url) {
        throw new Error("No URL returned from upload");
      }

      console.log("✅ Upload successful:", data.url);
      return data.url;
    } catch (error: any) {
      console.error("💥 Upload error:", error);
      throw new Error(
        error.message || "Failed to upload image. Please try again."
      );
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Set file in form
      form.setValue("image", file);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setUploadedImageUrl(null);
    form.setValue("image", undefined);
  };

  // Create product helper
  async function handleCreateProduct(data: z.infer<typeof formSchema>) {
    try {
      // Upload image if exists
      let imageUrl = uploadedImageUrl || "";
      if (data.image && data.image instanceof File) {
        imageUrl = await uploadToCloudinary(data.image);
      }

      const productData: CreateProductData = {
        name: data.name,
        vendor: data.vendor,
        price:
          typeof data.price === "string" ? parseFloat(data.price) : data.price,
        description: data.description,
        category: data.category,
        stock:
          typeof data.stock === "string" ? parseInt(data.stock) : data.stock,
        tag: data.tag || undefined,
        image: imageUrl,
      };

      console.log("📝 Product data being sent:", productData);
      console.log("📄 Description length:", productData.description.length);

      await createProduct(productData);

      toast.success("Product created successfully!", {
        description: `${data.name} has been added to your inventory.`,
        position: "bottom-right",
      });
    } catch (error: any) {
      console.error("Error creating product:", error);
      throw new Error(error.message || "Failed to create product");
    }
  }

  // Update product helper
  async function handleUpdateProduct(data: z.infer<typeof formSchema>) {
    if (!productId) {
      throw new Error("Product ID is required for update");
    }

    try {
      // Upload new image if changed
      let imageUrl = uploadedImageUrl;
      if (data.image && data.image instanceof File) {
        imageUrl = await uploadToCloudinary(data.image);
      }

      const updates: Partial<CreateProductData> = {
        name: data.name,
        vendor: data.vendor,
        price:
          typeof data.price === "string" ? parseFloat(data.price) : data.price,
        description: data.description,
        category: data.category,
        stock:
          typeof data.stock === "string" ? parseInt(data.stock) : data.stock,
        tag: data.tag || undefined,
        image: imageUrl || undefined,
      };

      await updateProduct(productId, updates);

      toast.success("Product updated successfully!", {
        description: `${data.name} has been updated.`,
        position: "bottom-right",
      });
    } catch (error: any) {
      console.error("Error updating product:", error);
      throw new Error(error.message || "Failed to update product");
    }
  }

  // Delete product helper
  async function handleDeleteProduct() {
    if (!productId) {
      throw new Error("Product ID is required for deletion");
    }

    try {
      await deleteProduct(productId);

      toast.success("Product deleted successfully!", {
        description: "The product has been removed from your inventory.",
        position: "bottom-right",
      });
    } catch (error: any) {
      console.error("Error deleting product:", error);
      throw new Error(error.message || "Failed to delete product");
    }
  }

  // Form submission
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        await handleCreateProduct(data);
      } else if (mode === "edit") {
        await handleUpdateProduct(data);
      }

      form.reset();
      setImagePreview(null);
      setUploadedImageUrl(null);
      onSuccess?.();
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Something went wrong. Please try again.",
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle delete
  async function handleDelete() {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await handleDeleteProduct();
      onSuccess?.();
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to delete product.",
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (mode === "delete") {
    return (
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Delete Product</CardTitle>
          <CardDescription>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {initialData && (
            <div className="space-y-2">
              <p className="font-semibold">{initialData.name}</p>
              <p className="text-sm text-muted-foreground">
                Vendor: {initialData.vendor}
              </p>
              <p className="text-sm text-muted-foreground">
                Price: Rs {initialData.price}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Product"
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Add New Product" : "Edit Product"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Fill in the details to add a new product to your inventory."
            : "Update the product information below."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="vendor-product-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Product Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="flex items-start gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Max file size: 5MB. Supported formats: JPG, PNG, WEBP
                  </p>
                  {form.formState.errors.image && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.image.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Product Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    {...field}
                    id="name"
                    placeholder="e.g., Organic Wheat Seeds Premium Quality"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <p className="text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Vendor Name */}
            <Controller
              name="vendor"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="vendor">
                    Vendor Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    {...field}
                    id="vendor"
                    placeholder="e.g., AgriSupply Co."
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <p className="text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price (Rs) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...field}
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="999.99"
                      aria-invalid={fieldState.invalid}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="stock"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label htmlFor="stock">
                      Stock Quantity <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...field}
                      id="stock"
                      type="number"
                      placeholder="100"
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Category */}
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="category"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seeds">Seeds</SelectItem>
                      <SelectItem value="fertilizers">Fertilizers</SelectItem>
                      <SelectItem value="pesticides">Pesticides</SelectItem>
                      <SelectItem value="tools">Tools & Equipment</SelectItem>
                      <SelectItem value="irrigation">Irrigation</SelectItem>
                      <SelectItem value="organic">Organic Products</SelectItem>
                      <SelectItem value="machinery">Machinery</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Tag (Optional) */}
            <Controller
              name="tag"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="tag">Tag (Optional)</Label>
                  <Input
                    {...field}
                    id="tag"
                    placeholder="e.g., NEW, SALE, FEATURED"
                    aria-invalid={fieldState.invalid}
                  />
                  <p className="text-xs text-muted-foreground">
                    Add a special tag to highlight this product
                  </p>
                  {fieldState.error && (
                    <p className="text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <textarea
                    {...field}
                    id="description"
                    rows={6}
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder="Provide a detailed description of the product, including its features, benefits, and usage instructions..."
                    aria-invalid={fieldState.invalid}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      {(field.value || "").length}/500 characters
                    </p>
                  </div>
                  {fieldState.error && (
                    <p className="text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset();
            setImagePreview(null);
            setUploadedImageUrl(null);
            onCancel?.();
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="vendor-product-form"
          disabled={isSubmitting}
          className="bg-green-primary hover:bg-green-primary-hover text-green-primary-foreground"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : mode === "create" ? (
            "Create Product"
          ) : (
            "Update Product"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
