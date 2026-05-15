"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useFormStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, CloudUpload, X, Link2, FileText, Image as ImageIcon, Globe, FileUp, Plus } from "lucide-react";

export function StepFiles() {
  const { uploadedFiles, logoFile, referenceLinks, addFiles, removeFile, setLogoFile, addReferenceLink, removeReferenceLink, nextStep, prevStep } = useFormStore();
  const [linkInput, setLinkInput] = useState("");

  const handleLogoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setLogoFile(e.target.files[0]);
  };

  const handleAssetsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(Array.from(e.target.files));
  };

  const handleAddLink = () => {
    if (linkInput.trim()) { addReferenceLink(linkInput.trim()); setLinkInput(""); }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">Resources</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">Share your brand assets, design references, or relevant documents.</p>
      </div>

      <div className="space-y-10 max-w-xl mx-auto">
        {/* Brand Logo Section */}
        <div className="space-y-4">
          <SectionLabel icon={<ImageIcon className="w-4 h-4"/>} label="Brand Identity" />
          <div className="relative group">
            <input type="file" accept="image/*" onChange={handleLogoInput} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${logoFile ? "border-primary/50 bg-primary/5" : "border-border bg-card/30 hover:border-primary/40"}`}>
               {logoFile ? (
                 <div className="relative group/logo">
                   <img 
                     src={URL.createObjectURL(logoFile)} 
                     className="w-20 h-20 rounded-xl object-contain bg-white shadow-xl border border-border" 
                     alt="Logo Preview" 
                   />
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 bg-black/40 rounded-xl transition-opacity">
                      <p className="text-[10px] font-bold text-white">Change Logo</p>
                   </div>
                 </div>
               ) : (
                 <>
                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                     <Plus className="w-6 h-6" />
                   </div>
                   <div className="text-center">
                     <p className="text-sm font-bold">Upload Brand Logo</p>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">PNG, SVG or JPG</p>
                   </div>
                 </>
               )}
            </div>
          </div>
        </div>

        {/* Other Assets Section */}
        <div className="space-y-4">
          <SectionLabel icon={<FileUp className="w-4 h-4"/>} label="Project Assets & References" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
             <div className="relative group h-32">
                <input type="file" multiple onChange={handleAssetsInput} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="h-full rounded-2xl border-2 border-dashed border-border bg-card/30 flex flex-col items-center justify-center gap-2 group-hover:border-primary/40 group-hover:bg-card/50 transition-all">
                   <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">Add Files</span>
                </div>
             </div>

             {uploadedFiles.map((file, i) => {
               const isImage = file.type.startsWith("image/");
               return (
                 <div key={i} className="relative group h-32 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                   {isImage ? (
                     <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted/30">
                        <FileText className="w-8 h-8 text-primary/40" />
                        <span className="text-[9px] font-bold px-2 text-center truncate w-full">{file.name}</span>
                     </div>
                   )}
                   <button 
                     type="button" 
                     onClick={() => removeFile(i)} 
                     className="absolute top-1.5 right-1.5 p-1 bg-black/50 hover:bg-destructive rounded-lg text-white transition-colors z-20"
                   >
                     <X className="w-3.5 h-3.5" />
                   </button>
                 </div>
               );
             })}
          </div>
        </div>

        {/* Reference Links */}
        <div className="space-y-4">
          <SectionLabel icon={<Globe className="w-4 h-4"/>} label="Live References (Optional)" />
          <div className="relative group">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
            <Input 
              value={linkInput} 
              onChange={(e) => setLinkInput(e.target.value)} 
              placeholder="e.g. Figma, Pinterest or Live Website URL" 
              className="pl-10 pr-12 h-12 bg-card/50 border-border hover:border-primary/30 rounded-xl"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddLink(); } }} 
            />
            <button 
               onClick={handleAddLink}
               className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-primary text-black flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
               <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {referenceLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card shadow-sm max-w-full">
                <Globe className="w-3 h-3 text-primary shrink-0" />
                <span className="text-[11px] font-bold truncate max-w-[150px]">{link}</span>
                <button type="button" onClick={() => removeReferenceLink(i)} className="text-muted-foreground hover:text-destructive">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-10 pb-16">
          <Button type="button" variant="ghost" onClick={prevStep} className="h-12 px-8 rounded-xl text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button type="button" onClick={nextStep} className="h-12 px-10 rounded-xl font-bold shadow-xl shadow-primary/20">
            Next Step <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 px-1 text-primary">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}
