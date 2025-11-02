"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Camera,
  CloudSun,
  Calendar,
  Globe,
  Sprout,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Leaf,
} from "lucide-react";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const content = {
    en: {
      hero: {
        title: "Smart Farming Solutions",
        subtitle: "For Modern Agriculture",
        description:
          "Empower your farming with AI-powered crop analysis, weather insights, and personalized agricultural planning. Join thousands of farmers who trust our technology.",
        cta: "Get Started Today",
        watchDemo: "Watch Demo",
      },
      features: {
        title: "Everything You Need for Smart Farming",
        subtitle: "Advanced tools designed specifically for Pakistani farmers",
        items: [
          {
            icon: Camera,
            title: "AI Crop Analysis",
            description:
              "Upload crop photos for instant disease detection and pest control recommendations",
          },
          {
            icon: CloudSun,
            title: "Weather Intelligence",
            description:
              "Location-based weather patterns and climate change adaptation strategies",
          },
          {
            icon: Calendar,
            title: "Annual Planning",
            description:
              "Comprehensive yearly crop planning based on your location and soil conditions",
          },
          {
            icon: Globe,
            title: "Bilingual Support",
            description:
              "Available in English and Urdu for better accessibility",
          },
        ],
      },
      stats: {
        farmers: "10,000+",
        farmersLabel: "Active Farmers",
        accuracy: "95%",
        accuracyLabel: "Detection Accuracy",
        coverage: "50+",
        coverageLabel: "Districts Covered",
      },
    },
    ur: {
      hero: {
        title: "ذہین کاشتکاری کے حل",
        subtitle: "جدید زراعت کے لیے",
        description:
          "AI کی مدد سے فصلوں کا تجزیہ، موسمی بصیرت، اور ذاتی زرعی منصوبہ بندی کے ساتھ اپنی کاشتکاری کو بہتر بنائیں۔",
        cta: "آج ہی شروع کریں",
        watchDemo: "ڈیمو دیکھیں",
      },
      features: {
        title: "ذہین کاشتکاری کے لیے ہر ضرورت",
        subtitle:
          "پاکستانی کسانوں کے لیے خصوصی طور پر ڈیزائن کیے گئے جدید ٹولز",
        items: [
          {
            icon: Camera,
            title: "AI فصل تجزیہ",
            description:
              "فصل کی تصاویر اپ لوڈ کریں اور فوری بیماری کی تشخیص اور کیڑے کنٹرول کی سفارشات حاصل کریں",
          },
          {
            icon: CloudSun,
            title: "موسمی ذہانت",
            description:
              "مقام پر مبنی موسمی پیٹرن اور آب و ہوا کی تبدیلی کے لیے حکمت عملی",
          },
          {
            icon: Calendar,
            title: "سالانہ منصوبہ بندی",
            description:
              "آپ کے مقام اور مٹی کی حالت کی بنیاد پر مکمل سالانہ فصل کی منصوبہ بندی",
          },
          {
            icon: Globe,
            title: "دو لسانی سپورٹ",
            description: "بہتر رسائی کے لیے انگریزی اور اردو میں دستیاب",
          },
        ],
      },
      stats: {
        farmers: "10,000+",
        farmersLabel: "فعال کسان",
        accuracy: "95%",
        accuracyLabel: "تشخیص کی درستگی",
        coverage: "50+",
        coverageLabel: "اضلاع کا احاطہ",
      },
    },
  };

  const currentContent = content[selectedLanguage as keyof typeof content];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50">
      {/* Header */}
      <header className="border-b border-green-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-lime-500 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-lime-600 bg-clip-text text-transparent">
                Smart Kisaan
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Contact
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedLanguage("en")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    selectedLanguage === "en"
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-gray-600 hover:text-green-600"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setSelectedLanguage("ur")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    selectedLanguage === "ur"
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-gray-600 hover:text-green-600"
                  }`}
                >
                  اردو
                </button>
              </div>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  Login
                </Button>
              </Link>
              <Button className="bg-gradient-to-r from-green-600 to-lime-500 hover:from-green-700 hover:to-lime-600">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-8 ${
                selectedLanguage === "ur" ? "text-right" : ""
              }`}
            >
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full text-green-700">
                  <Sprout className="w-5 h-5" />
                  <span className="font-medium">
                    Pakistan&apos;s #1 Farm Tech Platform
                  </span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {currentContent.hero.title}
                  <br />
                  <span className="bg-gradient-to-r from-green-600 to-lime-500 bg-clip-text text-transparent">
                    {currentContent.hero.subtitle}
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  {currentContent.hero.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-lime-500 hover:from-green-700 hover:to-lime-600 text-white px-8 py-4 text-lg group"
                >
                  {currentContent.hero.cta}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4 text-lg"
                >
                  {currentContent.hero.watchDemo}
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {currentContent.stats.farmers}
                  </div>
                  <div className="text-gray-600">
                    {currentContent.stats.farmersLabel}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-lime-600">
                    {currentContent.stats.accuracy}
                  </div>
                  <div className="text-gray-600">
                    {currentContent.stats.accuracyLabel}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {currentContent.stats.coverage}
                  </div>
                  <div className="text-gray-600">
                    {currentContent.stats.coverageLabel}
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-green-100 to-lime-100 rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Camera className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-green-900">
                            Crop Analysis
                          </div>
                          <div className="text-sm text-green-600">
                            AI Powered
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-lime-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
                          <CloudSun className="w-6 h-6 text-lime-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-lime-900">
                            Weather Insights
                          </div>
                          <div className="text-sm text-lime-600">
                            Real-time Data
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-yellow-900">
                            Annual Planning
                          </div>
                          <div className="text-sm text-yellow-600">
                            Customized
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Globe className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-green-900">
                            Multi-Language
                          </div>
                          <div className="text-sm text-green-600">
                            EN/UR Support
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-20 blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-green-400 to-lime-400 rounded-full opacity-15 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="container mx-auto px-6 lg:px-8">
          <div
            className={`text-center mb-16 ${
              selectedLanguage === "ur" ? "text-right" : ""
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {currentContent.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentContent.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.features.items.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-lime-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How AgriSmart Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to transform your farming experience
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload & Analyze",
                description:
                  "Take photos of your crops and upload them for AI-powered analysis",
                icon: Smartphone,
              },
              {
                step: "02",
                title: "Get Insights",
                description:
                  "Receive detailed reports on crop health, pest control, and weather recommendations",
                icon: TrendingUp,
              },
              {
                step: "03",
                title: "Follow Plan",
                description:
                  "Implement your personalized farming plan and track progress throughout the year",
                icon: CheckCircle,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-lime-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6">
                    {item.step}
                  </div>
                  <item.icon className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-green-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-lime-500 to-yellow-500">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Pakistani farmers who are already using AgriSmart
            to increase their crop yields and reduce costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold transition-all duration-200"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-lime-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  AgriSmart
                </span>
              </div>
              <p className="text-gray-600">
                Empowering Pakistani farmers with smart agricultural technology
                and data-driven insights.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Features</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-green-600 transition-colors cursor-pointer">
                  Crop Analysis
                </li>
                <li className="hover:text-green-600 transition-colors cursor-pointer">
                  Weather Insights
                </li>
                <li className="hover:text-green-600 transition-colors cursor-pointer">
                  Annual Planning
                </li>
                <li className="hover:text-green-600 transition-colors cursor-pointer">
                  Pest Control
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-green-600 transition-colors cursor-pointer">
                  Help Center
                </li>
                <li className="hover:text-green-600 transition-colors cursor-pointer">
                  Contact Us
                </li>
                <li className="hover:text-green-600 transition-colors cursor-pointer">
                  Documentation
                </li>
                <li className="hover:text-green-600 transition-colors cursor-pointer">
                  Community
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-green-600 transition-colors cursor-pointer">
                  About Us
                </li>
                <li className="hover:text-green-600 transition-colors cursor-pointer">
                  Careers
                </li>
                <li className="hover:text-green-600 transition-colors cursor-pointer">
                  Privacy Policy
                </li>
                <li className="hover:text-green-600 transition-colors cursor-pointer">
                  Terms of Service
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-12 pt-8 text-center text-gray-600">
            <p>
              &copy; 2025 Smart Kisaan. All rights reserved. Made for Pakistani
              farmers with ❤️
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
