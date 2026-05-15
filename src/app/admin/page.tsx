import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAllProjects } from "@/lib/actions";
import { AdminDashboardClient } from "./admin-dashboard";

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const projects = await getAllProjects();

  return <AdminDashboardClient initialProjects={projects as never[]} />;
}
