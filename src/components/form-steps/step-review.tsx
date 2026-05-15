"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { motion } from "framer-motion";
import { useFormStore } from "@/lib/store";
import { SERVICE_TYPES, PROJECT_TYPES, FEATURES, DESIGN_COMPLEXITIES } from "@/lib/constants";
import { submitProject, uploadProjectFile } from "@/lib/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Send, Loader2, Check, User, Briefcase, Sparkles, FileUp, Zap, ChevronRight, Copy } from "lucide-react";
import { toast } from "sonner";

export function StepReview() {
  const { formData, uploadedFiles, referenceLinks, isSubmitting, setIsSubmitting, setProjectCode, prevStep } = useFormStore();
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState("");

  const serviceLabel = SERVICE_TYPES.find((s) => s.value === formData.service_type)?.label || "";
  const projectTypeLabel = PROJECT_TYPES.find((p) => p.value === formData.project_type)?.label || "";
  const selectedFeatures = FEATURES.filter((f) => formData.features?.includes(f.value));
  const complexityLabel = DESIGN_COMPLEXITIES.find((d) => d.value === formData.design_complexity)?.label || "";

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitProject({
        ...formData,
        references: referenceLinks,
      } as any);

      if (!result.success) { 
        toast.error(result.error || "Failed to create project"); 
        setIsSubmitting(false); 
        return; 
      }

      // Handle file uploads as secondary actions
      if (result.projectId && uploadedFiles.length > 0) {
        toast.info(`Uploading ${uploadedFiles.length} file(s)...`);
        
        // Upload one by one to avoid overwhelming the server action
        for (const file of uploadedFiles) {
          const fd = new FormData();
          fd.append("file", file);
          try {
            const uploadResult = await uploadProjectFile(result.projectId as string, fd);
            if (!uploadResult.success) {
              console.error("File upload failed:", uploadResult.error);
            }
          } catch (e) {
            console.error("Upload error:", e);
          }
        }
      }

      setProjectCode(result.projectCode!);
      setCode(result.projectCode!);
      setSubmitted(true);
      toast.success("Project submitted successfully!");
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto text-center py-10 px-4">
        <div className="relative inline-block mb-8">
           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center mx-auto relative z-10">
            <Check className="w-12 h-12 text-primary" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        </div>
        
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Mission Initiated!</h2>
        <p className="text-muted-foreground text-sm mb-10 leading-relaxed max-w-[280px] mx-auto">Your project request has been received. We&apos;ll review the details and get back to you shortly.</p>
        
        <div className="relative group cursor-pointer mb-8" onClick={copyCode}>
          <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-8 rounded-3xl border border-primary/30 bg-card/50 backdrop-blur shadow-2xl">
            <p className="text-xs font-semibold text-muted-foreground tracking-widest mb-4">Project Tracking Code</p>
            <div className="flex items-center justify-center gap-4">
               <span className="text-4xl font-bold font-mono tracking-widest text-foreground">{code}</span>
               <Copy className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
           <p className="text-xs text-muted-foreground px-8 leading-relaxed italic">&quot;Use this code to track your project progress and communicate with the team at /track.&quot;</p>
           <Link href="/track" className={cn(buttonVariants({ variant: "default" }), "w-full h-12 rounded-xl font-bold group text-sm")}>
             Track Progress <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">Ready for Launch?</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto px-4">Double check all your information. We build based on these exact specifications.</p>
      </div>

      <div className="max-w-xl mx-auto space-y-6 px-4">
        <ReviewSection title="Client Contact">
          <div className="grid grid-cols-2 gap-6">
             <ReviewItem label="Name" value={formData.client_name || ""} />
             <ReviewItem label="Country" value={formData.country || ""} />
             <ReviewItem label="Email" value={formData.email || ""} />
             <ReviewItem label="WhatsApp" value={formData.whatsapp || ""} />
          </div>
        </ReviewSection>

        <ReviewSection title="Project Blueprint">
          <div className="space-y-6">
             <ReviewItem label="Project Name" value={formData.project_name || ""} full />
             <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Project Brief</p>
                <p className="text-sm text-foreground leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/50">{formData.project_description}</p>
             </div>
             <div className="grid grid-cols-2 gap-6 pt-2">
                <ReviewItem label="Service" value={serviceLabel} />
                <ReviewItem label="Type" value={projectTypeLabel} />
             </div>
          </div>
        </ReviewSection>

        <ReviewSection title="Scope & Specifications">
           <div className="grid grid-cols-2 gap-6 mb-6">
              <ReviewItem label="Total Pages" value={String(formData.pages || 1)} />
              <ReviewItem label="Complexity" value={complexityLabel} />
              <ReviewItem label="Responsive" value={formData.responsive ? "Optimized" : "Desktop only"} />
              <ReviewItem label="Site Mode" value={formData.dark_mode ? "Dark Mode" : "Light Mode"} />
           </div>
           {selectedFeatures.length > 0 && (
             <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                {selectedFeatures.map((f) => (
                  <span key={f.value} className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                    {f.label}
                  </span>
                ))}
             </div>
           )}
        </ReviewSection>

        <ReviewSection title="Assets & Links">
           <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center font-bold text-primary text-sm shadow-sm">{uploadedFiles.length}</div>
                 <span className="text-xs font-semibold text-muted-foreground">Files Attached</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center font-bold text-primary text-sm shadow-sm">{referenceLinks.length}</div>
                 <span className="text-xs font-semibold text-muted-foreground">Reference Links</span>
              </div>
           </div>
        </ReviewSection>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-10 pb-20">
          <Button type="button" variant="ghost" onClick={prevStep} className="h-12 px-8 rounded-xl text-muted-foreground hover:text-foreground order-2 sm:order-1">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="h-12 px-10 rounded-xl font-bold shadow-xl shadow-primary/20 min-w-[180px] order-1 sm:order-2">
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : <><Send className="w-4 h-4 mr-2" /> Confirm & Launch</>}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm space-y-6">
      <div className="flex items-center gap-2 text-primary mb-2">
         <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
         <span className="text-xs font-bold tracking-widest">{title}</span>
      </div>
      {children}
    </div>
  );
}

function ReviewItem({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`${full ? "col-span-2" : ""} space-y-1.5`}>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground break-words">{value}</p>
    </div>
  );
}
