"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { findProjectCodes } from "@/lib/actions";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, ArrowRight, Hash, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ForgotIDPage() {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ project_code: string; project_name: string }[] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const res = await findProjectCodes(email, whatsapp);
      if (res.success) {
        setResults(res.projects!);
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success("Code copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Hash className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Recover ID</h1>
            <p className="text-muted-foreground">Verify your details to see your project codes</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-8 rounded-3xl border border-border bg-card shadow-xl shadow-primary/5">
            {!results ? (
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-input/50 h-12" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input id="whatsapp" type="tel" placeholder="+880..." value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="bg-input/50 h-12" required />
                </div>
                <Button type="submit" className="w-full h-12 gap-2" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Searching...</> : <><Search className="w-4 h-4" />Find My Projects</>}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">Found {results.length} project(s) matching your details:</p>
                  <div className="space-y-3 text-left">
                    {results.map((project) => (
                      <div key={project.project_code} className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between group">
                        <div>
                          <p className="text-xs text-primary font-bold uppercase tracking-wider mb-0.5">{project.project_name}</p>
                          <p className="text-xl font-mono font-bold tracking-widest">{project.project_code}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(project.project_code)} className="rounded-xl">
                          {copied === project.project_code ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex flex-col gap-3">
                   <Link href="/track">
                    <Button className="w-full h-12 gap-2">Go to Tracking<ArrowRight className="w-4 h-4" /></Button>
                  </Link>
                  <Button variant="ghost" onClick={() => setResults(null)} className="w-full">Search Again</Button>
                </div>
              </div>
            )}
          </motion.div>

          <p className="text-center mt-8 text-sm text-muted-foreground">
            Still having trouble? <a href="https://wa.me/your-number" className="text-primary hover:underline">Contact me on WhatsApp</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
