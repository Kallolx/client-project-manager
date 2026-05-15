"use client";

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProjects, updateProjectStatus, updateAdminNotes, updateProjectPayment, deleteProject, addPaymentRecord, deletePaymentRecord, uploadInvoice, deleteInvoice, updateProjectLogo, uploadProjectFile } from "@/lib/actions";
import { PROJECT_STATUSES, PAYMENT_STATUSES, SERVICE_TYPES, DESIGN_COMPLEXITIES } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, LayoutDashboard, Clock, CheckCircle2, AlertCircle, Loader2, Trash2, Save, X, RefreshCw, DollarSign, ExternalLink, FileText, User, Globe, MessageSquare, Phone, Upload, Image as ImageIcon, Receipt, Plus, ArrowLeft, History, Target, Zap, Layout, ListChecks, Calendar, Moon, Sun, Download, Users, Briefcase, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import type { Project, ProjectFile, ProjectStatus, PaymentStatus, PaymentRecord, Invoice } from "@/lib/types";

type ProjectWithFiles = Project & { project_files: ProjectFile[]; payment_records: PaymentRecord[]; invoices: Invoice[] };

function WhatsAppLink({ phone, name }: { phone: string; name: string }) {
  const msg = encodeURIComponent(`Hi ${name}, I'm reaching out about your project.`);
  return (
    <a href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${msg}`} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold hover:bg-[#25D366]/20 transition-all">
      <Phone className="w-3 h-3" /> Chat
    </a>
  );
}

export function AdminDashboardClient({ initialProjects }: { initialProjects: ProjectWithFiles[] }) {
  const [projects, setProjects] = useState<ProjectWithFiles[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [mainTab, setMainTab] = useState<"projects" | "clients">("projects");
  const [selected, setSelected] = useState<ProjectWithFiles | null>(null);
  const [tab, setTab] = useState<"details" | "manage" | "payments">("details");
  
  // Edit states
  const [editStatus, setEditStatus] = useState<ProjectStatus>("under-review");
  const [editProgress, setEditProgress] = useState(0);
  const [editNotes, setEditNotes] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editCurrency, setEditCurrency] = useState("BDT");
  const [editPayment, setEditPayment] = useState<PaymentStatus>("unpaid");
  
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Payment states
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState("");
  const [payNote, setPayNote] = useState("");
  const [addingPay, setAddingPay] = useState(false);
  
  const [uploadingInv, setUploadingInv] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  
  const logoRef = useRef<HTMLInputElement>(null);
  const rowInvRef = useRef<HTMLInputElement>(null);
  const [activePayId, setActivePayId] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return (p.project_name.toLowerCase().includes(q) || p.client_name.toLowerCase().includes(q) || p.project_code.toLowerCase().includes(q));
  });

  const clients = useMemo(() => {
    const map = new Map<string, { name: string; email: string; whatsapp: string; projects: ProjectWithFiles[]; totalSpent: number }>();
    projects.forEach(p => {
      const key = p.email.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { name: p.client_name, email: p.email, whatsapp: p.whatsapp, projects: [], totalSpent: 0 });
      }
      const c = map.get(key)!;
      c.projects.push(p);
      c.totalSpent += (p.payment_records || []).reduce((s, r) => s + Number(r.amount), 0);
    });
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [projects]);

  const stats = { 
    total: projects.length, 
    pending: projects.filter(p => p.status === "under-review").length, 
    active: projects.filter(p => !["under-review","completed"].includes(p.status)).length, 
    done: projects.filter(p => p.status === "completed").length,
    revenue: projects.reduce((s, p) => s + (p.payment_records || []).reduce((ps, r) => ps + Number(r.amount), 0), 0)
  };

  const open = (p: ProjectWithFiles) => { setSelected(p); setTab("details"); setEditStatus(p.status); setEditProgress(p.progress); setEditNotes(p.admin_notes || ""); setEditPrice(p.final_price || 0); setEditCurrency(p.currency || "BDT"); setEditPayment(p.payment_status || "unpaid"); };
  const close = () => { setSelected(null); setPreviewImg(null); };

  const handleRefresh = async () => { setRefreshing(true); const d = await getAllProjects(); setProjects(d as ProjectWithFiles[]); setRefreshing(false); toast.success("Sync complete"); };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateProjectStatus(selected.id, editStatus, editProgress);
      await updateAdminNotes(selected.id, editNotes);
      await updateProjectPayment(selected.id, editPrice, editPayment, editCurrency);
      setProjects(prev => prev.map(p => p.id === selected.id ? { ...p, status: editStatus, progress: editProgress, admin_notes: editNotes, final_price: editPrice, payment_status: editPayment, currency: editCurrency } : p));
      toast.success("Saved");
    } catch { toast.error("Error"); } finally { setSaving(false); }
  };

  const handleDeleteProject = async () => {
    if (!selected || !confirm(`Permanently delete "${selected.project_name}" and all its records?`)) return;
    setDeleting(true);
    const r = await deleteProject(selected.id);
    if (r.success) {
      setProjects(prev => prev.filter(p => p.id !== selected.id));
      setSelected(null);
      toast.success("Project deleted");
    } else {
      toast.error(r.error || "Delete failed");
    }
    setDeleting(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selected || !e.target.files?.[0]) return;
    setUploadingLogo(true);
    const fd = new FormData();
    fd.append("file", e.target.files[0]);
    const r = await uploadProjectFile(selected.id, fd);
    if (r.success && r.url) {
      await updateProjectLogo(selected.id, r.url);
      setSelected({ ...selected, logo_url: r.url });
      setProjects(prev => prev.map(p => p.id === selected.id ? { ...p, logo_url: r.url! } : p));
      toast.success("Logo updated");
    }
    setUploadingLogo(false);
  };

  const handleAddPayment = async () => {
    if (!selected || payAmount <= 0 || !payMethod) return;
    setAddingPay(true);
    const r = await addPaymentRecord(selected.id, payAmount, payMethod, payNote);
    if (r.success && r.record) {
      const recs = [...(selected.payment_records || []), r.record];
      setSelected({ ...selected, payment_records: recs });
      setProjects(prev => prev.map(p => p.id === selected.id ? { ...p, payment_records: recs } : p));
      setPayAmount(0); setPayMethod(""); setPayNote("");
      toast.success("Payment added");
    }
    setAddingPay(false);
  };

  const handleUploadInvoice = async (e: React.ChangeEvent<HTMLInputElement>, paymentId?: string) => {
    if (!selected || !e.target.files?.[0]) return;
    setUploadingInv(true);
    const fd = new FormData();
    fd.append("file", e.target.files[0]);
    const amt = paymentId ? Number((selected.payment_records || []).find(r => r.id === paymentId)?.amount || 0) : 0;
    const r = await uploadInvoice(selected.id, fd, amt, paymentId);
    if (r.success && r.invoice) {
      const invs = [...(selected.invoices || []), r.invoice];
      setSelected({ ...selected, invoices: invs });
      setProjects(prev => prev.map(p => p.id === selected.id ? { ...p, invoices: invs } : p));
      setActivePayId(null);
      toast.success("Invoice linked");
    }
    setUploadingInv(false);
  };

  const handleDeletePayment = async (rid: string) => {
    if (!selected || !confirm("Delete this payment record?")) return;
    await deletePaymentRecord(rid);
    const recs = (selected.payment_records || []).filter(r => r.id !== rid);
    setSelected({ ...selected, payment_records: recs });
    setProjects(prev => prev.map(p => p.id === selected.id ? { ...p, payment_records: recs } : p));
    toast.success("Payment deleted");
  };

  const handleDeleteInvoice = async (iid: string) => {
    if (!selected || !confirm("Delete this invoice?")) return;
    await deleteInvoice(iid);
    const invs = (selected.invoices || []).filter(i => i.id !== iid);
    setSelected({ ...selected, invoices: invs });
    setProjects(prev => prev.map(p => p.id === selected.id ? { ...p, invoices: invs } : p));
    toast.success("Invoice deleted");
  };

  const totalPaid = (selected?.payment_records || []).reduce((s, r) => s + Number(r.amount), 0);

  if (selected) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-3 min-w-0">
              <Button variant="ghost" size="icon" onClick={close} className="rounded-full shrink-0 h-8 w-8"><ArrowLeft className="w-4 h-4"/></Button>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">{selected.project_code} • {SERVICE_TYPES.find(s => s.value === selected.service_type)?.label}</p>
                <h1 className="text-sm font-bold truncate">{selected.project_name}</h1>
              </div>
            </div>
            <WhatsAppLink phone={selected.whatsapp} name={selected.client_name} />
          </div>
        </header>

        <nav className="bg-card border-b border-border">
          <div className="max-w-5xl mx-auto px-4 flex gap-4 overflow-x-auto no-scrollbar">
            {(["details","manage","payments"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar pb-24">
          <div className="max-w-5xl mx-auto space-y-8">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-8">
                
                {tab === "details" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-8 space-y-8">
                      <div className="p-4 rounded-md border border-border bg-card space-y-4">
                        <div className="flex items-center justify-between">
                           <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2"><ImageIcon className="w-3 h-3"/> Brand Logo</h3>
                           <input ref={logoRef} type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                           <Button size="sm" variant="outline" onClick={() => logoRef.current?.click()} disabled={uploadingLogo} className="h-7 text-[9px] px-2 rounded-md">
                             {uploadingLogo ? <Loader2 className="w-3 h-3 animate-spin"/> : <Upload className="w-3 h-3 mr-1"/>} Change
                           </Button>
                        </div>
                        {selected.logo_url ? (
                          <div className="flex items-center gap-4">
                            <img src={selected.logo_url} className="w-16 h-16 rounded-md border border-border object-contain bg-white/5" />
                            <p className="text-[10px] text-muted-foreground italic">Project brand identity</p>
                          </div>
                        ) : <div className="h-16 w-16 rounded-md border-2 border-dashed border-border flex items-center justify-center"><ImageIcon className="w-6 h-6 text-muted-foreground/30" /></div>}
                      </div>

                      <div className="space-y-6">
                        <SectionHeader icon={<Target className="w-3.5 h-3.5"/>} title="Project Strategy" />
                        <div className="grid grid-cols-1 gap-4">
                           <DetailCard label="Project Description" value={selected.project_description} />
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <DetailCard label="Target Audience" value={selected.target_audience} />
                              <DetailCard label="Main Goals" value={selected.main_goals} />
                           </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <SectionHeader icon={<ListChecks className="w-3.5 h-3.5"/>} title="Technical Scope" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <DetailCard label="Service" value={SERVICE_TYPES.find(s => s.value === selected.service_type)?.label || selected.service_type} />
                           <DetailCard label="Type" value={selected.project_type} />
                           <DetailCard label="Complexity" value={DESIGN_COMPLEXITIES.find(d => d.value === selected.design_complexity)?.label || selected.design_complexity} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <DetailCard label="Budget Range" value={selected.budget || "Not Specified"} />
                           <DetailCard label="Site Mode" value={selected.dark_mode ? "Dark Mode First" : "Standard Mode"} />
                        </div>
                        <div className="p-4 rounded-md border border-border bg-card space-y-3">
                           <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Features</p>
                           <div className="flex flex-wrap gap-1.5">
                              {selected.features?.map(f => <Badge key={f} variant="secondary" className="text-[9px] font-medium capitalize rounded-sm px-2">{f.replace(/-/g, " ")}</Badge>)}
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-4 space-y-8">
                       <div className="space-y-6">
                          <SectionHeader icon={<Calendar className="w-3.5 h-3.5"/>} title="Timeline" />
                          <div className="space-y-2">
                             <CompactInfo label="Deadline" value={selected.deadline || "TBD"} />
                             <CompactInfo label="Launch" value={selected.expected_launch || "TBD"} />
                          </div>
                       </div>
                       <div className="space-y-6">
                          <SectionHeader icon={<User className="w-3.5 h-3.5"/>} title="Client Info" />
                          <div className="space-y-2">
                             <CompactInfo label="Name" value={selected.client_name} />
                             <CompactInfo label="Email" value={selected.email} />
                             <CompactInfo label="WhatsApp" value={selected.whatsapp} />
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {tab === "manage" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <SectionHeader icon={<TrendingUp className="w-3.5 h-3.5"/>} title="Status & Progress" />
                      <div className="p-6 rounded-md border border-border bg-card space-y-8">
                        <div className="space-y-3">
                           <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground"><span>Progress</span><span>{editProgress}%</span></div>
                           <Input type="range" min="0" max="100" value={editProgress} onChange={e => setEditProgress(Number(e.target.value))} className="h-6 accent-primary" />
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                           {PROJECT_STATUSES.map(s => (
                             <button key={s.value} onClick={() => setEditStatus(s.value as ProjectStatus)} className={`p-3 rounded-md border text-[11px] font-bold text-left transition-all ${editStatus === s.value ? "bg-primary text-black border-primary" : "bg-background border-border hover:border-muted-foreground"}`}>{s.label}</button>
                           ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8">
                       <div className="space-y-4">
                          <SectionHeader icon={<DollarSign className="w-3.5 h-3.5"/>} title="Financial Setup" />
                          <div className="p-6 rounded-md border border-border bg-card space-y-6">
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                   <p className="text-[10px] text-muted-foreground uppercase font-bold">Currency</p>
                                   <div className="flex gap-1">
                                      {["BDT", "USD", "EUR"].map(c => (
                                        <button key={c} onClick={() => setEditCurrency(c)} className={`flex-1 py-2 rounded-md border text-[10px] font-bold transition-all ${editCurrency === c ? "bg-primary text-black border-primary shadow-lg" : "bg-background"}`}>{c}</button>
                                      ))}
                                   </div>
                                </div>
                                <div className="space-y-2">
                                   <p className="text-[10px] text-muted-foreground uppercase font-bold">Price</p>
                                   <Input type="number" value={editPrice || ""} onChange={e => setEditPrice(Number(e.target.value))} className="h-10 rounded-md text-sm font-bold" />
                                </div>
                             </div>
                             <div className="grid grid-cols-1 gap-1.5">
                                {PAYMENT_STATUSES.map(ps => (
                                  <button key={ps.value} onClick={() => setEditPayment(ps.value as PaymentStatus)} className={`p-3 rounded-md border text-[11px] font-bold text-left transition-all ${editPayment === ps.value ? `${ps.color} border-2` : "bg-background"}`}>{ps.label}</button>
                                ))}
                             </div>
                          </div>
                       </div>
                       <div className="p-6 rounded-md border border-destructive/20 bg-destructive/5 space-y-3">
                          <p className="text-[10px] font-bold text-destructive uppercase tracking-widest flex items-center gap-2"><AlertCircle className="w-3 h-3"/> Danger Zone</p>
                          <p className="text-[10px] text-muted-foreground italic leading-relaxed">Deleting this project will permanently remove all associated payments, files, and invoices. This action cannot be undone.</p>
                          <Button variant="destructive" size="sm" onClick={handleDeleteProject} disabled={deleting} className="w-full h-10 font-bold uppercase text-[10px] tracking-widest">
                             {deleting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4 mr-2"/>} Delete Project
                          </Button>
                       </div>
                    </div>
                  </div>
                )}

                {tab === "payments" && (
                  <div className="space-y-8">
                     <div className="grid grid-cols-3 gap-3">
                        <StatBox label="Total" value={`${editCurrency} ${editPrice}`} />
                        <StatBox label="Paid" value={`${editCurrency} ${totalPaid}`} color="text-green-400" />
                        <StatBox label="Due" value={`${editCurrency} ${editPrice - totalPaid}`} color="text-red-400" />
                     </div>
                     <div className="space-y-6">
                        <SectionHeader icon={<History className="w-3.5 h-3.5" />} title="Transactions" />
                        <div className="rounded-md border border-border bg-card overflow-hidden">
                           {selected.payment_records?.length > 0 ? (
                             <table className="w-full text-[11px] text-left">
                                <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase"><tr className="font-bold"><th className="p-4">Date</th><th className="p-4">Method</th><th className="p-4 text-right">Amount</th><th className="p-4 text-center">Invoice</th><th className="p-4"></th></tr></thead>
                                <tbody className="divide-y divide-border">
                                   {selected.payment_records.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(r => {
                                     const inv = selected.invoices?.find(i => i.payment_id === r.id);
                                     return (
                                       <tr key={r.id} className="hover:bg-muted/10 transition-colors">
                                         <td className="p-4 whitespace-nowrap">{formatDate(r.created_at)}</td>
                                         <td className="p-4 font-medium">{r.method}</td>
                                         <td className="p-4 text-right font-bold text-green-400">+{formatCurrency(Number(r.amount))}</td>
                                         <td className="p-4 text-center">
                                           {inv ? (
                                             <div className="flex items-center justify-center gap-2">
                                               <a href={inv.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[9px] font-bold text-primary hover:bg-primary/10 px-2 py-0.5 rounded border border-primary/20 transition-all uppercase"><Download className="w-3 h-3"/> PDF</a>
                                               <button onClick={() => handleDeleteInvoice(inv.id)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4"/></button>
                                             </div>
                                           ) : (
                                             <button onClick={() => { setActivePayId(r.id); rowInvRef.current?.click(); }} disabled={uploadingInv} className="text-[9px] font-bold text-muted-foreground hover:text-primary flex items-center gap-1 mx-auto border border-border px-2 py-0.5 rounded hover:border-primary/30">
                                               {uploadingInv && activePayId === r.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <Upload className="w-3 h-3"/>} Link
                                             </button>
                                           )}
                                         </td>
                                         <td className="p-4 text-right">
                                           <button onClick={() => handleDeletePayment(r.id)} className="p-1 hover:bg-destructive/10 rounded-md"><Trash2 className="w-4 h-4 text-destructive"/></button>
                                         </td>
                                       </tr>
                                     );
                                   })}
                                </tbody>
                             </table>
                           ) : <p className="p-12 text-[11px] text-muted-foreground italic text-center">No transactions recorded.</p>}
                           <input ref={rowInvRef} type="file" className="hidden" onChange={(e) => activePayId && handleUploadInvoice(e, activePayId)} />
                        </div>
                        <div className="p-6 rounded-md border border-dashed border-border bg-muted/5 space-y-4">
                           <p className="text-[10px] font-bold uppercase text-primary tracking-widest">Add New Payment</p>
                           <div className="grid grid-cols-2 gap-3">
                              <Input type="number" placeholder="Amount" value={payAmount || ""} onChange={e => setPayAmount(Number(e.target.value))} className="h-10 text-sm font-bold" />
                              <Input placeholder="Method" value={payMethod} onChange={e => setPayMethod(e.target.value)} className="h-10 text-sm" />
                           </div>
                           <Input placeholder="Notes (Optional)" value={payNote} onChange={e => setPayNote(e.target.value)} className="h-10 text-sm" />
                           <Button onClick={handleAddPayment} disabled={addingPay || payAmount <= 0 || !payMethod} className="w-full h-11 font-bold text-sm">
                              {addingPay ? <Loader2 className="w-4 h-4 animate-spin"/> : <Plus className="w-4 h-4 mr-2"/>} Record Payment
                           </Button>
                        </div>
                     </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <footer className="p-4 border-t border-border bg-card/80 backdrop-blur sticky bottom-0">
           <div className="max-w-5xl mx-auto flex gap-3">
              <Button variant="outline" onClick={close} className="flex-1 h-12 text-xs font-bold uppercase">Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="flex-[2] h-12 text-xs font-bold uppercase">
                 {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Save Changes
              </Button>
           </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <header className="flex items-center justify-between">
           <h1 className="text-xl font-bold tracking-tight">Admin</h1>
           <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={refreshing} className="h-9 w-9 p-0"><RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}/></Button>
              <div className="bg-card border border-border rounded-md p-1 flex">
                 <button onClick={() => setMainTab("projects")} className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all ${mainTab === "projects" ? "bg-primary text-black" : "text-muted-foreground"}`}>Projects</button>
                 <button onClick={() => setMainTab("clients")} className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all ${mainTab === "clients" ? "bg-primary text-black" : "text-muted-foreground"}`}>Clients</button>
              </div>
           </div>
        </header>

        {mainTab === "projects" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
               <StatBoxSmall label="Projects" value={stats.total} />
               <StatBoxSmall label="Review" value={stats.pending} />
               <StatBoxSmall label="Live" value={stats.active} />
               <StatBoxSmall label="Done" value={stats.done} />
               <StatBoxSmall label="Revenue" value={`${stats.revenue.toLocaleString()}`} className="hidden md:block" />
            </div>
            <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-11 h-12 rounded-md bg-card border-border text-sm" /></div>
            <div className="grid grid-cols-1 gap-2">
               {filtered.map(p => (
                 <div key={p.id} onClick={() => open(p)} className="p-4 rounded-md border border-border bg-card flex items-center justify-between cursor-pointer hover:border-primary/50 transition-all group">
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono text-primary uppercase font-bold tracking-tighter mb-1">{p.project_code} • {p.client_name}</p>
                      <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{p.project_name}</h3>
                    </div>
                    <Badge className={`${PROJECT_STATUSES.find(s => s.value === p.status)?.color} text-[9px] rounded-sm uppercase border-none`}>{PROJECT_STATUSES.find(s => s.value === p.status)?.label}</Badge>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-11 h-12 rounded-md bg-card border-border text-sm" /></div>
             <div className="grid grid-cols-1 gap-3">
                {clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())).map((c, i) => (
                  <div key={i} className="p-6 rounded-md border border-border bg-card space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">{c.name[0]}</div>
                           <div><h3 className="text-sm font-bold">{c.name}</h3><p className="text-[10px] text-muted-foreground">{c.email}</p></div>
                        </div>
                        <div className="text-right">
                           <p className="text-[8px] font-bold text-muted-foreground uppercase mb-0.5">Total Spent</p>
                           <p className="text-sm font-bold text-green-400">{formatCurrency(c.totalSpent)}</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        {c.projects.map(p => (
                          <div key={p.id} onClick={() => open(p)} className="px-3 py-1.5 rounded-md border border-border bg-white/5 text-[9px] font-bold cursor-pointer hover:border-primary/50 transition-all">{p.project_name}</div>
                        ))}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return <div className="flex items-center gap-2 px-1"><span className="text-primary">{icon}</span><h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{title}</h3></div>;
}
function DetailCard({ label, value }: { label: string; value: string | null | undefined }) {
  return <div className="p-4 rounded-md border border-border bg-card/50 space-y-2"><p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p><p className="text-xs font-medium text-white/90 leading-relaxed whitespace-pre-wrap">{value || "Not specified"}</p></div>;
}
function CompactInfo({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div className="p-3 rounded-md border border-border bg-card/50 flex items-center justify-between gap-4"><div className="space-y-0.5"><p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">{label}</p><p className="text-[11px] font-bold">{value}</p></div>{icon && <div className="text-muted-foreground">{icon}</div>}</div>;
}
function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return <div className="p-4 rounded-md border border-border bg-card text-center shadow-sm"><p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1.5">{label}</p><p className={`text-sm font-bold tracking-tight ${color || ""}`}>{value}</p></div>;
}
function StatBoxSmall({ label, value, className }: { label: string; value: number | string; className?: string }) {
  return <div className={`p-3 rounded-md border border-border bg-card text-center shadow-sm ${className || ""}`}><p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{label}</p><p className="text-base font-bold tracking-tighter">{value}</p></div>;
}
