import { useState, useEffect } from "react";
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
  SidebarRail,
  SidebarProvider
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

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

const sidebarLinks = [
  { name: "Dashboard", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
  { name: "Catalog", path: "/catalog", icon: <Library className="h-5 w-5" /> },
  { name: "Assets", path: "/assets", icon: <ImageIcon className="h-5 w-5" /> },
  { name: "Metadata", path: "/metadata", icon: <FileText className="h-5 w-5" /> },
  { name: "Analytics", path: "/analytics", icon: <BarChart className="h-5 w-5" /> },
  { name: "Royalty Insights", path: "/insights", icon: <DollarSign className="h-5 w-5" /> },
  { name: "Pricing Engine", path: "/pricing-engine", icon: <DollarSign className="h-5 w-5" /> },
  { name: "Team", path: "/team", icon: <Users className="h-5 w-5" /> },
  { name: "AI Assistant", path: "/assistant", icon: <Bot className="h-5 w-5" /> },
  { name: "Art Generator", path: "/artwork-generator", icon: <PaintBucket className="h-5 w-5" /> },
];

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    setCollapsed(stored === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  }, [collapsed]);

  return (
    <SidebarProvider>
      <Sidebar className={`fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-200 ease-in-out
      ${collapsed ? "w-[47px]" : "w-64"}`} data-testid="app-sidebar">
        <SidebarRail />
        <SidebarHeader className="border-b border-sidebar-border">
          <div className={`flex items-center gap-2 px-3 py-4 ${collapsed ? "justify-center" : "justify-start"}`}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            {!collapsed && <span className="font-semibold text-lg">Tuneator</span>}
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
                      <Link
                        to={link.path}
                        className={`group flex items-center w-full px-2 py-2 rounded-md transition-colors
                          ${collapsed ? "justify-center" : "justify-start"}
                          ${location.pathname === link.path ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}
                          focus:outline-none focus:ring-2 focus:ring-primary`}
                      >
                        <span className="flex items-center justify-center w-8 h-8">
                          {link.icon}
                        </span>
                        {!collapsed && <span className="ml-2 truncate">{link.name}</span>}
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
            <button
              onClick={() => signOut()}
              className={`flex items-center w-full px-2 py-2 rounded-md text-sm transition-colors
                ${collapsed ? "justify-center" : "justify-start"}
                hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="ml-2">Sign Out</span>}
            </button>
          </SidebarMenuButton>
          {!collapsed && (
            <div className="text-xs text-muted-foreground mt-2 text-center w-full">
              © {new Date().getFullYear()} Tuneator
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
