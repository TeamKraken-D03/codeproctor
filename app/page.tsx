"use client";

import { useSession } from "next-auth/react";
import { Header } from "@/components/header";
import { HeroContent } from "@/components/hero-content";

export default function HomePage() {
  return (
    <div>
      <Header />
      <HeroContent />
    </div>
  );
}
