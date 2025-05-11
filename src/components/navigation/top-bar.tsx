import { Bell, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const TopBar = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    toast({
      title: "New notification",
      description: "Your 'Summer Vibes' track metadata has been improved!",
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getInitials = () => {
    if (!user) return "?";
    
    // Try to get initials from user metadata if available
    const metadata = user.user_metadata;
    if (metadata?.first_name && metadata?.last_name) {
      return `${metadata.first_name.charAt(0)}${metadata.last_name.charAt(0)}`;
    }
    
    // Fallback to email
    return user.email ? user.email.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="flex items-center justify-between border-b border-secondary p-4 h-16" data-testid="app-topbar">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="hover:bg-accent" />
        <h1 className="text-xl font-heading hidden md:block">
          <span className="gradient-text">Tuneator</span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={handleNotificationClick}
            >
              <span className="flex items-center justify-center relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-mint rounded-full"></span>
              </span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="flex items-center justify-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-muted text-sm">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button asChild className="bg-electric hover:bg-electric/90">
            <Link to="/auth">Sign In</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
