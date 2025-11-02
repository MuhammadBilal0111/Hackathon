"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VendorProductForm } from "@/components/forms/vendor-product-form";
import {
  getAllProducts,
  getProductsByVendor,
  getVendorStatistics,
  type Product,
} from "@/lib/firebase-products";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  ShoppingBag,
  Users,
  IndianRupee,
  Package,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const salesData = [
  { month: "Jan", sales: 4000, orders: 24, returns: 2 },
  { month: "Feb", sales: 3000, orders: 13, returns: 1 },
  { month: "Mar", sales: 2000, orders: 9, returns: 0 },
  { month: "Apr", sales: 2780, orders: 39, returns: 2 },
  { month: "May", sales: 1890, orders: 22, returns: 1 },
  { month: "Jun", sales: 2390, orders: 23, returns: 1 },
  { month: "Jul", sales: 3490, orders: 45, returns: 2 },
  { month: "Aug", sales: 4200, orders: 52, returns: 1 },
];

const vendorProducts = [
  {
    id: 1,
    name: "Organic Tomatoes",
    sku: "SKU001",
    price: 120,
    stock: 450,
    sales: 234,
    rating: 4.8,
    status: "Active",
  },
  {
    id: 2,
    name: "Fresh Spinach",
    sku: "SKU002",
    price: 60,
    stock: 120,
    sales: 156,
    rating: 4.7,
    status: "Active",
  },
  {
    id: 3,
    name: "Local Carrots",
    sku: "SKU003",
    price: 80,
    stock: 0,
    sales: 189,
    rating: 4.9,
    status: "Out of Stock",
  },
  {
    id: 4,
    name: "Organic Broccoli",
    sku: "SKU004",
    price: 90,
    stock: 200,
    sales: 98,
    rating: 4.7,
    status: "Active",
  },
  {
    id: 5,
    name: "Fresh Cilantro",
    sku: "SKU005",
    price: 40,
    stock: 300,
    sales: 189,
    rating: 4.8,
    status: "Active",
  },
];

const recentOrders = [
  {
    id: "ORD001",
    customer: "Raj Kumar",
    product: "Organic Tomatoes",
    qty: 5,
    amount: 600,
    status: "Shipped",
    date: "2024-11-01",
  },
  {
    id: "ORD002",
    customer: "Priya Singh",
    product: "Fresh Spinach",
    qty: 3,
    amount: 180,
    status: "Processing",
    date: "2024-11-02",
  },
  {
    id: "ORD003",
    customer: "Amit Patel",
    product: "Local Carrots",
    qty: 10,
    amount: 800,
    status: "Delivered",
    date: "2024-10-31",
  },
  {
    id: "ORD004",
    customer: "Meera Desai",
    product: "Organic Broccoli",
    qty: 4,
    amount: 360,
    status: "Delivered",
    date: "2024-10-30",
  },
  {
    id: "ORD005",
    customer: "Vikram Singh",
    product: "Fresh Cilantro",
    qty: 2,
    amount: 80,
    status: "Shipped",
    date: "2024-11-02",
  },
];

const categoryData = [
  { name: "Vegetables", value: 35, fill: "hsl(var(--color-primary))" },
  { name: "Fruits", value: 25, fill: "hsl(var(--color-accent))" },
  { name: "Dairy", value: 20, fill: "hsl(var(--color-secondary))" },
  { name: "Herbs", value: 15, fill: "hsl(var(--color-chart-5))" },
  { name: "Others", value: 5, fill: "hsl(var(--color-muted))" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Shipped":
      return "bg-green-50 text-green-600";
    case "Processing":
      return "bg-yellow-100 text-yellow-700";
    case "Active":
      return "bg-green-100 text-green-700";
    case "Out of Stock":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit" | "delete">(
    "create"
  );
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);

  // Vendor name - In production, get this from auth context
  const vendorName = "Fresh Farm Co.";

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
    fetchStatistics();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Get all products - in production, filter by authenticated vendor
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await getVendorStatistics(vendorName);
      setStatistics(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
    // Refetch products after create/update/delete
    fetchProducts();
    fetchStatistics();
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

  // Get product status
  const getProductStatus = (stock: number): string => {
    return stock === 0 ? "Out of Stock" : "Active";
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <p className="text-muted-foreground">Welcome, Fresh Farm Co.</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-3xl font-bold">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    statistics?.totalProducts || 0
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-semibold">
                  In your inventory
                </p>
              </div>
              <Package className="w-12 h-12 text-green-primary opacity-10" />
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-green-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Products</p>
                <p className="text-3xl font-bold">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    statistics?.activeProducts || 0
                  )}
                </p>
                <p className="text-xs text-green-600 mt-2 font-semibold">
                  In stock
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-accent opacity-10" />
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-secondary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-3xl font-bold">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    statistics?.outOfStockProducts || 0
                  )}
                </p>
                <p className="text-xs text-orange-600 mt-2 font-semibold">
                  Need restock
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-secondary opacity-10" />
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
                    `Rs ${Math.round(statistics?.averagePrice || 0)}`
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-semibold">
                  Per product
                </p>
              </div>
              <IndianRupee className="w-12 h-12 text-chart-3 opacity-10" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Sales Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--color-border))"
                    />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="hsl(var(--color-primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Monthly Orders
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--color-border))"
                    />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="hsl(var(--color-primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Stock Alerts */}
            {!isLoading && products.filter((p) => p.stock === 0).length > 0 && (
              <Card className="p-6 bg-yellow-50 border-l-4 border-l-yellow-400">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-900">
                      Stock Alert
                    </h3>
                    <div className="space-y-1 mt-2">
                      {products
                        .filter((p) => p.stock === 0)
                        .slice(0, 3)
                        .map((product) => (
                          <p
                            key={product.id}
                            className="text-sm text-yellow-800"
                          >
                            • {product.name} is out of stock. Reorder soon.
                          </p>
                        ))}
                      {products.filter((p) => p.stock === 0).length > 3 && (
                        <p className="text-sm text-yellow-800 font-semibold">
                          + {products.filter((p) => p.stock === 0).length - 3}{" "}
                          more products out of stock
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Recent Orders
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.slice(0, 3).map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-border hover:bg-muted transition-colors"
                      >
                        <td className="py-3 px-4 font-semibold text-green-primary">
                          {order.id}
                        </td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {order.product}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          Rs {order.amount}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="p-6">
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
                  <h3 className="text-lg font-semibold mb-2">
                    No products yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start by adding your first product
                  </p>
                  <Button onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">
                          Image
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Product Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Category
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Price
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Stock
                        </th>
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
                              {product.rating > 0
                                ? `${product.rating}★`
                                : "N/A"}
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
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Quantity
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-border hover:bg-muted transition-colors"
                      >
                        <td className="py-3 px-4 font-semibold text-green-primary">
                          {order.id}
                        </td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {order.product}
                        </td>
                        <td className="py-3 px-4">{order.qty} units</td>
                        <td className="py-3 px-4 font-semibold">
                          Rs {order.amount}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">
                          {order.date}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs bg-transparent"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-bold mb-4">Sales by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} (${value}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-4">Sales vs Returns</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--color-border))"
                    />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="sales"
                      fill="hsl(var(--color-primary))"
                      name="Sales (Rs )"
                    />
                    <Bar
                      dataKey="returns"
                      fill="hsl(var(--color-destructive))"
                      name="Returns"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Quarterly Sales Analysis</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--color-border))"
                  />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--color-primary))"
                    strokeWidth={2}
                    name="Sales (Rs )"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--color-accent))"
                    strokeWidth={2}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
