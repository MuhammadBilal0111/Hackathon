"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Leaf,
  Cloud,
  TrendingUp,
  CropIcon,
  Settings,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalization } from "@/lib/localization";
import { useLanguage } from "@/context/LanguageContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export function SidebarNav() {
  const { t } = useLocalization();
  const { language, changeLanguage } = useLanguage();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItem[] = [
    {
      name: t("dashboard"),
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: t("cropManagement"),
      href: "/crop-management",
      icon: <Leaf className="w-5 h-5" />,
    },
    {
      name: t("weatherForecast"),
      href: "/weather",
      icon: <Cloud className="w-5 h-5" />,
    },
    {
      name: t("marketInsights"),
      href: "/market",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      name: t("aiCropAnalysis"),
      href: "/crop-analysis",
      icon: <CropIcon className="w-5 h-5" />,
    },
    {
      name: t("profile"),
      href: "/profile",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="p-6 border-b border-sidebar-border">
          <h1
            className={cn(
              "font-bold text-sidebar-foreground transition-all",
              collapsed ? "text-center text-xl" : "text-2xl"
            )}
          >
            {collapsed ? "SK" : "Smart Kisaan"}
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
              title={collapsed ? item.name : undefined}
            >
              {item.icon}
              {!collapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Language & Settings */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sidebar-foreground",
              { "justify-center": collapsed }
            )}
          >
            <Globe className="w-5 h-5" />
            {!collapsed && (
              <div className="flex gap-2">
                <button
                  onClick={() => changeLanguage("en")}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md",
                    language === "en"
                      ? "bg-green-primary text-green-primary-foreground"
                      : "hover:bg-green-primary-light"
                  )}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage("ur")}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md",
                    language === "ur"
                      ? "bg-green-primary text-green-primary-foreground"
                      : "hover:bg-green-primary-light"
                  )}
                >
                  UR
                </button>
              </div>
            )}
          </div>

          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              pathname === "/settings"
                ? "bg-green-primary text-green-primary-foreground hover:bg-green-primary-hover"
                : "text-sidebar-foreground hover:bg-green-primary-light hover:text-green-primary"
            )}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && (
              <span className="text-sm font-medium">{t("settings")}</span>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-green-primary-light hover:text-green-primary transition-all duration-200 group"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
