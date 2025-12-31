"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProjectDetailsProps {
  projectId: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  deadline: string;
  createdAt: string;
  progress: number;
  ownerId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  technologies: string[];
}

export default function ProjectDetailsClient({ projectId }: ProjectDetailsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      // In a real app, we might need a specific endpoint for freelancer project details
      // using the generic project endpoint for now
      try {
        const response = await fetch(`http://localhost:5001/api/v1/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${(session?.user as any)?.accessToken}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setProject(data.data);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if ((session?.user as any)?.accessToken) {
        fetchProjectDetails();
    }
  }, [projectId, session]);

  if (loading) {
    return <div className="p-8 text-center">Loading project details...</div>;
  }

  if (!project) {
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-destructive">Project Not Found</h2>
            <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                Go Back
            </Button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button 
            variant="ghost" 
            className="mb-6 hover:bg-transparent pl-0 hover:text-primary"
            onClick={() => router.back()}
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-bold">{project.title}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span>Posted on {new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <Badge variant={project.status === 'in-progress' ? 'default' : 'secondary'}>
                                {project.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div>
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {project.description}
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Technologies</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies?.map((tech) => (
                                    <Badge key={tech} variant="outline">{tech}</Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Progress</h3>
                             <div className="flex items-center gap-4">
                                <Progress value={project.progress || 0} className="flex-1" />
                                <span className="font-medium">{project.progress || 0}%</span>
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                 {/* Client Info Widget */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Client Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={project.ownerId?.avatar} />
                                <AvatarFallback>
                                    {project.ownerId?.name?.[0] || 'C'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{project.ownerId?.name || "Unknown Client"}</p>
                                <p className="text-sm text-muted-foreground">{project.ownerId?.email}</p>
                            </div>
                        </div>
                        
                        <Separator />
                        
                        {project.ownerId && (
                             <Button className="w-full gap-2" asChild>
                                <Link href={`/dashboard/messages?userId=${project.ownerId._id}`}>
                                    <MessageSquare className="w-4 h-4" />
                                    Chat with Client
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                         <CardTitle className="text-lg">Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Deadline
                            </span>
                            <span className="font-medium">
                                {new Date(project.deadline).toLocaleDateString()}
                            </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                             <span className="text-muted-foreground">Budget</span>
                             <span className="font-bold text-lg text-primary">
                                ${project.budget?.toLocaleString()}
                             </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
