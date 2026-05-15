import type { ServiceType, ProjectType, Feature, DesignComplexity, ProjectStatus, PaymentStatus } from "./types";

export const SERVICE_TYPES: { value: ServiceType; label: string; icon: string; description: string }[] = [
  { value: "landing-page", label: "Landing Page", icon: "🚀", description: "Single page to showcase your product" },
  { value: "business-website", label: "Business Website", icon: "🏢", description: "Multi-page professional website" },
  { value: "saas-platform", label: "SaaS Platform", icon: "⚡", description: "Full software-as-a-service product" },
  { value: "full-stack-app", label: "Full Stack Application", icon: "🔧", description: "Complete web application" },
  { value: "ecommerce", label: "E-commerce", icon: "🛒", description: "Online store with payments" },
  { value: "mobile-app", label: "Mobile App", icon: "📱", description: "iOS & Android application" },
  { value: "ui-ux-design", label: "UI/UX Design", icon: "🎨", description: "User interface & experience design" },
  { value: "branding", label: "Branding", icon: "✨", description: "Logo, brand identity & guidelines" },
  { value: "marketing", label: "Marketing", icon: "📈", description: "Digital marketing & SEO" },
  { value: "other", label: "Other", icon: "💡", description: "Custom project request" },
];

export const PROJECT_TYPES: { value: ProjectType; label: string; icon: string }[] = [
  { value: "landing-page", label: "Landing Page", icon: "📄" },
  { value: "dashboard", label: "Dashboard", icon: "📊" },
  { value: "saas", label: "SaaS", icon: "☁️" },
  { value: "portfolio", label: "Portfolio", icon: "🖼️" },
  { value: "admin-panel", label: "Admin Panel", icon: "🛠️" },
  { value: "ecommerce", label: "E-commerce", icon: "🛍️" },
  { value: "blog", label: "Blog", icon: "✍️" },
];

export const FEATURES: { value: Feature; label: string; icon: string }[] = [
  { value: "authentication", label: "Auth & Users", icon: "🔐" },
  { value: "payment-integration", label: "Payments", icon: "💳" },
  { value: "admin-dashboard", label: "Admin Panel", icon: "⚙️" },
  { value: "cms", label: "Content CMS", icon: "📝" },
  { value: "blog", label: "Blog System", icon: "📰" },
  { value: "seo", label: "SEO Optimized", icon: "🔍" },
  { value: "animations", label: "Premium Effects", icon: "✨" },
  { value: "multi-language", label: "Multi-language", icon: "🌐" },
  { value: "ai-features", label: "AI Integration", icon: "🤖" },
  { value: "api-integration", label: "External API", icon: "🔌" },
  { value: "notifications", label: "Notifications", icon: "🔔" },
  { value: "analytics", label: "Analytics", icon: "📈" },
  { value: "chat-system", label: "Real-time Chat", icon: "💬" },
];

export const DESIGN_COMPLEXITIES: { value: DesignComplexity; label: string; description: string }[] = [
  { value: "simple", label: "Simple", description: "Clean & Minimal" },
  { value: "moderate", label: "Moderate", description: "Custom UI Elements" },
  { value: "complex", label: "Complex", description: "Advanced Interactions" },
  { value: "premium", label: "Premium", description: "Best-in-class Design" },
];

export const PROJECT_STATUSES: { value: ProjectStatus; label: string; color: string }[] = [
  { value: "under-review", label: "Under Review", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { value: "planning", label: "Planning", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "ui-design", label: "UI Design", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { value: "development", label: "Development", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { value: "testing", label: "Testing", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { value: "revision", label: "Revision", color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
  { value: "completed", label: "Completed", color: "bg-green-500/20 text-green-400 border-green-500/30" },
];

export const PAYMENT_STATUSES: { value: PaymentStatus; label: string; color: string }[] = [
  { value: "unpaid", label: "Unpaid", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { value: "advance-paid", label: "Advance Paid", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "partial", label: "Partially Paid", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { value: "paid", label: "Paid", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "refunded", label: "Refunded", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
];

export const STATUS_PROGRESS: Record<ProjectStatus, number> = {
  "under-review": 5,
  "planning": 15,
  "ui-design": 30,
  "development": 60,
  "testing": 80,
  "revision": 90,
  "completed": 100,
};

export const FORM_STEPS = [
  { id: 1, title: "Service", description: "Select service type" },
  { id: 2, title: "Details", description: "Your information" },
  { id: 3, title: "Project", description: "Project details" },
  { id: 4, title: "Features", description: "Type & features" },
  { id: 5, title: "Files", description: "References & files" },
  { id: 6, title: "Review", description: "Review & submit" },
];
