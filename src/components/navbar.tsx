"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          kallol<span className="text-primary">.me</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/track">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Track Project</span>
            </Button>
          </Link>
          <Link href="/start-project">
            <Button
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            >
              Start Project
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
