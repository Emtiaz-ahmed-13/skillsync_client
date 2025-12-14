import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ReactNode } from "react";

interface ActionButton {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  user: {
    name?: string | null;
    image?: string | null;
  };
  actionButton?: ActionButton;
  actionButtons?: ActionButton[];
  children: ReactNode;
}

export function DashboardLayout({
  title,
  subtitle,
  user,
  actionButton,
  actionButtons = [],
  children,
}: DashboardLayoutProps) {
  // Combine single actionButton with actionButtons array
  const allActionButtons = actionButton
    ? [actionButton, ...actionButtons]
    : actionButtons;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-12 h-12 rounded-full object-cover border-2 border-skillsync-cyan"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-skillsync-cyan/10 flex items-center justify-center border-2 border-skillsync-cyan">
                  <span className="text-skillsync-cyan-dark font-bold">
                    {user.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600 mt-1">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {allActionButtons.map((btn, index) => (
                <Button
                  key={index}
                  className={`${
                    index === 0
                      ? "bg-skillsync-cyan text-skillsync-dark-blue hover:bg-skillsync-cyan/90"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  } cursor-pointer mr-2`}
                  onClick={btn.onClick}
                  {...(btn.href ? { asChild: true } : {})}
                >
                  {btn.href ? (
                    <Link href={btn.href}>{btn.label}</Link>
                  ) : (
                    btn.label
                  )}
                </Button>
              ))}
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
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
