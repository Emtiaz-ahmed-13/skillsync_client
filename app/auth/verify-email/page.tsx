"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    fetch("/api/v1/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          toast.success("Email verified!");
        } else {
          setStatus("error");
          toast.error(data.message || "Verification failed");
        }
      })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle>
          {status === "loading" && "Verifying email..."}
          {status === "success" && "Email verified!"}
          {status === "error" && "Verification failed"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "success" && (
          <Button onClick={() => router.push("/auth/login")}>Go to login</Button>
        )}
        {status === "error" && (
          <Button asChild variant="outline">
            <Link href="/auth/login">Back to login</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
