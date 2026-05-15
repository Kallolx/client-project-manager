"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PROJECT_STATUSES, PAYMENT_STATUSES, SERVICE_TYPES } from "@/lib/constants";
import { formatDate, getStatusIndex } from "@/lib/pricing";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, Globe, FileText, MessageSquare, Clock, CheckCircle2, CreditCard, Receipt, Download, ExternalLink, ArrowRight, Zap, Target, Layout, Code, Search, ShieldCheck, History, Image as ImageIcon } from "lucide-react";
import type { Project, ProjectFile, PaymentRecord, Invoice } from "@/lib/types";

interface Props {
  project: Project & { project_files: ProjectFile[]; payment_records: PaymentRecord[]; invoices: Invoice[] };
}

const statusSteps = [
  { value: "under-review", icon: <Search className="w-4 h-4" />, label: "Review" },
  { value: "planning", icon: <Target className="w-4 h-4" />, label: "Strategy" },
  { value: "ui-design", icon: <Layout className="w-4 h-4" />, label: "Design" },
  { value: "development", icon: <Code className="w-4 h-4" />, label: "Build" },
  { value: "testing", icon: <ShieldCheck className="w-4 h-4" />, label: "Testing" },
  { value: "revision", icon: <Zap className="w-4 h-4" />, label: "Polishing" },
  { value: "completed", icon: <CheckCircle2 className="w-4 h-4" />, label: "Launch" },
];

