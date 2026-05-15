"use server";

import { createServerSupabaseClient, createAdminClient } from "@/lib/supabase/server";
import { generateProjectCode } from "@/lib/pricing";
import type { ProjectFormData, ProjectStatus, PaymentStatus } from "@/lib/types";

export async function submitProject(formData: Omit<ProjectFormData, "files">) {
  const supabase = await createAdminClient();
  const projectCode = generateProjectCode();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      project_code: projectCode,
      service_type: formData.service_type,
      client_name: formData.client_name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      company_name: formData.company_name || "",
      country: formData.country,
      project_name: formData.project_name,
      project_description: formData.project_description,
      target_audience: formData.target_audience || "",
      main_goals: formData.main_goals || "",
      deadline: formData.deadline || "",
      expected_launch: formData.expected_launch || "",
      budget: formData.budget || "",
      brand_colors: formData.brand_colors || "",
      existing_website: formData.existing_website || "",
      notes: formData.notes || "",
      project_type: formData.project_type,
      features: formData.features,
      pages: formData.pages,
      design_complexity: formData.design_complexity,
      responsive: formData.responsive,
      dark_mode: formData.dark_mode,
      reference_links: formData.references || [],
      final_price: 0,
      payment_status: "unpaid",
      status: "under-review" as ProjectStatus,
      progress: 5,
      admin_notes: "",
    })
    .select()
    .single();

  if (error) {
    console.error("Error submitting project:", error);
    return { success: false, error: error.message };
  }

  return { success: true, projectCode, projectId: data.id };
}

export async function uploadProjectFile(projectId: string, file: FormData) {
  const supabase = await createAdminClient();
  const fileData = file.get("file") as File;
  if (!fileData) return { success: false, error: "No file provided" };

  const fileExt = fileData.name.split(".").pop();
  const fileName = `${projectId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from("project-files").upload(fileName, fileData);
  if (uploadError) return { success: false, error: uploadError.message };

  const { data: urlData } = supabase.storage.from("project-files").getPublicUrl(fileName);

  const { error: dbError } = await supabase.from("project_files").insert({
    project_id: projectId,
    file_url: urlData.publicUrl,
    file_type: fileData.type,
    file_name: fileData.name,
  });

  if (dbError) return { success: false, error: dbError.message };
  return { success: true, url: urlData.publicUrl };
}

export async function trackProject(email: string, projectCode: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_files(*), payment_records(*), invoices(*)")
    .eq("email", email)
    .eq("project_code", projectCode)
    .single();

  if (error || !data) return { success: false, error: "Project not found." };
  return { success: true, project: data };
}

export async function findProjectCodes(email: string, whatsapp: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("project_code, project_name")
    .eq("email", email)
    .eq("whatsapp", whatsapp);

  if (error || !data || data.length === 0) return { success: false, error: "No projects found matching these details." };
  return { success: true, projects: data };
}

export async function getProjectByCode(projectCode: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_files(*), payment_records(*), invoices(*)")
    .eq("project_code", projectCode)
    .single();

  if (error || !data) return null;
  return data;
}

// ── Admin Actions ──

export async function getAllProjects() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_files(*), payment_records(*), invoices(*)")
    .order("created_at", { ascending: false });

  if (error) { console.error("Error:", error); return []; }
  return data;
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus, progress: number) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("projects").update({ status, progress }).eq("id", projectId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateAdminNotes(projectId: string, notes: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("projects").update({ admin_notes: notes }).eq("id", projectId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateProjectPayment(projectId: string, finalPrice: number, paymentStatus: PaymentStatus, currency: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("projects").update({ 
    final_price: finalPrice, 
    payment_status: paymentStatus,
    currency: currency 
  }).eq("id", projectId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateProjectLogo(projectId: string, logoUrl: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("projects").update({ logo_url: logoUrl }).eq("id", projectId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function addPaymentRecord(projectId: string, amount: number, method: string, note: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("payment_records")
    .insert({ project_id: projectId, amount, method, note })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, record: data };
}

export async function deletePaymentRecord(recordId: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("payment_records").delete().eq("id", recordId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function uploadInvoice(projectId: string, formData: FormData, amount: number, paymentId?: string) {
  const supabase = await createAdminClient();
  const file = formData.get("file") as File;
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `invoices/${projectId}/${fileName}`;

  const { error: uploadError } = await supabase.storage.from("project-files").upload(filePath, file);
  if (uploadError) return { success: false, error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage.from("project-files").getPublicUrl(filePath);

  const { data, error } = await supabase.from("invoices").insert({
    project_id: projectId,
    payment_id: paymentId || null,
    file_url: publicUrl,
    file_name: file.name,
    amount: amount
  }).select().single();

  if (error) return { success: false, error: error.message };
  return { success: true, invoice: data };
}

export async function deleteInvoice(invoiceId: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("invoices").delete().eq("id", invoiceId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteProject(projectId: string) {
  const supabase = await createAdminClient();
  await supabase.from("invoices").delete().eq("project_id", projectId);
  await supabase.from("payment_records").delete().eq("project_id", projectId);
  await supabase.from("project_files").delete().eq("project_id", projectId);
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
