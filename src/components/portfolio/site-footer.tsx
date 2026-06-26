"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/portfolio/theme-toggle";

function FooterRobotIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <rect x="11" y="2" width="2" height="4" rx="0.5" fill="currentColor" />
      <rect x="6" y="6" width="12" height="7" rx="2" fill="currentColor" />
      <rect x="5" y="14" width="14" height="8" rx="2" fill="currentColor" />
      <circle cx="9.5" cy="9.5" r="1.2" fill="var(--page-bg)" />
      <circle cx="14.5" cy="9.5" r="1.2" fill="var(--page-bg)" />
    </svg>
  );
}

export function SiteFooter() {
  const [year, setYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    const sync = () => setYear(new Date().getFullYear());
    sync();
    const id = window.setInterval(sync, 60 * 60 * 1000);
    const onVisible = () => {
      if (document.visibilityState === "visible") sync();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <div
      className="mt-auto flex w-full flex-col gap-1 bg-page/95 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] pt-1 backdrop-blur-md supports-[backdrop-filter]:bg-page/90"
      role="presentation"
    >
      <div className="flex w-full justify-end pr-[max(1rem,env(safe-area-inset-right))] pt-2 sm:pr-[max(1.25rem,env(safe-area-inset-right))]">
        <ThemeToggle />
      </div>

      <footer className="pt-0.5" aria-label="Site footer">
        <div className="mx-auto flex max-w-2xl flex-col gap-1.5 px-4 pt-0.5 sm:px-6">
          <div className="flex w-full justify-center sm:justify-end">
            <div
              className="flex max-w-full items-center justify-center gap-1.5 sm:justify-start"
              role="group"
              aria-label="Engineered by Humans. Coded by AI."
            >
              <span
                className="inline-flex shrink-0 items-center gap-1 text-muted"
                aria-hidden
              >
                <Heart
                  className="size-3.5 text-muted"
                  fill="currentColor"
                  stroke="none"
                  strokeWidth={0}
                />
                <FooterRobotIcon className="size-3.5 shrink-0" />
              </span>
              <p className="m-0 min-w-0 text-balance text-center text-[10px] font-medium uppercase tracking-[0.12em] text-muted sm:text-right">
                Engineered by Humans. Coded by AI.
              </p>
            </div>
          </div>
          <p className="w-full text-balance text-center text-[11px] font-medium uppercase tracking-[0.12em] text-muted sm:text-left">
            © {year} MADE BY MGN.
          </p>
        </div>
      </footer>
    </div>
  );
}
