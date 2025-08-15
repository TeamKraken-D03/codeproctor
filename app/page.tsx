"use client";

import { useSession } from "next-auth/react";
import { Header } from "@/components/header";
import { HeroContent } from "@/components/hero-content";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      <HeroContent />
    </div>
  );
}
