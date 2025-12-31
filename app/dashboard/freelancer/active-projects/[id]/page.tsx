import ProjectDetailsClient from "./project-details-client";

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <ProjectDetailsClient projectId={id} />;
}
