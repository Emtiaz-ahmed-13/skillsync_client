import { MobileMenu } from "@/components/home/mobile-menu";
import { UserProfileDropdown } from "@/components/home/user-profile-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Bell, Search, ShoppingCart, Zap } from "lucide-react";
import Link from "next/link";

interface NavItem {
  name: string;
  href: string;
  dropdown?: {
    name: string;
    href: string;
  }[];
}

export function Navbar() {
  // This would typically come from user session context
  const isAuthenticated = false; // For now, we'll assume the user is not authenticated

  const navItems: NavItem[] = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "/pricing" },
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
    {
      id: 3,
      title: "Payment received",
      description: "$1,200 has been transferred to your account",
      time: "3 hours ago",
      read: true,
    },
  ];

  // This would typically come from a shopping cart context
  const cartItems = 2; // For now, we'll assume there are 2 items in the cart

  return (
    <nav className="border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0A192F]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#64FFDA] to-[#0A8B8B] rounded-xl flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-[#0A192F]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-[#0A192F] to-[#0A192F]/70 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
                SkillSync
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                Professional Collaboration
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-[#64FFDA] dark:text-gray-300 dark:hover:text-[#64FFDA] transition-colors flex items-center gap-1"
                >
                  {item.name}
                  {item.dropdown && (
                    <svg
                      className="w-4 h-4 ml-1"
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
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 hover:text-[#64FFDA] dark:hover:text-[#64FFDA]"
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
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, freelancers..."
                className="pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240] focus:outline-none focus:ring-2 focus:ring-[#64FFDA]/50 focus:border-[#64FFDA] w-64"
              />
            </div>

            {/* Cart */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
                asChild
              >
                <Link href="/cart">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#64FFDA] text-[#0A192F] text-xs font-bold rounded-full flex items-center justify-center">
                      {cartItems}
                    </span>
                  )}
                </Link>
              </Button>
            </div>

            {/* Notifications */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#64FFDA] rounded-full"></span>
              </Button>
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-white/10">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${
                        !notification.read
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-[#64FFDA] rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-4 text-center">
                  <button className="text-sm text-[#64FFDA] hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            </div>

            <ThemeToggle />

            {isAuthenticated ? (
              <UserProfileDropdown />
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
                  asChild
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#64FFDA] to-[#0A8B8B] text-[#0A192F] hover:from-[#64FFDA]/90 hover:to-[#0A8B8B]/90 font-semibold shadow-md"
                  asChild
                >
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
