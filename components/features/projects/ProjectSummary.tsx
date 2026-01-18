"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Award,
    Calendar,
    CheckCircle2,
    Download,
    FileText,
    MessageSquare,
    TrendingUp,
    Users
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProjectSummaryData {
    project: {
        title: string;
        description: string;
        status: string;
        budget: number;
        minimumBid: number;
        startDate: string;
        endDate: string;
        technology: string[];
    };
    participants: {
        client: {
            _id: string;
            name: string;
            email: string;
            avatar?: string;
        };
        freelancer: {
            _id: string;
            name: string;
            email: string;
            avatar?: string;
        };
    };
    chatHistory: {
        totalMessages: number;
        keyConversations: Array<{
            sender: string;
            message: string;
            timestamp: string;
        }>;
    };
    workSubmissions: Array<{
        completedFeatures: string[];
        githubLink: string;
        liveLink?: string;
        status: string;
        submittedAt: string;
    }>;
    bidHistory: {
        acceptedBid: number;
        totalBids: number;
        acceptedFreelancer: string;
    };
    aiSummary: {
        overview: string;
        keyHighlights: string[];
        challenges: string[];
        recommendations: string[];
        performanceRating: string;
        clientSatisfaction: string;
        freelancerPerformance: string;
    };
}

interface ProjectSummaryProps {
    projectId: string;
}

export function ProjectSummary({ projectId }: ProjectSummaryProps) {
    const { data: session } = useSession();
    const [summary, setSummary] = useState<ProjectSummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchSummary();
    }, [projectId]);

    const fetchSummary = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/summary`,
                {
                    headers: {
                        Authorization: `Bearer ${(session as any)?.accessToken}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setSummary(data.data.summaryData);
            } else if (response.status === 404) {
                // Summary doesn't exist yet
                setSummary(null);
            }
        } catch (error) {
            console.error("Error fetching summary:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateSummary = async () => {
        try {
            setGenerating(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/generate-summary`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${(session as any)?.accessToken}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setSummary(data.data.summaryData);
                toast.success("Project summary generated successfully!");
            } else {
                toast.error("Failed to generate summary");
            }
        } catch (error) {
            console.error("Error generating summary:", error);
            toast.error("An error occurred while generating summary");
        } finally {
            setGenerating(false);
        }
    };

    const getRatingColor = (rating: string) => {
        switch (rating.toLowerCase()) {
            case "excellent":
                return "text-green-600 bg-green-50";
            case "good":
                return "text-blue-600 bg-blue-50";
            case "satisfactory":
                return "text-yellow-600 bg-yellow-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading summary...</p>
                </div>
            </div>
        );
    }

    if (!summary) {
        return (
            <Card className="p-8 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Summary Available</h3>
                <p className="text-muted-foreground mb-6">
                    Generate an AI-powered summary for this completed project
                </p>
                <Button onClick={generateSummary} disabled={generating}>
                    {generating ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                        </>
                    ) : (
                        <>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Generate Summary
                        </>
                    )}
                </Button>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-2xl mb-2">{summary.project.title}</CardTitle>
                            <CardDescription className="text-base">
                                {summary.project.description}
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Badge variant="secondary">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(summary.project.startDate).toLocaleDateString()} -{" "}
                            {new Date(summary.project.endDate).toLocaleDateString()}
                        </Badge>
                        <Badge variant="secondary">${summary.project.budget}</Badge>
                        {summary.project.technology.map((tech) => (
                            <Badge key={tech} variant="outline">
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </CardHeader>
            </Card>

            {/* AI Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        AI-Generated Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{summary.aiSummary.overview}</p>
                    <div className="mt-4">
                        <Badge className={getRatingColor(summary.aiSummary.performanceRating)}>
                            Performance: {summary.aiSummary.performanceRating}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Participants */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Project Team
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                {summary.participants.client.name[0]}
                            </div>
                            <div>
                                <p className="font-medium">{summary.participants.client.name}</p>
                                <p className="text-sm text-muted-foreground">Client</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                {summary.participants.freelancer.name[0]}
                            </div>
                            <div>
                                <p className="font-medium">{summary.participants.freelancer.name}</p>
                                <p className="text-sm text-muted-foreground">Freelancer</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Key Highlights */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Key Highlights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {summary.aiSummary.keyHighlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{highlight}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Communication Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Communication
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <p className="text-3xl font-bold text-primary">{summary.chatHistory.totalMessages}</p>
                            <p className="text-sm text-muted-foreground">Total Messages</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <p className="text-3xl font-bold text-primary">{summary.workSubmissions.length}</p>
                            <p className="text-sm text-muted-foreground">Deliverables</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <p className="text-3xl font-bold text-primary">{summary.bidHistory.totalBids}</p>
                            <p className="text-sm text-muted-foreground">Total Bids</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Challenges & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Challenges</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {summary.aiSummary.challenges.map((challenge, index) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                    • {challenge}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {summary.aiSummary.recommendations.map((rec, index) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                    • {rec}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Client Satisfaction</h4>
                        <p className="text-sm text-muted-foreground">{summary.aiSummary.clientSatisfaction}</p>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-semibold mb-2">Freelancer Performance</h4>
                        <p className="text-sm text-muted-foreground">{summary.aiSummary.freelancerPerformance}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
