"use client";

import { useNotifications } from "@/lib/hooks/notifications";
import { Bell, Globe, Menu, Search, ShoppingCart, X, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const { unreadCount, loading, error } = useNotifications();

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Projects", href: "/projects" },
    { name: "Articles", href: "/articles" },
    { name: "Pricing", href: "/auth/pricing" },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
  ];
  const cartItems = 1; 

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="text-foreground hover:text-foreground hover:bg-accent"
      >
        <Menu className="w-6 h-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-background h-full w-4/5 max-w-sm shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground">
                    SkillSync
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-foreground hover:text-foreground hover:bg-accent"
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
                      className="block py-2 text-base font-medium text-foreground hover:text-foreground hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring w-full"
                    />
                  </div>

                  <div className="flex items-center gap-2 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-foreground hover:text-foreground hover:bg-accent"
                    >
                      <Bell className="w-5 h-5" />
                      {isAuthenticated && unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-foreground hover:text-foreground hover:bg-accent"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
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
                      className="text-foreground hover:text-foreground hover:bg-accent"
                    >
                      <Globe className="w-5 h-5" />
                    </Button>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-accent font-medium"
                  asChild
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                  asChild
                >
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
