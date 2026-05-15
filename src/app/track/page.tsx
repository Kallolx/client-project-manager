"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { trackProject } from "@/lib/actions";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface TrackFormData {
  email: string;
  project_code: string;
}

export default function TrackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<TrackFormData>();

  const onSubmit = async (data: TrackFormData) => {
    setLoading(true);
    try {
      const result = await trackProject(data.email, data.project_code.toUpperCase());
      if (result.success) {
        router.push(`/client/${data.project_code.toUpperCase()}`);
      } else {
        toast.error(result.error || "Project not found");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Track Your Project</h1>
            <p className="text-muted-foreground">Enter your email and project code to view progress</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" className="bg-input/50 border-border h-11"
                {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} />
              {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="project_code">Project Code</Label>
                <Link href="/forgot-id" className="text-xs text-primary hover:underline">Forgot your code?</Link>
              </div>
              <Input id="project_code" placeholder="KAL-XXXX" className="bg-input/50 border-border h-11 uppercase font-mono tracking-wider"
                {...register("project_code", { required: "Project code is required", pattern: { value: /^KAL-[A-Z0-9]{4}$/i, message: "Format: KAL-XXXX" } })} />
              {errors.project_code && <p className="text-destructive text-xs">{errors.project_code.message}</p>}
            </div>
            <Button type="submit" className="w-full h-11 gap-2" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Searching...</> : <><Search className="w-4 h-4" />Track Project</>}
            </Button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
