import { z } from "zod/v4";

export const serviceTypeSchema = z.enum([
  "landing-page",
  "business-website",
  "saas-platform",
  "full-stack-app",
  "ecommerce",
  "mobile-app",
  "ui-ux-design",
  "branding",
  "marketing",
  "other",
]);

export const clientDetailsSchema = z.object({
  client_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email"),
  whatsapp: z.string().min(5, "Please enter a valid WhatsApp number"),
  company_name: z.string().optional().default(""),
  country: z.string().min(2, "Please enter your country"),
});

export const projectDetailsSchema = z.object({
  project_name: z.string().min(2, "Project name is required"),
  project_description: z.string().min(10, "Please describe your project (at least 10 chars)"),
  target_audience: z.string().optional().default(""),
  deadline: z.string().optional().default(""),
  brand_colors: z.string().optional().default(""),
  existing_website: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

export const projectFeaturesSchema = z.object({
  project_type: z.enum([
    "landing-page",
    "dashboard",
    "saas",
    "portfolio",
    "admin-panel",
    "ecommerce",
    "blog",
  ]),
  features: z.array(z.string()).default([]),
  pages: z.number().min(1).max(100).default(1),
  design_complexity: z.enum(["simple", "moderate", "complex", "premium"]).default("moderate"),
  responsive: z.boolean().default(true),
  dark_mode: z.boolean().default(false),
});

export const pricingSchema = z.object({
  offered_price: z.number().min(0, "Please enter your budget"),
});

export const trackProjectSchema = z.object({
  email: z.email("Please enter a valid email"),
  project_code: z
    .string()
    .min(8, "Project code must be in format KAL-XXXX")
    .regex(/^KAL-[A-Z0-9]{4}$/, "Invalid project code format"),
});

export const adminLoginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
