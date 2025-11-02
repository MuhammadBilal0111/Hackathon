"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import { deleteProduct } from "@/lib/firebase-products";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Product {
  id: number;
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

interface DeleteProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteProductModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: DeleteProductModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      console.log("🗑️ Deleting product:", product.id);
      await deleteProduct(product.id.toString());

      toast.success("Product deleted successfully!", {
        description: `${product.name} has been removed from your inventory.`,
      });

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: unknown) {
      console.error("❌ Delete error:", error);
      const message = error instanceof Error ? error.message : "Please try again later.";
      toast.error("Failed to delete product", {
        description: message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription className="mt-1">
                Are you sure you want to delete this product? This action cannot be undone.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
            <p className="text-sm text-gray-600 mb-2">Vendor: {product.vendor}</p>
            <p className="text-sm font-medium text-gray-900">Price: Rs {product.price}</p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Product"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}