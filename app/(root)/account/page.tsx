"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  MapPin,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Edit2,
  Trash2,
  Plus,
  Truck,
  Calendar,
  AlertCircle,
  Bell,
  Lock,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Raj",
    lastName: "Kumar",
    email: "raj@example.com",
    phone: "+91 98765 43210",
  });

  const orders = [
    {
      id: "ORD001",
      date: "2024-11-01",
      items: "Organic Tomatoes, Fresh Spinach",
      amount: "Rs 780",
      status: "Delivered",
      tracking: "Delivered on Nov 2",
    },
    {
      id: "ORD002",
      date: "2024-10-28",
      items: "Local Carrots",
      amount: "Rs 800",
      status: "Delivered",
      tracking: "Delivered on Oct 29",
    },
    {
      id: "ORD003",
      date: "2024-10-25",
      items: "Premium Milk",
      amount: "Rs 450",
      status: "Delivered",
      tracking: "Delivered on Oct 26",
    },
    {
      id: "ORD004",
      date: "2024-10-22",
      items: "Greek Yogurt",
      amount: "Rs 560",
      status: "Delivered",
      tracking: "Delivered on Oct 23",
    },
  ];

  const wishlist = [
    {
      id: 1,
      name: "Organic Tomatoes",
      vendor: "Fresh Farm Co.",
      price: "Rs 120",
      image: "/organic-red-tomatoes-farm-fresh.jpg",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Pure Honey",
      vendor: "Bee Garden",
      price: "Rs 250",
      image: "/pure-honey-jar-organic.jpg",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Red Apples",
      vendor: "Orchard Fresh",
      price: "Rs 150",
      image: "/red-fresh-apples-fruit.jpg",
      rating: 4.6,
    },
  ];

  const addresses = [
    {
      id: 1,
      type: "Home",
      address: "123 Main Street, Mumbai 400001",
      phone: "9876543210",
      default: true,
    },
    {
      id: 2,
      type: "Office",
      address: "456 Business Park, Mumbai 400002",
      phone: "9876543211",
      default: false,
    },
  ];

  const getStatusColor = (status: string) => {
    return status === "Delivered"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";
  };

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Profile Card */}
        <div className="mb-8">
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-l-4 border-l-primary">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                {profileData.firstName.charAt(0)}
                {profileData.lastName.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-muted-foreground">{profileData.email}</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-muted w-full flex flex-wrap justify-start">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-8">
              <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    {isEditingProfile ? "Cancel" : "Edit"}
                  </Button>
                </div>

                {isEditingProfile ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          First Name
                        </label>
                        <Input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Last Name
                        </label>
                        <Input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={profileData.email}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setIsEditingProfile(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 bg-muted p-6 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          First Name
                        </p>
                        <p className="font-semibold">{profileData.firstName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Last Name
                        </p>
                        <p className="font-semibold">{profileData.lastName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Email
                      </p>
                      <p className="font-semibold">{profileData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Phone Number
                      </p>
                      <p className="font-semibold">{profileData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Member Since
                      </p>
                      <p className="font-semibold">January 2024</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <Card
                    key={order.id}
                    className="p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{order.id}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {order.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {order.items}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {order.tracking}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {order.amount}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Link href="/products">
                    <Button className="bg-primary hover:bg-primary/90">
                      Start Shopping
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="space-y-4">
              {addresses.map((addr) => (
                <Card
                  key={addr.id}
                  className="p-6 hover:shadow-md transition-shadow border-l-4 border-l-primary"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{addr.type}</h3>
                        {addr.default && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Address
                          </p>
                          <p className="font-semibold">{addr.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Phone
                          </p>
                          <p className="font-semibold">{addr.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 bg-transparent"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </Button>
            </div>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-40 object-cover"
                      />
                      <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:shadow-md transition-shadow">
                        <Heart className="w-5 h-5 fill-destructive text-destructive" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.vendor}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-semibold">
                          {item.rating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {item.price}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90 mt-3 flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">
                  No items in your wishlist
                </p>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90">
                    Browse Products
                  </Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* Notification Settings */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Email Notifications
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <div>
                      <p className="font-semibold">Order Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about your order status
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <div>
                      <p className="font-semibold">New Product Launches</p>
                      <p className="text-sm text-muted-foreground">
                        Be the first to know about new products
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                    <input type="checkbox" className="w-4 h-4" />
                    <div>
                      <p className="font-semibold">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional offers and deals
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <div>
                      <p className="font-semibold">Product Recommendations</p>
                      <p className="text-sm text-muted-foreground">
                        Personalized product suggestions
                      </p>
                    </div>
                  </label>
                </div>
              </Card>

              {/* Security Settings */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full flex items-center justify-between bg-transparent"
                  >
                    <span>Change Password</span>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full flex items-center justify-between bg-transparent"
                  >
                    <span>Two-Factor Authentication</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      Disabled
                    </span>
                  </Button>
                </div>
              </Card>

              {/* Danger Zone */}
              <Card className="p-6 border-l-4 border-l-destructive bg-destructive/5">
                <h3 className="font-bold text-lg mb-4 text-destructive flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Danger Zone
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These actions are permanent and cannot be undone.
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                  >
                    Delete Account
                  </Button>
                </div>
              </Card>

              {/* Logout */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Logout</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign out from this device
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
