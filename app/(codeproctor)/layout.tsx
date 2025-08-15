import { ReactNode } from "react";
import Sidebar from "@/components/sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function CodeProctorLayout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
