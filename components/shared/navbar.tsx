"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Search, Zap } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";
import { MobileMenu } from "./mobile-menu";

interface NavItem {
  name: string;
  href: string;
  dropdown?: {
    name: string;
    href: string;
  }[];
}

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isAuthenticated = status === "authenticated";
  const isUserAuthenticated = isAuthenticated && session?.user !== undefined;
  const isOnDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Projects", href: "/projects" },
    { name: "Articles", href: "/articles" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm" 
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <motion.span 
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-xl font-bold text-black dark:text-white group-hover:text-indigo-500 transition-colors duration-300"
                >
                  SkillSync
                </motion.span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 ml-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  {item.dropdown && (
                    <svg
                      className="w-4 h-4 ml-1 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </Link>

                {item.dropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-background border border-border/50 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 backdrop-blur-sm p-1">
                    <div className="py-1">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Auth/User Profile */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative hidden lg:block group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 text-sm rounded-full border border-border bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 w-40 hover:w-56 focus:w-64 transition-all duration-300"
              />
            </div>

            {/* Theme Toggle */}
            <div className="border-l border-border/50 pl-4 ml-2">
              <ThemeToggle />
            </div>

            {isUserAuthenticated ? (
              <div className="flex items-center gap-3 pl-2">
                {!isOnDashboard && (
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-full px-5 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300"
                    asChild
                  >
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </Button>
                )}
                <span className="text-sm font-medium text-foreground hidden lg:block">
                  {session.user?.name || session.user?.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-medium rounded-full px-4"
                  onClick={async () => {
                    await signOut({ callbackUrl: "/" });
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium hover:bg-accent/50 rounded-full px-5"
                  asChild
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300"
                  asChild
                >
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </motion.nav>
  );
}
