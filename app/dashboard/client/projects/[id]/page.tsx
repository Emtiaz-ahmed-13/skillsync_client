import ClientProjectDetailsClient from "./client";

export default async function ClientProjectDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = await params;
  const { id } = unwrappedParams;

  return <ClientProjectDetailsClient id={id} />;
}