export function ClientDashboard({ project }: Props) {
  const currentStatusIdx = getStatusIndex(project.status);
  const statusConfig = PROJECT_STATUSES.find((s) => s.value === project.status);
  const totalPaid = (project.payment_records || []).reduce((s, r) => s + Number(r.amount), 0);
  const remaining = Math.max(0, project.final_price - totalPaid);
  const currency = project.currency || "BDT";

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Header with Logo */}
          <section>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center gap-4">
                {project.logo_url ? (
                  <img src={project.logo_url} alt="Logo" className="w-12 h-12 rounded-md border border-white/10 bg-white/5 object-contain p-1" />
                ) : (
                  <div className="w-12 h-12 rounded-md border border-dashed border-white/10 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-white/20" /></div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{project.project_code}</span>
                    <span className="text-[9px] text-white/20 uppercase font-bold">• {SERVICE_TYPES.find(s => s.value === project.service_type)?.label}</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight truncate">{project.project_name}</h1>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-md">
                 <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40"><span>Progress</span><span>{project.progress}%</span></div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} className="h-full bg-primary" /></div>
                 </div>
                 <div className="flex items-center gap-3 md:justify-center md:border-l md:border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <div><p className="text-[8px] font-bold text-white/30 uppercase">Status</p><p className="text-xs font-bold text-primary uppercase">{statusConfig?.label}</p></div>
                 </div>
                 <div className="flex items-center gap-3 md:justify-end md:border-l md:border-white/5">
                    <Clock className="w-4 h-4 text-white/20" />
                    <div><p className="text-[8px] font-bold text-white/30 uppercase">Deadline</p><p className="text-xs font-bold text-white/80">{project.deadline || "TBD"}</p></div>
                 </div>
              </div>
            </motion.div>
          </section>

          {/* Roadmap */}
          <section className="space-y-4">
             <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 px-1">Project Roadmap</h2>
             <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                {statusSteps.map((step, i) => {
                  const isDone = i <= currentStatusIdx;
                  const isCurrent = i === currentStatusIdx;
                  return (
                    <div key={step.value} className={`p-3 rounded-md border text-center transition-all ${isCurrent ? "bg-primary/5 border-primary/40" : isDone ? "bg-white/5 border-white/10 opacity-70" : "bg-transparent border-white/5 opacity-20"}`}>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center mx-auto mb-2 ${isCurrent ? "bg-primary text-black" : "bg-white/5 text-white"}`}>
                        {isDone && !isCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.icon}
                      </div>
                      <p className={`text-[8px] font-bold uppercase tracking-widest ${isCurrent ? "text-primary" : "text-white/60"}`}>{step.label}</p>
                    </div>
                  );
                })}
             </div>
          </section>

          {/* Details & Payments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {project.admin_notes && (
                <div className="p-6 rounded-md bg-primary/5 border border-primary/20 space-y-3">
                  <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Latest Update</p>
                  <p className="text-sm font-medium text-white/90 leading-relaxed italic">"{project.admin_notes}"</p>
                </div>
              )}
              <div className="p-6 rounded-md border border-white/5 bg-white/[0.01] space-y-3">
                <h3 className="text-[9px] font-bold uppercase tracking-widest text-white/20">Brief</h3>
                <p className="text-sm text-white/60 whitespace-pre-wrap leading-relaxed">{project.project_description}</p>
              </div>

              {/* Transactions History */}
              <div className="space-y-4">
                <h3 className="text-[9px] font-bold uppercase tracking-widest text-white/20 px-1 flex items-center gap-2"><History className="w-3.5 h-3.5" /> Financial History</h3>
                <div className="rounded-md border border-white/5 bg-white/[0.01] overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-white/5"><tr className="text-white/30 uppercase tracking-tighter"><th className="px-4 py-3 font-bold">Date</th><th className="px-4 py-3 font-bold">Method</th><th className="px-4 py-3 font-bold text-right">Amount</th><th className="px-4 py-3 font-bold text-center">Invoice</th></tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {(project.payment_records || []).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(r => {
                        const inv = project.invoices?.find(i => i.payment_id === r.id);
                        return (
                          <tr key={r.id} className="text-white/60 hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">{formatDate(r.created_at)}</td>
                            <td className="px-4 py-3"><span className="flex items-center gap-1.5"><CreditCard className="w-3 h-3 text-primary"/> {r.method}</span></td>
                            <td className="px-4 py-3 text-right font-bold text-white">{formatPrice(Number(r.amount))}</td>
                            <td className="px-4 py-3 text-center">
                              {inv ? (
                                <a href={inv.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
                                  <Download className="w-3 h-3" /> <span className="text-[9px] font-bold uppercase">PDF</span>
                                </a>
                              ) : <span className="text-white/10">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {(project.payment_records || []).length === 0 && <p className="p-8 text-center text-white/20 text-xs italic">No financial history yet.</p>}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {project.final_price > 0 && (
                <div className="p-6 rounded-md border border-white/5 bg-white/[0.02] space-y-6">
                   <div className="flex items-center justify-between"><h3 className="text-[9px] font-bold uppercase tracking-widest text-white/20">Finance</h3><Badge className="text-[8px] rounded-sm bg-white/5 text-white/40">{PAYMENT_STATUSES.find(ps => ps.value === project.payment_status)?.label}</Badge></div>
                   <div className="space-y-4">
                      <div className="flex justify-between items-baseline"><p className="text-[10px] text-white/30 font-bold uppercase">Paid</p><p className="text-xl font-bold">{formatPrice(totalPaid)}</p></div>
                      {remaining > 0 && <div className="flex justify-between items-baseline pt-3 border-t border-white/5"><p className="text-[10px] text-white/30 font-bold uppercase">Due</p><p className="text-sm font-bold text-red-400">{formatPrice(remaining)}</p></div>}
                   </div>
                </div>
              )}

              <div className="p-6 rounded-md border border-white/5 bg-white/[0.01] space-y-4">
                <h3 className="text-[9px] font-bold uppercase tracking-widest text-white/20">Downloads</h3>
                <div className="space-y-1">
                  {project.project_files?.map(f => (
                    <a key={f.id} href={f.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 group">
                      <FileText className="w-4 h-4 text-white/20 group-hover:text-primary" />
                      <span className="text-xs text-white/50 group-hover:text-white truncate">{f.file_name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
