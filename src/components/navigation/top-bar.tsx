
import { Bell, Menu, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export const TopBar = () => {
  const { toast } = useToast();

  const handleNotificationClick = () => {
    toast({
      title: "New notification",
      description: "Your 'Summer Vibes' track metadata has been improved!",
    });
  };

  return (
    <div className="flex items-center justify-between border-b border-secondary p-4 h-16">
      <div className="flex items-center gap-3">
        <SidebarTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu size={20} />
          </Button>
        </SidebarTrigger>
        <h1 className="text-xl font-bold hidden md:block">
          <span className="gradient-text">Tuneator</span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={handleNotificationClick}
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-mint rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted text-sm">
                  JD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
