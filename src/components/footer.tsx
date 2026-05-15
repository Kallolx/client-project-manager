"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-medium text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              kallol<span className="text-primary">.me</span>
            </span>
            <span className="text-muted-foreground text-xs">
              — Digital Solutions
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/start-project"
              className="hover:text-foreground transition-colors"
            >
              Start Project
            </Link>
            <Link
              href="/track"
              className="hover:text-foreground transition-colors"
            >
              Track Project
            </Link>
            <a
              href="https://kallol.me"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Portfolio
            </a>
          </div>

          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} kallol.me
          </p>
        </div>
      </div>
    </footer>
  );
}
