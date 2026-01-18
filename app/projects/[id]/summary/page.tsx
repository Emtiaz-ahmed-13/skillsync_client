"use client";

import { ProjectSummary } from "@/components/features/projects/ProjectSummary";
import { Navbar } from "@/components/shared/navbar";
import { useParams } from "next/navigation";

export default function ProjectSummaryPage() {
    const params = useParams();
    const projectId = params.id as string;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ProjectSummary projectId={projectId} />
            </div>
        </div>
    );
}
