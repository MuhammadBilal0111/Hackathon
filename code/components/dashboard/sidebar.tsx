"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { LayoutDashboard, Cloud, Leaf, Calendar, Settings, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  icon: React.ReactNode
  href: string
  active?: boolean
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: "#",
      active: true,
    },
    {
      label: "Weather",
      icon: <Cloud className="w-5 h-5" />,
      href: "#",
    },
    {
      label: "Crop Analysis",
      icon: <Leaf className="w-5 h-5" />,
      href: "#",
    },
    {
      label: "Annual Plan",
      icon: <Calendar className="w-5 h-5" />,
      href: "#",
    },
    {
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      href: "#",
    },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-card rounded-lg shadow-sm"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 md:translate-x-0 z-30",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 mt-8 md:mt-0">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">Smart Agro</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  item.active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 md:hidden z-20" onClick={() => setIsOpen(false)} />}
    </>
  )
}
