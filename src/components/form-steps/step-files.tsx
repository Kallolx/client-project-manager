"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useFormStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, CloudUpload, X, Link2, FileText, Image as ImageIcon, Globe, FileUp, Plus } from "lucide-react";

export function StepFiles() {
  const { uploadedFiles, referenceLinks, addFiles, removeFile, addReferenceLink, removeReferenceLink, nextStep, prevStep } = useFormStore();
  const [linkInput, setLinkInput] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(Array.from(e.target.files));
  };

  const handleAddLink = () => {
    if (linkInput.trim()) { addReferenceLink(linkInput.trim()); setLinkInput(""); }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4 text-blue-400" />;
    return <FileText className="w-4 h-4 text-primary" />;
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">Resources</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">Share your brand assets, design references, or relevant documents to help us understand the project better.</p>
      </div>

      <div className="space-y-8 max-w-lg mx-auto">
        {/* Upload Area */}
        <div className="space-y-4">
          <SectionLabel icon={<FileUp className="w-4 h-4"/>} label="Project Assets" />
          <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all group ${dragActive ? "border-primary bg-primary/5 shadow-inner" : "border-border bg-card/30 hover:border-primary/40 hover:bg-card/50"}`}>
            <input type="file" multiple accept="image/*,.pdf,.fig" onChange={handleFileInput} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
               <CloudUpload className="w-8 h-8 text-primary/60 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm font-bold text-foreground">Drop files here or <span className="text-primary">browse</span></p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-2">Images, PDF, Figma, Docx</p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="grid grid-cols-1 gap-2">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">{getFileIcon(file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold truncate leading-none mb-1">{file.name}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button type="button" onClick={() => removeFile(i)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reference Links */}
        <div className="space-y-4">
          <SectionLabel icon={<Globe className="w-4 h-4"/>} label="External References" />
          <div className="relative group">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              value={linkInput} 
              onChange={(e) => setLinkInput(e.target.value)} 
              placeholder="https://figma.com/..." 
              className="pl-10 pr-12 h-12 bg-card/50 border-border hover:border-primary/30"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddLink(); } }} 
            />
            <button 
               onClick={handleAddLink}
               className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-primary text-black flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
               <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {referenceLinks.length > 0 && (
            <div className="grid grid-cols-1 gap-2">
              {referenceLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card shadow-sm">
                  <Globe className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-[11px] font-bold flex-1 truncate">{link}</span>
                  <button type="button" onClick={() => removeReferenceLink(i)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="ghost" onClick={prevStep} className="h-11 px-6 rounded-xl text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button type="button" onClick={nextStep} className="h-11 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
            Continue <ArrowRight className="w-4 h-4 ml-2" />
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
