"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { paymentApi } from "@/lib/api/payment-api";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface MilestonePaymentProps {
  milestone: {
    id: string;
    _id?: string;
    title: string;
    amount: number;
    status: string;
  };
  projectId: string;
  freelancerId: string;
  onPaid?: () => void;
}

export function MilestonePayment({
  milestone,
  projectId,
  freelancerId,
  onPaid,
}: MilestonePaymentProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const token = (session?.user as { accessToken?: string })?.accessToken;
  const milestoneId = milestone.id || milestone._id || "";

  const handlePay = async () => {
    if (!token) {
      toast.error("Please log in to pay");
      return;
    }
    setLoading(true);
    try {
      const result = await paymentApi.createIntent(
        {
          amount: Math.round(milestone.amount * 100),
          currency: "usd",
          milestoneId,
          projectId,
          freelancerId,
        },
        token,
      );

      const clientSecret = (result as any).clientSecret || (result as any).data?.clientSecret;
      if (!clientSecret) {
        toast.error("Could not create payment");
        return;
      }

      const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!stripeKey) {
        toast.info(
          "Payment intent created. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable Stripe checkout.",
        );
        return;
      }

      const { loadStripe } = await import("@stripe/stripe-js");
      const stripe = await loadStripe(stripeKey);
      if (!stripe) throw new Error("Stripe failed to load");

      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/client/projects/${projectId}?payment=success`,
        },
      });

      if (error) toast.error(error.message || "Payment failed");
      else onPaid?.();
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const statusLabel: Record<string, string> = {
    pending: "Awaiting payment (held in escrow until milestone complete)",
    in_progress: "In progress — freelancer working",
    completed: "Milestone complete — ready to release",
    paid: "Paid to freelancer",
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          {milestone.title}
          <span className="text-primary">${milestone.amount}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          {statusLabel[milestone.status] || milestone.status}
        </p>
        {milestone.status === "pending" && (
          <Button onClick={handlePay} disabled={loading} size="sm" className="w-full">
            {loading ? "Processing..." : `Pay $${milestone.amount} — Escrow`}
          </Button>
        )}
        {milestone.status === "paid" && (
          <p className="text-xs text-green-600 font-medium">✓ Payment released</p>
        )}
      </CardContent>
    </Card>
  );
}
