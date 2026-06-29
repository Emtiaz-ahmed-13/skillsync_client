"use client";

import { Navbar } from "@/components/shared/navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Freelancer {
  id: string;
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  freelancerProfile?: {
    skills?: string[];
    bio?: string;
    hourlyRate?: number;
    availability?: string;
  };
}

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (skill) params.set("skill", skill);
    params.set("limit", "24");

    setLoading(true);
    fetch(`/api/v1/profile/freelancers?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setFreelancers(data.data.freelancers || []);
      })
      .finally(() => setLoading(false));
  }, [search, skill]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-2">Find Freelancers</h1>
        <p className="text-muted-foreground mb-8">
          Browse skilled professionals by expertise and availability
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Input
            placeholder="Search by name or bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Input
            placeholder="Filter by skill (e.g. React)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((f) => (
              <Link key={f.id || f._id} href={`/freelancers/${f.id || f._id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{f.name}</CardTitle>
                    {f.freelancerProfile?.hourlyRate && (
                      <p className="text-sm text-primary font-medium">
                        ${f.freelancerProfile.hourlyRate}/hr
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {f.freelancerProfile?.bio || "No bio yet"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {f.freelancerProfile?.skills?.slice(0, 4).map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
