import { ReactNode } from "react";
import { Header } from "@/components/header";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function CodeProctorLayout({ children }: LayoutProps) {
  return (
    <>
      {/* <Header /> */}
      <Header />
      <SidebarProvider>
        <div className="flex h-screen bg-background">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <SidebarTrigger />
            <div className="container mx-auto p-6">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}
