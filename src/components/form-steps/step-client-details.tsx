"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useFormStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, User, Mail, Phone, Building2, Globe } from "lucide-react";

interface ClientFormData {
  client_name: string;
  email: string;
  whatsapp: string;
  company_name: string;
  country: string;
}

export function StepClientDetails() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    defaultValues: {
      client_name: formData.client_name || "",
      email: formData.email || "",
      whatsapp: formData.whatsapp || "",
      company_name: formData.company_name || "",
      country: formData.country || "",
    },
  });

  const onSubmit = (data: ClientFormData) => {
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
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">Who are we building for?</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          We need a few basic details to personalize your experience and keep you updated.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto">
        <div className="grid grid-cols-1 gap-4">
          
          <div className="space-y-1.5">
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Your Full Name"
                className={`pl-10 h-12 bg-card/50 border-border focus:ring-1 focus:ring-primary/20 ${errors.client_name ? "border-destructive/50" : "hover:border-primary/30"}`}
                {...register("client_name", { required: "Name is required", minLength: { value: 2, message: "Min 2 characters" } })}
              />
            </div>
            {errors.client_name && <p className="text-[10px] font-bold text-destructive px-1">{errors.client_name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  className={`pl-10 h-12 bg-card/50 border-border focus:ring-1 focus:ring-primary/20 ${errors.email ? "border-destructive/50" : "hover:border-primary/30"}`}
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                />
              </div>
              {errors.email && <p className="text-[10px] font-bold text-destructive px-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="WhatsApp Number"
                  className={`pl-10 h-12 bg-card/50 border-border focus:ring-1 focus:ring-primary/20 ${errors.whatsapp ? "border-destructive/50" : "hover:border-primary/30"}`}
                  {...register("whatsapp", { required: "WhatsApp is required", minLength: { value: 5, message: "Invalid number" } })}
                />
              </div>
              {errors.whatsapp && <p className="text-[10px] font-bold text-destructive px-1">{errors.whatsapp.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Company (Optional)"
                className="pl-10 h-12 bg-card/50 border-border hover:border-primary/30"
                {...register("company_name")}
              />
            </div>
            <div className="space-y-1.5">
              <div className="relative group">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Country"
                  className={`pl-10 h-12 bg-card/50 border-border focus:ring-1 focus:ring-primary/20 ${errors.country ? "border-destructive/50" : "hover:border-primary/30"}`}
                  {...register("country", { required: "Country is required" })}
                />
              </div>
              {errors.country && <p className="text-[10px] font-bold text-destructive px-1">{errors.country.message}</p>}
            </div>
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
