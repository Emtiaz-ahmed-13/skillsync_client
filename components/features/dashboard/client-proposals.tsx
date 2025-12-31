"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProjects } from "@/lib/api/projects-api";
import {
  acceptProposal,
  getProposalsByProject,
  rejectProposal,
} from "@/lib/api/proposals-api";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  FileText,
  User,
  XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Proposal {
  _id: string;
  projectId: string;
  freelancerId: string;
  coverLetter: string;
  resumeUrl?: string;
  amount: number;
  timeline: number;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
  updatedAt: string;
  freelancer: {
    name: string;
    email: string;
    avatar?: string;
  };
  project?: {
    title: string;
    description: string;
  };
}

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  deadline: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientProposalsProps {
  onProposalUpdate?: () => void;
}

export function ClientProposals({
  onProposalUpdate,
}: ClientProposalsProps = {}) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [projects, setProjects] = useState<Record<string, Project>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "accepted">("pending");
  const { data: session } = useSession();

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);

      const projectsResponse = await getProjects();
      if (projectsResponse.success && projectsResponse.data) {
        const rawProjects = projectsResponse.data;
        const clientProjects = Array.isArray(rawProjects)
          ? (rawProjects as Project[])
          : [];
        const allProposals: Proposal[] = [];
        for (const project of clientProjects) {
          const proposalsResponse = await getProposalsByProject(project._id);
          if (proposalsResponse.success && proposalsResponse.data) {
            const projectProposals = proposalsResponse.data as Proposal[];
            allProposals.push(...projectProposals);
          }
        }

        setProposals(allProposals);

        const projectMap: Record<string, Project> = {};
        clientProjects.forEach((project) => {
          projectMap[project._id] = project;
        });

        setProjects(projectMap);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast.error("Failed to load proposals");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      const result = await acceptProposal(proposalId);
      if (result.success) {
     
        const proposalToAccept = proposals.find((p) => p._id === proposalId);

        setProposals((prev) =>
          prev.map((p) =>
            p._id === proposalId ? { ...p, status: "accepted" } : p
          )
        );
        toast.success("Proposal accepted successfully");
        if (proposalToAccept?.resumeUrl) {
          const shouldViewResume = confirm(
            "Would you like to view the freelancer's resume now?"
          );
          if (shouldViewResume) {
            handleViewResume(proposalToAccept.resumeUrl);
          }
        }

        // Notify parent component to refresh projects
        if (onProposalUpdate) {
          onProposalUpdate();
        }
      } else {
        toast.error(result.message || "Failed to accept proposal");
      }
    } catch (error) {
      console.error("Error accepting proposal:", error);
      toast.error("Failed to accept proposal");
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    try {
      const result = await rejectProposal(proposalId);
      if (result.success) {
        setProposals((prev) =>
          prev.map((p) =>
            p._id === proposalId ? { ...p, status: "rejected" } : p
          )
        );
        toast.success("Proposal rejected successfully");

        // Notify parent component to refresh projects
        if (onProposalUpdate) {
          onProposalUpdate();
        }
      } else {
        toast.error(result.message || "Failed to reject proposal");
      }
    } catch (error) {
      console.error("Error rejecting proposal:", error);
      toast.error("Failed to reject proposal");
    }
  };

  const handleViewResume = (resumeUrl: string | undefined) => {
    if (!resumeUrl) {
      toast.error("No resume available");
      return;
    }

    // In a real implementation, this would open the resume in a new tab
    window.open(resumeUrl, "_blank");
  };

  const pendingProposals = proposals.filter((p) => p.status === "pending");
  const acceptedProposals = proposals.filter((p) => p.status === "accepted");

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Project Proposals</CardTitle>
            <CardDescription>
              Manage proposals for your projects
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("pending")}
            >
              Pending ({pendingProposals.length})
            </Button>
            <Button
              variant={activeTab === "accepted" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("accepted")}
            >
              Active ({acceptedProposals.length})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p>Loading proposals...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === "pending" ? (
              pendingProposals.length > 0 ? (
                pendingProposals.map((proposal) => (
                  <Card key={proposal._id} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={proposal.freelancer.avatar}
                              alt={proposal.freelancer.name}
                            />
                            <AvatarFallback>
                              {proposal.freelancer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">
                              {proposal.freelancer.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {proposal.freelancer.email}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm">{proposal.coverLetter}</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>${proposal.amount}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{proposal.timeline} days</span>
                          </div>
                          {proposal.resumeUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewResume(proposal.resumeUrl)
                              }
                              className="flex items-center"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Review Resume
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptProposal(proposal._id)}
                          className="flex items-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectProposal(proposal._id)}
                          className="flex items-center"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <User className="w-12 h-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-2 font-medium">No pending proposals</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You don't have any pending proposals at the moment.
                  </p>
                </div>
              )
            ) : acceptedProposals.length > 0 ? (
              acceptedProposals.map((proposal) => (
                <Card key={proposal._id} className="p-4 border-primary">
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={proposal.freelancer.avatar}
                            alt={proposal.freelancer.name}
                          />
                          <AvatarFallback>
                            {proposal.freelancer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {proposal.freelancer.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {proposal.freelancer.email}
                          </p>
                        </div>
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          Accepted
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm">{proposal.coverLetter}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span>${proposal.amount}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{proposal.timeline} days</span>
                        </div>
                        {proposal.projectId && projects[proposal.projectId] && (
                          <div className="font-medium">
                            {projects[proposal.projectId]?.title}
                          </div>
                        )}
                        {proposal.resumeUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewResume(proposal.resumeUrl)}
                            className="flex items-center"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Review Resume
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                        asChild
                      >
                        <a href={`/projects/${proposal.projectId}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Project
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground" />
                <h3 className="mt-2 font-medium">No active projects</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You don't have any active projects from accepted proposals.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
