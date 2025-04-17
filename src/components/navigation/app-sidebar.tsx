import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
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
  HelpCircle,
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
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M3 12h18M3 6h18M3 18h18"></path>
          </svg>
          <span className="sr-only">Open sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-64 border-r">
        <SheetHeader className="text-left">
          <SheetTitle>Tuneator</SheetTitle>
          <SheetDescription>
            Manage your music, assets, and team.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 h-full">
          <div className="px-4 py-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-full items-center justify-between rounded-md">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.email}</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 opacity-50"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" forceMount className="w-48">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-4 text-sm">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="group flex items-center gap-3 rounded-md px-3 py-2 hover:bg-secondary/50"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto px-4 py-2 text-center text-xs text-muted-foreground">
            <hr className="mb-2" />
            <div>
              Powered by Vercel & Supabase
              <br />
              © {new Date().getFullYear()} Tuneator
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
