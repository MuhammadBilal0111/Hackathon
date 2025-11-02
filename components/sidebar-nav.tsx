"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Leaf,
  Cloud,
  TrendingUp,
  CropIcon,
  Settings,
  LogOut,
  DollarSign,
  Languages,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/lib/authService";
import { toast } from "sonner";
import { useLocalization } from "@/lib/localization";
import { useLanguage } from "@/context/LanguageContext";

interface NavItem {
  name: string;
  translationKey: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    translationKey: "dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "Annual Farming Plan",
    translationKey: "annualPlan",
    href: "/annual-plan",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    name: "AI Crop Analysis",
    translationKey: "aiCropAnalysis",
    href: "/crop-analysis",
    icon: <CropIcon className="w-5 h-5" />,
  },
  {
    name: "Crop Management",
    translationKey: "cropManagement",
    href: "/crops",
    icon: <Leaf className="w-5 h-5" />,
  },
  {
    name: "Weather Forecast",
    translationKey: "weatherForecast",
    href: "/weather",
    icon: <Cloud className="w-5 h-5" />,
  },
  {
    name: "Marketplace",
    translationKey: "marketInsights",
    href: "/products",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    name: "Expense Tracker",
    translationKey: "expenseTracker",
    href: "/expense-tracker",
    icon: <DollarSign className="w-5 h-5" />,
  },
  // { name: "Profile", translationKey: "profile", href: "/profile", icon: <Settings className="w-5 h-5" /> },
];

export function SidebarNav() {
  const { t } = useLocalization();
  const { language, changeLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    const { error } = await logoutUser();
    if (error) {
      toast.error(t("logoutFailed"));
    } else {
      toast.success(t("logoutSuccess"));
      router.push("/login");
    }
  };

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-sidebar-border">
          <h1
            className={cn(
              "font-bold text-sidebar-foreground transition-all",
              collapsed ? "text-center text-xl" : "text-2xl"
            )}
          >
            {collapsed ? "SK" : t("title")}
          </h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-green-primary text-green-primary-foreground hover:bg-green-primary-hover"
                  : "text-sidebar-foreground hover:bg-green-primary-light hover:text-green-primary"
              )}
              title={collapsed ? t(item.translationKey as any) : undefined}
            >
              {item.icon}
              {!collapsed && (
                <span className="text-sm font-medium">
                  {t(item.translationKey as any)}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Settings & Toggle */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          {/* Language Switcher */}
          <div className={cn("px-2 py-2", collapsed && "flex justify-center")}>
            {!collapsed && (
              <div className="flex items-center gap-2 mb-2 px-2">
                <Languages className="w-4 h-4 text-sidebar-foreground/70" />
                <span className="text-xs font-medium text-sidebar-foreground/70">
                  {t("languageLabel")}
                </span>
              </div>
            )}
            <div
              className={cn(
                "flex bg-gray-100 rounded-lg p-1",
                collapsed ? "flex-col gap-1" : "gap-1"
              )}
            >
              <button
                onClick={() => changeLanguage("en")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  language === "en"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-600 hover:text-green-600"
                )}
                title={collapsed ? "English" : undefined}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage("ur")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  language === "ur"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-600 hover:text-green-600"
                )}
                title={collapsed ? "اردو" : undefined}
              >
                اردو
              </button>
            </div>
          </div>

          {/* <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              pathname === "/settings"
                ? "bg-green-primary text-green-primary-foreground hover:bg-green-primary-hover"
                : "text-sidebar-foreground hover:bg-green-primary-light hover:text-green-primary"
            )}
            title={collapsed ? t("settings") : undefined}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && (
              <span className="text-sm font-medium">{t("settings")}</span>
            )}
          </Link> */}

          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sidebar-foreground hover:bg-red-50 hover:text-red-600"
            )}
            title={collapsed ? t("logout") : undefined}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && (
              <span className="text-sm font-medium">{t("logout")}</span>
            )}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-green-primary-light hover:text-green-primary transition-all duration-200 group"
            title={collapsed ? t("expandSidebar") : t("collapseSidebar")}
          >
            <span className="text-lg font-semibold group-hover:scale-110 transition-transform">
              {collapsed ? "→" : "←"}
            </span>
            {!collapsed && (
              <span className="text-xs font-medium">{t("collapse")}</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
