"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { motion } from "framer-motion";
import { useFormStore } from "@/lib/store";
import { SERVICE_TYPES, PROJECT_TYPES, FEATURES, DESIGN_COMPLEXITIES } from "@/lib/constants";
import { submitProject, uploadProjectFile, updateProjectLogo } from "@/lib/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Send, Loader2, Check, User, Briefcase, Sparkles, FileUp, Zap, ChevronRight, Copy, FileText, Globe } from "lucide-react";
import { toast } from "sonner";

export function StepReview() {
  const { formData, uploadedFiles, logoFile, referenceLinks, isSubmitting, setIsSubmitting, setProjectCode, prevStep } = useFormStore();
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

      const projectId = result.projectId as string;

      // 1. Handle Logo Upload first
      if (logoFile) {
        const logoFd = new FormData();
        logoFd.append("file", logoFile);
        const logoResult = await uploadProjectFile(projectId, logoFd);
        if (logoResult.success && logoResult.url) {
          // Explicitly update logo_url for the project
          await updateProjectLogo(projectId, logoResult.url);
        }
      }

      // 2. Handle other project files
      if (uploadedFiles.length > 0) {
        toast.info(`Uploading ${uploadedFiles.length} project asset(s)...`);
        for (const file of uploadedFiles) {
          const fd = new FormData();
          fd.append("file", file);
          await uploadProjectFile(projectId, fd).catch(e => console.error("Asset upload error:", e));
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
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center py-10 px-4">
        <div className="relative inline-block mb-10">
           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto relative z-10 shadow-[0_0_20px_rgba(var(--primary),0.1)]">
            <Check className="w-10 h-10 text-primary" />
          </motion.div>
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
        </div>
        
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Project Received!</h2>
        <p className="text-muted-foreground text-sm mb-12 leading-relaxed max-w-[320px] mx-auto font-medium">
          Thank you for choosing us. We have received your project specifications and our team will review them shortly.
        </p>
        
        <div className="relative group cursor-pointer mb-10" onClick={copyCode}>
          <div className="p-8 rounded-[2rem] border border-border bg-card/30 backdrop-blur-sm shadow-xl transition-all hover:border-primary/30">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Project Reference Code</p>
            <div className="flex items-center justify-center gap-4">
               <span className="text-4xl font-bold font-mono tracking-[0.1em] text-foreground">{code}</span>
               <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                 <Copy className="w-4 h-4" />
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
             <p className="text-xs text-muted-foreground leading-relaxed">
               Please save this code to track your project progress and communicate with us.
             </p>
           </div>
           <Link href="/track" className={cn(buttonVariants({ variant: "default" }), "w-full h-12 rounded-xl font-bold group text-sm shadow-lg shadow-primary/20")}>
             Track My Project <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
             {logoFile && (
               <div className="flex justify-center mb-4">
                 <div className="p-2 rounded-2xl border border-primary/20 bg-primary/5">
                   <img src={URL.createObjectURL(logoFile)} className="w-20 h-20 object-contain rounded-xl bg-white shadow-lg" alt="Logo" />
                   <p className="text-[10px] font-bold text-primary uppercase tracking-widest text-center mt-2">Brand Logo</p>
                 </div>
               </div>
             )}
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
           <div className="space-y-6">
             <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center font-bold text-primary text-sm shadow-sm">{uploadedFiles.length + (logoFile ? 1 : 0)}</div>
                   <span className="text-xs font-semibold text-muted-foreground">Files Attached</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center font-bold text-primary text-sm shadow-sm">{referenceLinks.length}</div>
                   <span className="text-xs font-semibold text-muted-foreground">Reference Links</span>
                </div>
             </div>

             {(uploadedFiles.length > 0 || logoFile) && (
               <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-4 border-t border-border/50">
                 {logoFile && (
                   <div className="aspect-square rounded-lg border-2 border-primary/30 bg-white overflow-hidden p-1 relative group">
                     <img src={URL.createObjectURL(logoFile)} className="w-full h-full object-contain" alt="Logo" />
                     <div className="absolute inset-0 bg-primary/10" />
                   </div>
                 )}
                 {uploadedFiles.map((file, i) => (
                   <div key={i} className="aspect-square rounded-lg border border-border bg-card overflow-hidden">
                     {file.type.startsWith("image/") ? (
                       <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Asset" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center bg-muted/30">
                         <FileText className="w-5 h-5 text-muted-foreground/40" />
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             )}

             {referenceLinks.length > 0 && (
               <div className="space-y-2 pt-4 border-t border-border/50">
                 {referenceLinks.map((link, i) => (
                   <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-foreground bg-muted/20 p-2 rounded-lg truncate">
                     <Globe className="w-3 h-3 text-primary shrink-0" />
                     {link}
                   </div>
                 ))}
               </div>
             )}
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
