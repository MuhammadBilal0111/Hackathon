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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "Crop Management",
    href: "/crop-management",
    icon: <Leaf className="w-5 h-5" />,
  },
  {
    name: "Weather Forecast",
    href: "/weather",
    icon: <Cloud className="w-5 h-5" />,
  },
  {
    name: "Market Insights",
    href: "/market",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    name: "AI Crop Analysis",
    href: "/crop-analysis",
    icon: <CropIcon className="w-5 h-5" />,
  },
  { name: "Profile", href: "/profile", icon: <Settings className="w-5 h-5" /> },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
            {collapsed ? "AA" : "AgriAssist"}
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

        {/* Settings & Toggle */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
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
              <span className="text-sm font-medium">Settings</span>
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
              <span className="text-xs font-medium">Collapse</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
