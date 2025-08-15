"use client";

import { useSession } from "next-auth/react";
import { Shield, Users, Code } from "lucide-react";
import { ActionButtons } from "@/components/action-buttons";

export function HeroContent() {
  const { data: session } = useSession();

  return (
    <main className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
        <div className="max-w-6xl mx-auto">
          {/* Hero Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8">
            <Shield className="w-4 h-4 mr-2" />
            Secure Code Assessment Platform
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Master Code Assessment
          </h1>

          {/* Hero Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Streamline your coding assessments with our comprehensive platform.
            Manage departments, track progress, and ensure academic integrity.
          </p>

          {/* CTA Buttons - Conditional */}
          <ActionButtons />

        </div>
      </div>
    </main>
  );
}
