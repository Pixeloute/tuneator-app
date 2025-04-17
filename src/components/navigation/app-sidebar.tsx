
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
  SidebarRail
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Library,
  BarChart,
  FileText,
  Users,
  Image as ImageIcon,
  PaintBucket,
  Bot,
  DollarSign,
  Settings,
  LogOut,
} from "lucide-react";

interface AppSidebarProps {
  className?: string;
}

const sidebarLinks = [
  { name: "Dashboard", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
  { name: "Catalog", path: "/catalog", icon: <Library className="h-5 w-5" /> },
  { name: "Assets", path: "/assets", icon: <ImageIcon className="h-5 w-5" /> },
  { name: "Metadata", path: "/metadata", icon: <FileText className="h-5 w-5" /> },
  { name: "Analytics", path: "/analytics", icon: <BarChart className="h-5 w-5" /> },
  { name: "Royalty Insights", path: "/insights", icon: <DollarSign className="h-5 w-5" /> },
  { name: "Team", path: "/team", icon: <Users className="h-5 w-5" /> },
  { name: "AI Assistant", path: "/assistant", icon: <Bot className="h-5 w-5" /> },
  { name: "Art Generator", path: "/artwork-generator", icon: <PaintBucket className="h-5 w-5" /> },
];

export function AppSidebar({ className }: AppSidebarProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <Sidebar className={className}>
      <SidebarRail />
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-lg">Tuneator</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarLinks.map((link) => (
                <SidebarMenuItem key={link.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === link.path}
                    tooltip={link.name}
                  >
                    <Link to={link.path}>
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenuButton asChild tooltip="Sign Out">
          <button onClick={() => signOut()} className="w-full">
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </SidebarMenuButton>
        <div className="text-xs text-muted-foreground mt-2 text-center">
          © {new Date().getFullYear()} Tuneator
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
