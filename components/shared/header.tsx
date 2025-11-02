"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf, User } from "lucide-react";

export default function Header() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // Check if user is logged in by checking localStorage
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          if (parsedData.uid) {
            setIsLoggedIn(true);
            setUserEmail(parsedData.email || "User");
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    checkAuth();

    // Listen for storage changes (e.g., login in another tab)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <header className="border-b border-green-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-lime-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-lime-600 bg-clip-text text-transparent">
              AgriSmart
            </span>
          </Link>

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

            {/* Show Login/Signup buttons only when user is NOT logged in */}
            {!isLoggedIn ? (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-50"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-green-600 to-lime-500 hover:from-green-700 hover:to-lime-600">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              /* Show user info when logged in */
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {userEmail}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
