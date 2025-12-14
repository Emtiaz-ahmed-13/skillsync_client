import { MobileMenu } from "@/components/home/mobile-menu";
import { UserProfileDropdown } from "@/components/home/user-profile-dropdown";
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
    <nav className="border-b border-purple-500/20 bg-white backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-700 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-purple-700">
                SkillSync
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="text-sm font-medium text-secondary hover:text-purple-700 transition-colors"
                >
                  {item.name}
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
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-purple-500/20 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-body hover:bg-purple-500/10"
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
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 text-sm rounded-lg border border-purple-500/20 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 w-40 text-body"
              />
            </div>

            {/* Cart */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-secondary hover:text-purple-700 hover:bg-purple-500/10"
                asChild
              >
                <Link href="/cart">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-700 text-white text-xs font-bold rounded-full flex items-center justify-center">
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
                className="relative text-secondary hover:text-purple-700 hover:bg-purple-500/10"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-700 rounded-full"></span>
              </Button>
              <div className="absolute right-0 mt-2 w-80 bg-white border border-purple-500/20 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 border-b border-purple-500/20">
                  <h3 className="font-medium text-purple-700">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-purple-500/10 hover:bg-purple-500/5 cursor-pointer ${
                        !notification.read ? "bg-purple-500/5" : ""
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-purple-700">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-purple-700 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-body mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted mt-2">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-4 text-center">
                  <button className="text-sm text-purple-700 hover:underline">
                    View all
                  </button>
                </div>
              </div>
            </div>

            {isAuthenticated ? (
              <UserProfileDropdown />
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-secondary hover:text-purple-700 hover:bg-purple-500/10 font-medium"
                  asChild
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-purple-700 text-white hover:bg-purple-800 font-medium text-sm px-4"
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
