import { getProjectByCode } from "@/lib/actions";
import { ClientDashboard } from "./client-dashboard";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ projectCode: string }>;
}

export default async function ClientPage({ params }: Props) {
  const { projectCode } = await params;
  const project = await getProjectByCode(projectCode);
  if (!project) notFound();
  return <ClientDashboard project={project} />;
}
