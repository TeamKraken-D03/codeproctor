"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Users,
  Home,
  BookOpen,
  GraduationCap,
  Building,
  School,
  Presentation,
} from "lucide-react";
import { ModeToggle } from "./mode-toggle";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
  },
  {
    label: "Problems",
    href: "/problems",
    icon: BookOpen,
  },
  {
    label: "Semesters",
    href: "/semesters",
    icon: GraduationCap,
  },
  {
    label: "Departments",
    href: "/departments",
    icon: Building,
  },
  {
    label: "Sections",
    href: "/sections",
    icon: Presentation,
  },
];

export default function Sidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="w-64 bg-card border-r border-border h-screen">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
          CodeProctor <ModeToggle />
        </h2>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground">
            {session?.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-medium text-card-foreground">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs">
              {session?.user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
