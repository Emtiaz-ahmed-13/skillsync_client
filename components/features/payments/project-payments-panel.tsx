"use client";

import { milestoneApi } from "@/lib/api/milestone-api";
import { MilestonePayment } from "@/components/features/payments/milestone-payment";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ProjectPaymentsPanelProps {
  projectId: string;
  freelancerId?: string;
}

export function ProjectPaymentsPanel({
  projectId,
  freelancerId,
}: ProjectPaymentsPanelProps) {
  const { data: session } = useSession();
  const [milestones, setMilestones] = useState<any[]>([]);
  const token = (session?.user as { accessToken?: string })?.accessToken;

  useEffect(() => {
    if (!token || !projectId) return;
    milestoneApi.getByProject(projectId, token).then((res) => {
      const list = (res as any).data ?? res;
      setMilestones(Array.isArray(list) ? list : []);
    }).catch(() => setMilestones([]));
  }, [token, projectId]);

  if (!freelancerId || milestones.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Milestone Payments</h3>
      <p className="text-sm text-muted-foreground">
        Funds are held in escrow until each milestone is completed and approved.
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        {milestones.map((m) => (
          <MilestonePayment
            key={m.id || m._id}
            milestone={m}
            projectId={projectId}
            freelancerId={freelancerId}
            onPaid={() => milestoneApi.getByProject(projectId, token!).then((res) => {
              const list = (res as any).data ?? res;
              setMilestones(Array.isArray(list) ? list : []);
            })}
          />
        ))}
      </div>
    </div>
  );
}
