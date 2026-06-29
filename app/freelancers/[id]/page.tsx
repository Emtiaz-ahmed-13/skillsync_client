"use client";

import { Navbar } from "@/components/shared/navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FreelancerProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/profile/freelancers/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProfile(data.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24">Freelancer not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-24 max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                {profile.freelancerProfile?.hourlyRate && (
                  <p className="text-primary font-medium mt-1">
                    ${profile.freelancerProfile.hourlyRate}/hr
                  </p>
                )}
              </div>
              {profile.averageRating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{profile.averageRating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({profile.reviewCount})
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">
                {profile.freelancerProfile?.bio || "No bio provided"}
              </p>
            </div>
            {profile.freelancerProfile?.experience && (
              <div>
                <h3 className="font-semibold mb-2">Experience</h3>
                <p className="text-muted-foreground">
                  {profile.freelancerProfile.experience}
                </p>
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.freelancerProfile?.skills?.map((s: string) => (
                  <Badge key={s}>{s}</Badge>
                )) || <span className="text-muted-foreground">No skills listed</span>}
              </div>
            </div>
            {profile.reviews?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Reviews</h3>
                <div className="space-y-3">
                  {profile.reviews.map((r: any) => (
                    <div key={r._id} className="border rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Link
              href={`/dashboard/messages?userId=${id}`}
              className="inline-block text-primary hover:underline text-sm"
            >
              Send message →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
