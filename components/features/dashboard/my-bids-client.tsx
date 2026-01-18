"use client";

import { Navbar } from "@/components/shared/navbar";
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

interface Bid {
  id: string;
  _id: string;
  projectId: string | { _id: string; title?: string; ownerId?: any };
  projectTitle?: string;
  clientName?: string;
  amount: number;
  proposal: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyBidsClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchBids = async () => {
      if (status === "authenticated" && session?.user) {
        const user = session.user as any;
        const accessToken = user.accessToken;

        try {
          const bidsResponse = await fetch("/api/v1/bids/my", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          let bids: Bid[] = [];
          if (bidsResponse.ok) {
            const bidsData = await bidsResponse.json();
            if (bidsData.success && bidsData.data) {
              bids = bidsData.data;

              // Fetch project titles for each bid
              const bidsWithDetails = await Promise.all(
                bids.map(async (bid: Bid) => {
                  try {
                    const projectIdStr =
                      typeof bid.projectId === "object" &&
                      bid.projectId !== null
                        ? (bid.projectId as any)._id ||
                          (bid.projectId as any).id
                        : bid.projectId;

                    const projectResponse = await fetch(
                      `/api/v1/projects/${projectIdStr}`,
                      {
                        headers: {
                          Authorization: `Bearer ${accessToken}`,
                        },
                      }
                    );

                    if (projectResponse.ok) {
                      const projectData = await projectResponse.json();
                      if (projectData.success && projectData.data) {
                        return {
                          ...bid,
                          projectTitle: projectData.data.title,
                          clientName:
                            projectData.data.ownerId &&
                            typeof projectData.data.ownerId === "object"
                              ? (projectData.data.ownerId as any).name
                              : "Unknown Client",
                        };
                      }
                    }
                  } catch (error) {
                    console.error("Error fetching project for bid:", error);
                  }

                  // Fallback
                  const fallbackTitle =
                    bid.projectId &&
                    typeof bid.projectId === "object" &&
                    (bid.projectId as any).title
                      ? (bid.projectId as any).title
                      : "Unknown Project";

                  return {
                    ...bid,
                    projectTitle: fallbackTitle,
                    clientName: "Unknown Client",
                  };
                })
              );
              setBids(bidsWithDetails);
            }
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching bids:", error);
          setLoading(false);
        }
      }
    };

    fetchBids();
  }, [status, session]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Bids</h1>
              <p className="text-muted-foreground mt-2">
                View and manage all your project proposals.
              </p>
            </div>
            <Button onClick={() => router.back()} variant="outline">
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Bids</CardTitle>
              <CardDescription>
                You have placed {bids.length} bids total.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bids.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No bids found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">
                          Submitted Info
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bids.map((bid) => (
                        <TableRow
                          key={bid.id || bid._id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            {bid.projectTitle || "Unknown Project"}
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {bid.clientName || "Unknown Client"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">${bid.amount}</span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                bid.status === "accepted"
                                  ? "default"
                                  : bid.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="capitalize"
                            >
                              {bid.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">
                            {new Date(bid.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
