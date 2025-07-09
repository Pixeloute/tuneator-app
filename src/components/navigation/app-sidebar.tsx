import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar
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
  Link as LinkIcon,
  User,
} from "lucide-react";

interface AppSidebarProps {
  className?: string;
}

const sidebarLinks = [
  { name: "Dashboard", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
  { name: "Artist Profile", path: "/artist", icon: <User className="h-5 w-5" /> },
  { name: "Catalog", path: "/catalog", icon: <Library className="h-5 w-5" /> },
  { name: "Assets", path: "/assets", icon: <ImageIcon className="h-5 w-5" /> },
  { name: "Metadata", path: "/metadata", icon: <FileText className="h-5 w-5" /> },
  { name: "Analytics", path: "/analytics", icon: <BarChart className="h-5 w-5" /> },
  { name: "Royalty Insights", path: "/insights", icon: <DollarSign className="h-5 w-5" /> },
  { name: "Pricing Engine", path: "/pricing-engine", icon: <DollarSign className="h-5 w-5" /> },
  { name: "Team", path: "/team", icon: <Users className="h-5 w-5" /> },
  { name: "AI Assistant", path: "/assistant", icon: <Bot className="h-5 w-5" /> },
  { name: "Art Generator", path: "/artwork-generator", icon: <PaintBucket className="h-5 w-5" /> },
  { name: "Sources", path: "/sources", icon: <LinkIcon className="h-5 w-5" /> },
];

export function AppSidebar({ className }: AppSidebarProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      className={className}
      data-testid="app-sidebar"
      collapsible="icon"
      data-collapsible={isCollapsed ? "icon" : ""}
    >
      <SidebarRail />
      <SidebarHeader className="border-b border-sidebar-border h-16">
        <div className="flex items-center gap-2 px-2 h-full">
          {!isCollapsed && (
            <span className="font-semibold text-lg">Tuneator</span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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
                      {!isCollapsed && <span>{link.name}</span>}
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
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
