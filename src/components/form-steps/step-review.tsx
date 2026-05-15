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
        toast.error(result.error || "Something went wrong"); 
        setIsSubmitting(false); 
        return; 
      }

      if (result.projectId && uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const fd = new FormData();
          fd.append("file", file);
          await uploadProjectFile(result.projectId, fd);
        }
      }

      setProjectCode(result.projectCode!);
      setCode(result.projectCode!);
      setSubmitted(true);
      toast.success("Project submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit project. Please try again.");
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto text-center py-10">
        <div className="relative inline-block mb-8">
           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center mx-auto relative z-10">
            <Check className="w-12 h-12 text-primary" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        </div>
        
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Mission Initiated!</h2>
        <p className="text-muted-foreground text-sm mb-10 leading-relaxed px-4">Your project request has been received. We&apos;ll review the details and get back to you shortly.</p>
        
        <div className="relative group cursor-pointer mb-8" onClick={copyCode}>
          <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-8 rounded-3xl border border-primary/30 bg-card/50 backdrop-blur shadow-2xl">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Project Tracking Code</p>
            <div className="flex items-center justify-center gap-4">
               <span className="text-4xl font-bold font-mono tracking-[0.2em] text-foreground">{code}</span>
               <Copy className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
           <p className="text-[11px] text-muted-foreground px-8 leading-relaxed italic">&quot;Use this code to track your project progress and communicate with the team at /track.&quot;</p>
           <Link href="/track" className={cn(buttonVariants({ variant: "default" }), "w-full h-12 rounded-xl font-bold group")}>
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
        <p className="text-muted-foreground text-sm max-w-md mx-auto">Double check all your information. We build based on these exact specifications.</p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        <ReviewSection icon={<User className="w-3.5 h-3.5"/>} title="Client Contact">
          <div className="grid grid-cols-2 gap-4">
             <ReviewItem label="Name" value={formData.client_name || ""} />
             <ReviewItem label="Country" value={formData.country || ""} />
             <ReviewItem label="Email" value={formData.email || ""} />
             <ReviewItem label="WhatsApp" value={formData.whatsapp || ""} />
          </div>
        </ReviewSection>

        <ReviewSection icon={<Briefcase className="w-3.5 h-3.5"/>} title="Project Blueprint">
          <div className="space-y-4">
             <ReviewItem label="Project Name" value={formData.project_name || ""} full />
             <div className="space-y-1">
                <p className="text-[9px] font-bold text-muted-foreground uppercase">Project Brief</p>
                <p className="text-xs text-foreground leading-relaxed italic bg-muted/30 p-3 rounded-lg border border-border/50">{formData.project_description}</p>
             </div>
             <div className="grid grid-cols-2 gap-4 pt-2">
                <ReviewItem label="Service" value={serviceLabel} />
                <ReviewItem label="Type" value={projectTypeLabel} />
             </div>
          </div>
        </ReviewSection>

        <ReviewSection icon={<Zap className="w-3.5 h-3.5"/>} title="Scope & Specifications">
           <div className="grid grid-cols-2 gap-4 mb-4">
              <ReviewItem label="Total Pages" value={String(formData.pages || 1)} />
              <ReviewItem label="Complexity" value={complexityLabel} />
              <ReviewItem label="Responsive" value={formData.responsive ? "Optimized" : "Desktop only"} />
              <ReviewItem label="Site Mode" value={formData.dark_mode ? "Dark Mode" : "Light Mode"} />
           </div>
           {selectedFeatures.length > 0 && (
             <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
                {selectedFeatures.map((f) => (
                  <span key={f.value} className="text-[9px] font-bold uppercase tracking-tight px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary">
                    {f.label}
                  </span>
                ))}
             </div>
           )}
        </ReviewSection>

        <ReviewSection icon={<FileUp className="w-3.5 h-3.5"/>} title="Assets & Links">
           <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center font-bold text-primary">{uploadedFiles.length}</div>
                 <span className="text-[10px] font-bold text-muted-foreground uppercase">Files Attached</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center font-bold text-primary">{referenceLinks.length}</div>
                 <span className="text-[10px] font-bold text-muted-foreground uppercase">Ref Links</span>
              </div>
           </div>
        </ReviewSection>

        <div className="flex justify-between pt-10">
          <Button type="button" variant="ghost" onClick={prevStep} className="h-12 px-8 rounded-xl text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="h-12 px-10 rounded-xl font-bold shadow-xl shadow-primary/20 min-w-[180px]">
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : <><Send className="w-4 h-4 mr-2" /> Confirm & Launch</>}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function ReviewSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-sm space-y-4">
      <div className="flex items-center gap-2 text-primary">
         {icon}
         <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{title}</span>
      </div>
      {children}
    </div>
  );
}

function ReviewItem({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`${full ? "col-span-2" : ""} space-y-1`}>
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-xs font-bold text-foreground truncate">{value}</p>
    </div>
  );
}
