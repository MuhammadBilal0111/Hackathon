"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf, User, LogOut } from "lucide-react";
import { logoutUser } from "@/lib/authService";
import { useRouter } from "next/navigation";

export default function Header({
  selectedLanguage,
  setSelectedLanguage,
}: {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await logoutUser();
    if (!error) {
      setIsLoggedIn(false);
      setUserEmail("");
      router.push("/");
    }
  };

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
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Products
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  href="/vendors/dashboard"
                  className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                >
                  Vendor Dashboard
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/crops"
                  className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                >
                  Crops
                </Link>
              </>
            )}
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
              /* Show user info and logout button when logged in */
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {userEmail}
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
