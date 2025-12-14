"use client";

import { UserProfileDropdown } from "@/components/home/user-profile-dropdown";
import { Button } from "@/components/ui/button";
import { Bell, Globe, Menu, Search, ShoppingCart, X, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // This would typically come from user session context
  const isAuthenticated = false; // For now, we'll assume the user is not authenticated

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Projects", href: "/projects" },
    { name: "Pricing", href: "/auth/pricing" },
    {
      name: "Resources",
      href: "/blog",
      dropdown: [
        { name: "Blog", href: "/blog" },
        { name: "Documentation", href: "/docs" },
        { name: "Community", href: "/community" },
        { name: "Support", href: "/support" },
      ],
    },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
  ];

  const notifications = [
    {
      id: 1,
      title: "New message from client",
      description: "John Smith sent you a message about the website project",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Milestone completed",
      description:
        "Your milestone for the mobile app project has been approved",
      time: "1 hour ago",
      read: true,
    },
  ];

  // This would typically come from a shopping cart context
  const cartItems = 1; // For now, we'll assume there is 1 item in the cart

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
      >
        <Menu className="w-6 h-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white h-full w-4/5 max-w-sm shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">
                    SkillSync
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className="block py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.dropdown && (
                      <div className="pl-4 space-y-2 mt-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            onClick={() => setIsOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 w-full"
                    />
                  </div>

                  <div className="flex items-center gap-2 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-gray-900 rounded-full"></span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        1
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <Globe className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {isAuthenticated ? (
                  <div className="flex justify-center">
                    <UserProfileDropdown />
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                      asChild
                    >
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                    <Button
                      className="w-full bg-gray-900 text-white hover:bg-gray-800 font-medium"
                      asChild
                    >
                      <Link href="/auth/register">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
