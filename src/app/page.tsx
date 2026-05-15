"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code,
  Palette,
  Rocket,
  MessageSquare,
  Star,
  Zap,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const services = [
  {
    icon: <Code className="w-5 h-5" />,
    title: "Web Development",
    desc: "Modern, fast, and scalable web applications",
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: "UI/UX Design",
    desc: "Beautiful interfaces that users love",
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: "SaaS Products",
    desc: "Full-stack SaaS from idea to launch",
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "E-commerce",
    desc: "Online stores with seamless checkout",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Mobile Apps",
    desc: "Cross-platform mobile applications",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Branding",
    desc: "Complete brand identity systems",
  },
];

const workflow = [
  {
    step: "01",
    title: "Select Service",
    desc: "Choose from our range of digital services",
  },
  {
    step: "02",
    title: "Share Details",
    desc: "Tell us about your project and vision",
  },
  {
    step: "03",
    title: "Get Estimate",
    desc: "Receive transparent pricing instantly",
  },
  {
    step: "04",
    title: "Track Progress",
    desc: "Monitor your project in real-time",
  },
];

const testimonials = [
  {
    name: "Alex Johnson",
    role: "CEO, TechCorp",
    text: "Exceptional quality and attention to detail. The project was delivered ahead of schedule.",
    rating: 5,
  },
  {
    name: "Sarah Williams",
    role: "Founder, Designly",
    text: "The best developer I've worked with. Clean code, beautiful design, and great communication.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "CTO, StartupXYZ",
    text: "Transformed our vision into reality. The SaaS platform exceeded all expectations.",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.20_0.06_250)_0%,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 text-xs text-muted-foreground mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Available for new projects
            </div>
            <div className="relative group mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-all" />
              <img
                src="/main.avif"
                alt="Kallol"
                className="relative w-24 h-24 rounded-full border-2 border-primary/30 object-cover shadow-2xl group-hover:scale-105 transition-transform"
              />
            </div>
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Build digital products
            <br />
            <span className="gradient-text">that matter</span>
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            From concept to launch — I design and develop premium web
            applications, SaaS platforms, and digital experiences for ambitious
            brands.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/start-project">
              <Button
                size="lg"
                className="gap-2 rounded-xl px-8 h-12 text-base"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/track">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-xl px-8 h-12 text-base"
              >
                Track Existing Project
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
