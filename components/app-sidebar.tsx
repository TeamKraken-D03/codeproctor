import {
  BookOpen,
  Code,
  FileText,
  Home,
  Settings,
  Users,
  ClipboardCheck,
  Trophy,
  BarChart3,
  User,
  Shield,
  Calendar,
  MessageSquare,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

// Mock user data - replace with actual user context
const user = {
  name: "John Doe",
  email: "john@example.com",
  role: "student", // or "admin", "staff"
  avatar: "/avatars/john.jpg",
};

// Navigation items based on user roles
const navigationItems = {
  student: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Assignments",
      url: "/assignments",
      icon: FileText,
    },
    {
      title: "Code Editor",
      url: "/editor",
      icon: Code,
    },
    {
      title: "Submissions",
      url: "/submissions",
      icon: ClipboardCheck,
    },
    {
      title: "Grades",
      url: "/grades",
      icon: Trophy,
    },
  ],
  staff: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Courses",
      url: "/courses",
      icon: BookOpen,
    },
    {
      title: "Assignments",
      url: "/assignments",
      icon: FileText,
    },
    {
      title: "Students",
      url: "/students",
      icon: Users,
    },
    {
      title: "Evaluations",
      url: "/evaluations",
      icon: ClipboardCheck,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
  ],
  admin: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: Home,
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Course Management",
      url: "/admin/courses",
      icon: BookOpen,
    },
    {
      title: "System Settings",
      url: "/admin/settings",
      icon: Settings,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: BarChart3,
    },
    {
      title: "Security",
      url: "/admin/security",
      icon: Shield,
    },
  ],
};

const commonItems = [
  {
    title: "Schedule",
    url: "/schedule",
    icon: Calendar,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const userNavItems =
    navigationItems[user.role as keyof typeof navigationItems] || [];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {commonItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User className="size-4" />
              <span>{user.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
