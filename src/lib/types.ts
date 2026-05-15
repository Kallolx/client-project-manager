import { z } from "zod";

// Status types
export type ProjectStatus = "under-review" | "planning" | "ui-design" | "development" | "testing" | "revision" | "completed";
export type ProjectType = "landing-page" | "dashboard" | "saas" | "portfolio" | "admin-panel" | "ecommerce" | "blog";
export type ServiceType = "landing-page" | "business-website" | "saas-platform" | "full-stack-app" | "ecommerce" | "mobile-app" | "ui-ux-design" | "branding" | "marketing" | "other";
export type DesignComplexity = "simple" | "moderate" | "complex" | "premium";
export type Feature = "authentication" | "payment-integration" | "admin-dashboard" | "cms" | "blog" | "seo" | "animations" | "multi-language" | "ai-features" | "api-integration" | "notifications" | "analytics" | "chat-system";
export type PaymentStatus = "unpaid" | "advance-paid" | "partial" | "paid" | "refunded";

// Database types
export interface Project {
  id: string;
  created_at: string;
  project_code: string;
  service_type: string;
  client_name: string;
  email: string;
  whatsapp: string;
  company_name: string;
  country: string;
  project_name: string;
  project_description: string;
  target_audience: string;
  main_goals: string;
  deadline: string;
  expected_launch: string;
  budget: string;
  brand_colors: string;
  existing_website: string;
  notes: string;
  project_type: ProjectType;
  features: Feature[];
  pages: number;
  design_complexity: DesignComplexity;
  responsive: boolean;
  dark_mode: boolean;
  reference_links: string[];
  final_price: number;
  currency: string;
  logo_url: string | null;
  payment_status: PaymentStatus;
  status: ProjectStatus;
  progress: number;
  admin_notes: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  file_url: string;
  file_type: string;
  file_name: string;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  project_id: string;
  amount: number;
  method: string;
  note: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  project_id: string;
  payment_id: string | null;
  file_url: string;
  file_name: string;
  amount: number;
  created_at: string;
}

// Form types
export const projectFormSchema = z.object({
  service_type: z.string().min(1, "Select a service"),
  client_name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  whatsapp: z.string().min(5, "WhatsApp required"),
  company_name: z.string().optional(),
  country: z.string().min(1, "Country required"),
  project_name: z.string().min(2, "Project name required"),
  project_description: z.string().min(10, "Description required"),
  target_audience: z.string().optional(),
  main_goals: z.string().optional(),
  deadline: z.string().optional(),
  expected_launch: z.string().optional(),
  budget: z.string().optional(),
  brand_colors: z.string().optional(),
  existing_website: z.string().optional(),
  notes: z.string().optional(),
  project_type: z.string(),
  features: z.array(z.string()),
  pages: z.number().min(1),
  design_complexity: z.string(),
  responsive: z.boolean(),
  dark_mode: z.boolean(),
  references: z.array(z.string()),
  files: z.array(z.any()),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
