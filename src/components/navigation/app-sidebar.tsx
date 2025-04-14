
import { 
  Album, BarChart3, FileSpreadsheet, Home, Library, Users 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

export function AppSidebar() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleInsightClick = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available in the next update.",
    });
  };

  const navItems = [
    { title: "Dashboard", icon: Home, path: "/" },
    { title: "Assets", icon: Library, path: "/assets" },
    { title: "Metadata", icon: FileSpreadsheet, path: "/metadata" },
    { title: "Catalog", icon: Album, path: "/catalog" },
    { title: "Analytics", icon: BarChart3, path: "/analytics" },
    { title: "Team", icon: Users, path: "/team" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-2xl font-bold gradient-text">Tuneator</h1>
        <p className="text-xs text-muted-foreground">Metadata & Asset Manager</p>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.path)}
                    className={location.pathname === item.path ? "bg-muted" : ""}
                  >
                    <item.icon className={`h-5 w-5 ${location.pathname === item.path ? 'text-electric' : ''}`} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="bg-muted/30 p-3 rounded-md">
          <h4 className="font-medium text-sm mb-1 flex items-center">
            <span className="h-2 w-2 bg-mint rounded-full mr-2 animate-pulse-glow"></span>
            Insight Pulse
          </h4>
          <p className="text-xs text-muted-foreground">Metadata for 'Midnight Vibes' needs attention</p>
          <button 
            className="text-xs text-electric mt-2 hover:underline"
            onClick={handleInsightClick}
          >
            View Details →
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
