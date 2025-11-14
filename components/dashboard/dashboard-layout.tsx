import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  user: {
    name?: string | null;
    image?: string | null;
  };
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  children: ReactNode;
}

export function DashboardLayout({
  title,
  subtitle,
  user,
  actionButton,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A192F] text-gray-900 dark:text-white">
      <div className="border-b border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#64FFDA]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#64FFDA]/10 flex items-center justify-center border-2 border-[#64FFDA]">
                  <span className="text-[#0A8B8B] dark:text-[#64FFDA] font-bold">
                    {user.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {actionButton && (
                <Button
                  className="bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 cursor-pointer mr-2"
                  onClick={actionButton.onClick}
                >
                  {actionButton.label}
                </Button>
              )}
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
