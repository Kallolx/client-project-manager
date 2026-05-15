"use client";

import { motion } from "framer-motion";
import { useFormStore } from "@/lib/store";
import { PROJECT_TYPES, FEATURES, DESIGN_COMPLEXITIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Minus, Plus, Sparkles, Layout, Layers, Monitor } from "lucide-react";
import type { Feature, ProjectType, DesignComplexity } from "@/lib/types";

export function StepFeatures() {
  const { formData, setProjectType, toggleFeature, setDesignComplexity, setPages, setResponsive, setDarkMode, nextStep, prevStep } = useFormStore();

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">Scope & Features</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">Define the technical DNA of your project. Select the components and style that match your vision.</p>
      </div>

      <div className="space-y-10 max-w-2xl mx-auto">
        {/* Project Type */}
        <div className="space-y-4">
          <SectionLabel label="Project Type" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PROJECT_TYPES.map((type) => (
              <button key={type.value} type="button" onClick={() => setProjectType(type.value as ProjectType)}
                className={`flex flex-col items-center justify-center h-24 px-4 rounded-xl border transition-all ${formData.project_type === type.value ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5" : "border-border bg-card hover:border-primary/30"}`}>
                <span className="text-2xl mb-2">{type.icon}</span>
                <span className="text-sm font-semibold text-center">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <SectionLabel label="Desired Features" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FEATURES.map((feature) => {
              const isChecked = formData.features?.includes(feature.value) || false;
              return (
                <button key={feature.value} type="button" onClick={() => toggleFeature(feature.value as Feature)}
                  className={`flex flex-col items-center justify-center h-24 px-4 rounded-xl border text-center transition-all ${isChecked ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:border-primary/30"}`}>
                  <span className="text-2xl mb-2">{feature.icon}</span>
                  <span className="text-sm font-semibold">{feature.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Complexity & Pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
             <SectionLabel label="Project Scale" />
             <div className="p-6 rounded-2xl border border-border bg-card/50 flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-xs font-medium text-muted-foreground">Number of Pages</p>
                   <p className="text-3xl font-bold tracking-tighter">{formData.pages || 1}</p>
                </div>
                <div className="flex gap-2">
                   <Button type="button" variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border hover:bg-muted" onClick={() => setPages(Math.max(1, (formData.pages || 1) - 1))}><Minus className="w-4 h-4" /></Button>
                   <Button type="button" variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border hover:bg-muted" onClick={() => setPages(Math.min(100, (formData.pages || 1) + 1))}><Plus className="w-4 h-4" /></Button>
                </div>
             </div>
           </div>

           <div className="space-y-4">
             <SectionLabel label="Preferences" />
             <div className="grid grid-cols-2 gap-2 h-full">
                <button type="button" onClick={() => setResponsive(!formData.responsive)}
                  className={`h-[90px] rounded-xl border text-sm font-semibold transition-all ${formData.responsive ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5" : "border-border bg-card text-muted-foreground hover:border-primary/20"}`}>
                  📱 Responsive
                </button>
                <button type="button" onClick={() => setDarkMode(!formData.dark_mode)}
                  className={`h-[90px] rounded-xl border text-sm font-semibold transition-all ${formData.dark_mode ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5" : "border-border bg-card text-muted-foreground hover:border-primary/20"}`}>
                  🌙 Dark Mode
                </button>
             </div>
           </div>
        </div>

        {/* Design Complexity */}
        <div className="space-y-4">
          <SectionLabel label="Visual Quality" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
             {DESIGN_COMPLEXITIES.map((c) => (
               <button key={c.value} type="button" onClick={() => setDesignComplexity(c.value as DesignComplexity)}
                 className={`flex flex-col justify-center min-h-[80px] p-4 rounded-xl border text-left transition-all ${formData.design_complexity === c.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:border-primary/30"}`}>
                 <span className="text-sm font-semibold mb-1">{c.label}</span>
                 <span className="text-[11px] text-muted-foreground leading-tight">{c.description}</span>
               </button>
             ))}
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="ghost" onClick={prevStep} className="h-11 px-6 rounded-xl text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button type="button" onClick={() => { if (formData.project_type) nextStep(); }} disabled={!formData.project_type} className="h-11 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-1 text-primary">
      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      <span className="text-xs font-bold tracking-widest">{label}</span>
    </div>
  );
}
