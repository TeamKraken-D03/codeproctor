import { ReactNode } from "react";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app-header";

interface LayoutProps {
  children: ReactNode;
}

export default function CodeProctorLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col p-2">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
