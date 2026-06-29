"use client";

import { Navbar } from "@/components/shared/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminDisputesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [disputes, setDisputes] = useState<any[]>([]);
  const token = (session?.user as { accessToken?: string; role?: string })?.accessToken;
  const role = (session?.user as { role?: string })?.role;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && role !== "admin") router.push("/dashboard");
  }, [status, role, router]);

  useEffect(() => {
    if (!token) return;
    fetch("/api/v1/admin/disputes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setDisputes(data.data.disputes || []);
      });
  }, [token]);

  const resolve = async (id: string, resolution: string) => {
    const res = await fetch(`/api/v1/admin/disputes/${id}/resolve`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resolution, note: `Resolved as ${resolution}` }),
    });
    if (res.ok) {
      toast.success("Dispute resolved");
      setDisputes((prev) => prev.filter((d) => d._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Disputes</h1>
        {disputes.length === 0 ? (
          <p className="text-muted-foreground">No open disputes</p>
        ) : (
          <div className="space-y-4">
            {disputes.map((d) => (
              <Card key={d._id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {d.projectId?.title || "Project dispute"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{d.reason}</p>
                  <Badge>{d.status}</Badge>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => resolve(d._id, "resolve")}>
                      Resolve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => resolve(d._id, "dismiss")}>
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
