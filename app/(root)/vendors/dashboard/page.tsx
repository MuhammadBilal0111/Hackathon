"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VendorProductForm } from "@/components/forms/vendor-product-form";
import { getProductsByVendorUid, type Product } from "@/lib/firebase-products";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";
    case "Out of Stock":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function VendorDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit" | "delete">(
    "create"
  );
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorName, setVendorName] = useState<string>("Vendor");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const userData = localStorage.getItem("user");
      console.log("📋 User data from localStorage:", userData);

      if (!userData) {
        console.error("❌ User not authenticated");
        setProducts([]);
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const vendorUid = parsedUserData.uid;
      const email = parsedUserData.email || "Vendor";

      console.log("👤 Parsed vendor UID:", vendorUid);
      console.log("📧 Vendor email:", email);

      if (!vendorUid) {
        console.error("❌ Vendor UID not found in localStorage");
        setProducts([]);
        return;
      }

      setVendorName(email);

      console.log("🔍 Fetching products for vendor UID:", vendorUid);
      const fetchedProducts = await getProductsByVendorUid(vendorUid);

      console.log("📦 Fetched products:", fetchedProducts);
      console.log(`✅ Successfully fetched ${fetchedProducts.length} products`);

      setProducts(fetchedProducts);
    } catch (error: any) {
      console.error("❌ Error fetching products:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  const openCreateDialog = () => {
    setFormMode("create");
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setFormMode("edit");
    setSelectedProduct({
      id: product.id,
      name: product.name,
      vendor: product.vendor,
      price: product.price,
      description: product.description,
      category: product.category,
      stock: product.stock,
      tag: product.tag,
      image: product.image,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setFormMode("delete");
    setSelectedProduct({
      id: product.id,
      name: product.name,
      vendor: product.vendor,
      price: product.price,
    });
    setIsDialogOpen(true);
  };

  const getProductStatus = (stock: number): string => {
    return stock === 0 ? "Out of Stock" : "Active";
  };

  // Calculate statistics
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.stock > 0).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;
  const averagePrice =
    products.length > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length
      : 0;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {vendorName}</p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="bg-green-primary hover:bg-green-primary-hover text-green-primary-foreground flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </div>

        {/* Product Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTitle>{formMode === "create" ? "Add New Product" : "Edit Product"}</DialogTitle>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <VendorProductForm
              mode={formMode}
              productId={selectedProduct?.id}
              initialData={selectedProduct}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-3xl font-bold">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    totalProducts
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-semibold">
                  In your inventory
                </p>
              </div>
              <Package className="w-12 h-12 text-green-primary opacity-10" />
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-chart-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Price</p>
                <p className="text-3xl font-bold">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    `Rs ${Math.round(averagePrice)}`
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-semibold">
                  Per product
                </p>
              </div>
              <Package className="w-12 h-12 text-chart-3 opacity-10" />
            </div>
          </Card>
        </div>

        {/* Stock Alert */}
        {!isLoading && outOfStockProducts > 0 && (
          <Card className="p-6 bg-yellow-50 border-l-4 border-l-yellow-400 mb-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900">Stock Alert</h3>
                <div className="space-y-1 mt-2">
                  {products
                    .filter((p) => p.stock === 0)
                    .slice(0, 3)
                    .map((product) => (
                      <p key={product.id} className="text-sm text-yellow-800">
                        • {product.name} is out of stock. Reorder soon.
                      </p>
                    ))}
                  {outOfStockProducts > 3 && (
                    <p className="text-sm text-yellow-800 font-semibold">
                      + {outOfStockProducts - 3} more products out of stock
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Products Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">My Products</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-primary" />
              <span className="ml-3 text-muted-foreground">
                Loading products...
              </span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first product
              </p>
              <Button
                onClick={openCreateDialog}
                className="bg-green-primary hover:bg-green-primary-hover"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Image</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Product Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 font-semibold">Stock</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Rating
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border hover:bg-muted transition-colors"
                    >
                      <td className="py-3 px-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          {product.tag && (
                            <span className="text-xs text-accent font-semibold">
                              {product.tag}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground capitalize">
                        {product.category}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        Rs {product.price}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={
                            product.stock === 0
                              ? "text-destructive font-semibold"
                              : product.stock < 10
                              ? "text-orange-600 font-semibold"
                              : ""
                          }
                        >
                          {product.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold">
                          {product.rating > 0 ? `${product.rating}★` : "N/A"}
                        </span>
                        {product.reviews > 0 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({product.reviews})
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            getProductStatus(product.stock)
                          )}`}
                        >
                          {getProductStatus(product.stock)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-muted"
                            onClick={() => openEditDialog(product)}
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-muted hover:text-destructive"
                            onClick={() => openDeleteDialog(product)}
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
