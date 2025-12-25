"use client";

import { Navbar } from "@/components/home/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  created_at?: string;
}

export default function AdminUsersPage() {
  // Define type for session user with role
  type SessionUser = {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    accessToken?: string;
  };

  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as SessionUser;
      if (user.role !== "admin") {
        // Redirect to correct dashboard if user is not an admin
        switch (user.role) {
          case "client":
            router.push("/dashboard/client");
            break;
          case "freelancer":
            router.push("/dashboard/freelancer");
            break;
          default:
            router.push("/dashboard");
        }
      }
    } else if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (status === "authenticated" && session?.user) {
        const user = session.user as SessionUser;
        const accessToken = user.accessToken;

        if (!accessToken) {
          setError("No access token available");
          setLoading(false);
          return;
        }

        try {
          const response = await fetch(
            `http://localhost:5001/api/v1/admin/users`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();

            // Handle different possible response structures
            let usersArray = [];

            if (data.success && Array.isArray(data.data)) {
              // Standard API response format: { success: true, data: [...] }
              usersArray = data.data;
            } else if (Array.isArray(data)) {
              // Direct array response
              usersArray = data;
            } else if (data.data && Array.isArray(data.data.users)) {
              // Alternative format: { data: { users: [...] } }
              usersArray = data.data.users;
            } else {
              console.error("Unexpected users API response format:", data);
              usersArray = [];
            }

            setUsers(usersArray);
          } else {
            setError(`Failed to fetch users: ${response.status}`);
            console.error("Failed to fetch users:", response.status);
          }
        } catch (err) {
          setError("Error fetching users");
          console.error("Error fetching users:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [status, session]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Redirect effect will handle this
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="space-y-8 py-4">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-foreground"
            >
              Users Management
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-2 text-lg"
            >
              Manage all users on the platform
            </motion.p>
          </div>

          {/* Users Management Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                All Users
              </h2>
              <p className="text-sm text-muted-foreground">
                {users.length} user(s) registered on the platform
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.refresh()}>
                Refresh
              </Button>
              <Button onClick={() => router.push("/dashboard/admin")}>
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage all registered users on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
                  <p>Loading users...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>Error: {error}</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No users found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.id || user._id || Math.random().toString()}
                      >
                        <TableCell className="font-mono text-sm">
                          {user.id || user._id || "N/A"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {user.name || "N/A"}
                        </TableCell>
                        <TableCell>{user.email || "N/A"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "admin"
                                ? "default"
                                : user.role === "client"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {user.role || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : user.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {user.status || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.createdAt || user.created_at
                            ? new Date(
                                user.createdAt || user.created_at || ""
                              ).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
