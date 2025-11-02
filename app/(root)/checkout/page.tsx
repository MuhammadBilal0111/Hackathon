"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  Truck,
  CreditCard,
  Download,
  MapPin,
  Phone,
  Mail,
  Lock,
  Shield,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { pdf } from "@react-pdf/renderer";
import { InvoiceDocument, generateInvoiceData } from "@/lib/pdf-invoice";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [step, setStep] = useState("cart");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    paymentMethod: "card",
  });

  const cartItems = [
    {
      id: 1,
      name: "Organic Tomatoes",
      vendor: "Fresh Farm Co.",
      price: 120,
      qty: 5,
      total: 600,
      image: "/organic-red-tomatoes-farm-fresh.jpg",
    },
    {
      id: 2,
      name: "Fresh Spinach",
      vendor: "Organic Harvest",
      price: 60,
      qty: 3,
      total: 180,
      image: "/green-fresh-spinach-leafy-greens.jpg",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = subtotal >= 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    // Generate unique order ID
    const newOrderId = `ORD-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 900000 + 100000
    )}`;
    setOrderId(newOrderId);
    setOrderPlaced(true);
    setStep("confirmation");
  };

  const handleDownloadInvoice = async () => {
    try {
      setIsDownloading(true);
      toast.info("Generating your invoice...");

      // Generate invoice data
      const invoiceData = generateInvoiceData(
        orderId,
        formData,
        cartItems,
        subtotal,
        shipping,
        tax,
        total
      );

      // Create PDF
      const doc = <InvoiceDocument data={invoiceData} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download invoice. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getStepIndex = (stepName: string) => {
    const steps = ["cart", "shipping", "payment", "confirmation"];
    return steps.indexOf(stepName);
  };

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between">
            {["cart", "shipping", "payment"].map((s, i) => {
              const isActive = step === s;
              const isCompleted = getStepIndex(s) < getStepIndex(step);
              return (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? "✓" : i + 1}
                  </div>
                  <div className="text-center text-xs font-semibold ml-2">
                    {s === "cart" && "Cart"}
                    {s === "shipping" && "Shipping"}
                    {s === "payment" && "Payment"}
                  </div>
                  {i < 2 && (
                    <div
                      className={`flex-1 h-1 mx-3 transition-colors ${
                        isCompleted ? "bg-green-500" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {step === "confirmation" && orderPlaced ? (
          <div className="max-w-2xl mx-auto">
            <Card className="p-12 text-center bg-green-50 border-l-4 border-l-green-500">
              <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
              <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-muted-foreground mb-2">
                Thank you for your order, {formData.fullName}!
              </p>
              <p className="text-2xl font-bold text-primary mb-6">
                Order ID: {orderId}
              </p>

              <div className="bg-white p-6 rounded-lg mb-6 text-left border border-border">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Customer Name
                    </p>
                    <p className="font-semibold">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-semibold">{formData.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-semibold">{formData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Payment Method
                    </p>
                    <p className="font-semibold capitalize">
                      {formData.paymentMethod === "card"
                        ? "Credit/Debit Card"
                        : formData.paymentMethod === "upi"
                        ? "UPI"
                        : "Net Banking"}
                    </p>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    Delivery Address
                  </p>
                  <p className="font-semibold">
                    {formData.address}, {formData.city}, {formData.state} -{" "}
                    {formData.postalCode}
                  </p>
                </div>
                <hr className="my-4" />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Order Total
                    </p>
                    <p className="font-bold text-lg text-primary">Rs {total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Order Date
                    </p>
                    <p className="font-semibold">
                      {new Date().toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <hr className="my-4" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Estimated Delivery
                  </p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    Tomorrow by 5 PM
                  </p>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="bg-white p-6 rounded-lg mb-6 text-left border border-border">
                <h3 className="font-bold text-lg mb-4">Order Items</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.vendor}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.qty}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold">Rs {item.total}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t-2 border-border">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Subtotal</span>
                    <span>Rs {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Shipping</span>
                    <span
                      className={
                        shipping === 0 ? "text-green-600 font-semibold" : ""
                      }
                    >
                      {shipping === 0 ? "FREE" : `Rs ${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span>Tax (5%)</span>
                    <span>Rs {tax}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">Rs {total}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                  onClick={handleDownloadInvoice}
                  disabled={isDownloading}
                >
                  <Download className="w-4 h-4" />
                  {isDownloading ? "Generating Invoice..." : "Download Invoice"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  Track Order
                </Button>
              </div>

              <Link href="/">
                <Button variant="ghost" size="lg">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Cart Step */}
              {step === "cart" && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 border-b border-border pb-4"
                      >
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.vendor}
                          </p>
                          <p className="text-sm mt-1">
                            Rs {item.price} × {item.qty} ={" "}
                            <span className="font-semibold">Rs {item.total}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => setStep("shipping")}
                  >
                    Continue to Shipping
                  </Button>
                </Card>
              )}

              {/* Shipping Step */}
              {step === "shipping" && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    Shipping Address
                  </h2>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        name="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          Email
                        </label>
                        <Input
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          Phone
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          placeholder="+91 9876543210"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Street Address
                      </label>
                      <Input
                        type="text"
                        name="address"
                        placeholder="123 Main Street"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          City
                        </label>
                        <Input
                          type="text"
                          name="city"
                          placeholder="Mumbai"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          State
                        </label>
                        <Input
                          type="text"
                          name="state"
                          placeholder="Maharashtra"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Postal Code
                        </label>
                        <Input
                          type="text"
                          name="postalCode"
                          placeholder="400001"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setStep("cart")}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => setStep("payment")}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </Card>
              )}

              {/* Payment Step */}
              {step === "payment" && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    Payment Method
                  </h2>

                  <div className="space-y-3 mb-6">
                    {[
                      { id: "card", label: "Credit/Debit Card", icon: "💳" },
                      { id: "upi", label: "UPI", icon: "📱" },
                      { id: "netbanking", label: "Net Banking", icon: "🏦" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === method.id
                            ? "border-primary bg-primary bg-opacity-5"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                        <span className="ml-3 text-lg">{method.icon}</span>
                        <span className="ml-3 font-semibold">
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Card Details */}
                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4 mb-6 p-6 bg-muted rounded-lg">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Card Number
                        </label>
                        <Input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Expiry (MM/YY)
                          </label>
                          <Input
                            type="text"
                            placeholder="12/25"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            CVV
                          </label>
                          <Input type="text" placeholder="123" maxLength={3} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UPI Details */}
                  {formData.paymentMethod === "upi" && (
                    <div className="mb-6 p-6 bg-muted rounded-lg">
                      <label className="block text-sm font-semibold mb-2">
                        UPI ID
                      </label>
                      <Input type="text" placeholder="yourname@upi" />
                    </div>
                  )}

                  {/* Security Info */}
                  <div className="mb-6 flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900">
                        Your payment is secure
                      </p>
                      <p className="text-blue-800">
                        All transactions are encrypted and secured with SSL
                        technology.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setStep("shipping")}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                      onClick={handlePlaceOrder}
                    >
                      <Lock className="w-4 h-4" />
                      Place Order Securely
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <Card className="p-6 sticky top-24 bg-secondary">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order Summary
                </h3>

                {/* Items List */}
                <div className="space-y-3 mb-4 pb-4 border-b border-border max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} <br />
                        <span className="text-xs text-muted-foreground">
                          × {item.qty}
                        </span>
                      </span>
                      <span className="font-semibold">Rs {item.total}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>Rs {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span
                      className={
                        shipping === 0 ? "text-green-600 font-semibold" : ""
                      }
                    >
                      {shipping === 0 ? "FREE" : `Rs ${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (5%)</span>
                    <span>Rs {tax}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary text-xl">Rs {total}</span>
                </div>

                {shipping === 0 && (
                  <div className="text-xs text-green-600 mt-3 bg-green-50 p-3 rounded border border-green-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Free shipping on orders above Rs 500</span>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
