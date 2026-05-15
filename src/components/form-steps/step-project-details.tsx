"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useFormStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Rocket, FileText, Target, Calendar, Palette, Globe, MessageSquare, Goal, DollarSign } from "lucide-react";

interface ProjectFormData {
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
}

export function StepProjectDetails() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      project_name: formData.project_name || "",
      project_description: formData.project_description || "",
      target_audience: formData.target_audience || "",
      main_goals: formData.main_goals || "",
      deadline: formData.deadline || "",
      expected_launch: formData.expected_launch || "",
      budget: formData.budget || "",
      brand_colors: formData.brand_colors || "",
      existing_website: formData.existing_website || "",
      notes: formData.notes || "",
    },
  });

  const [isDeadlineFocused, setIsDeadlineFocused] = useState(false);
  const deadlineValue = watch("deadline");

  const onSubmit = (data: ProjectFormData) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">The Vision</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Deep dive into the project details. The more we know, the better we can build.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="relative group">
              <Rocket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Project Name"
                className={`pl-10 h-12 bg-card/50 border-border focus:ring-1 focus:ring-primary/20 ${errors.project_name ? "border-destructive/50" : "hover:border-primary/30"}`}
                {...register("project_name", { required: "Project name is required" })}
              />
            </div>
            {errors.project_name && <p className="text-[10px] font-bold text-destructive px-1">{errors.project_name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="relative group">
              <FileText className="absolute left-3 top-4 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
              <Textarea
                placeholder="Briefly describe your project, its purpose, and core message..."
                className={`pl-10 min-h-[100px] bg-card/50 border-border focus:ring-1 focus:ring-primary/20 resize-none ${errors.project_description ? "border-destructive/50" : "hover:border-primary/30"}`}
                {...register("project_description", { required: "Description is required", minLength: { value: 10, message: "Min 10 characters" } })}
              />
            </div>
            {errors.project_description && <p className="text-[10px] font-bold text-destructive px-1">{errors.project_description.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
              <Input placeholder="Target Audience" className="pl-10 h-12 bg-card/50 border-border hover:border-primary/30" {...register("target_audience")} />
            </div>
            <div className="relative group">
              <Goal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
              <Input placeholder="Key Goals (e.g. Sales, Traffic)" className="pl-10 h-12 bg-card/50 border-border hover:border-primary/30" {...register("main_goals")} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              className="relative group cursor-pointer"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
                if (input && 'showPicker' in input) {
                  input.showPicker();
                }
              }}
            >
              <Calendar 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors z-10" 
              />
              <Input 
                type="date" 
                className={`pl-10 h-12 bg-card/50 border-border focus:ring-1 focus:ring-primary/20 hover:border-primary/30 cursor-pointer
                  ${(!deadlineValue && !isDeadlineFocused) ? "text-transparent" : "text-foreground"}`}
                {...register("deadline")}
                onFocus={() => setIsDeadlineFocused(true)}
                onBlur={(e) => {
                  register("deadline").onBlur(e);
                  setIsDeadlineFocused(false);
                }}
              />
              {!deadlineValue && !isDeadlineFocused && (
                <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                  Ideal Deadline
                </span>
              )}
            </div>
            <div className="relative group">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
              <Input placeholder="Estimated Budget Range" className="pl-10 h-12 bg-card/50 border-border hover:border-primary/30" {...register("budget")} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
              <Input placeholder="Brand Colors (Hex/Name)" className="pl-10 h-12 bg-card/50 border-border hover:border-primary/30" {...register("brand_colors")} />
            </div>
            <div className="relative group">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
              <Input placeholder="Existing Site URL" className="pl-10 h-12 bg-card/50 border-border hover:border-primary/30" {...register("existing_website")} />
            </div>
          </div>

          <div className="relative group">
            <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
            <Textarea
              placeholder="Any other notes or specific preferences?"
              className="pl-10 min-h-[80px] bg-card/50 border-border hover:border-primary/30 resize-none"
              {...register("notes")}
            />
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="ghost" onClick={prevStep} className="h-11 px-6 rounded-xl text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button type="submit" className="h-11 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

