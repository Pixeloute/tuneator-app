
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Plus, User } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  lastActive: string;
  status: "online" | "offline" | "away";
}

const Team = () => {
  useEffect(() => {
    document.title = "Tuneator - Team";
  }, []);

  const { toast } = useToast();
  
  const initialMembers: TeamMember[] = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@tuneator.com",
      role: "Admin",
      lastActive: "Just now",
      status: "online",
    },
    {
      id: "2",
      name: "Sarah Williams",
      email: "sarah@tuneator.com",
      role: "Manager",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
      lastActive: "5 minutes ago",
      status: "online",
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "michael@tuneator.com",
      role: "Editor",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
      lastActive: "3 hours ago",
      status: "away",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@tuneator.com",
      role: "Viewer",
      lastActive: "Yesterday",
      status: "offline",
    },
    {
      id: "5",
      name: "James Wilson",
      email: "james@tuneator.com",
      role: "Editor",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
      lastActive: "2 days ago",
      status: "offline",
    },
  ];
  
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "Viewer",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Error",
        description: "Name and email are required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      lastActive: "Just joined",
      status: "offline",
    };
    
    setMembers([...members, member]);
    setNewMember({
      name: "",
      email: "",
      role: "Viewer",
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Team member added",
      description: `${member.name} has been added to your team.`,
    });
  };
  
  const handleInvite = (email: string) => {
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${email}.`,
    });
  };
  
  const getStatusBadge = (status: TeamMember["status"]) => {
    switch (status) {
      case "online":
        return <Badge variant="outline" className="bg-mint/10 text-mint border-mint/20">Online</Badge>;
      case "offline":
        return <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/20">Offline</Badge>;
      case "away":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Away</Badge>;
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge className="bg-electric text-primary-foreground">Admin</Badge>;
      case "Manager":
        return <Badge className="bg-mint text-primary-foreground">Manager</Badge>;
      case "Editor":
        return <Badge variant="secondary">Editor</Badge>;
      case "Viewer":
        return <Badge variant="outline">Viewer</Badge>;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-6 space-y-6 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">Team Management</h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-electric hover:bg-electric/90 text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                    <DialogDescription>
                      Invite someone to join your Tuneator team.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newMember.role}
                        onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="bg-electric hover:bg-electric/90 text-primary-foreground"
                      onClick={handleAddMember}
                    >
                      Add Member
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <Tabs defaultValue="members">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="members">Team Members</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              <TabsContent value="members" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage your team and their access levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {members.map((member) => (
                        <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md bg-secondary/50 hover:bg-secondary transition-colors gap-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              {member.avatar && <AvatarImage src={member.avatar} />}
                              <AvatarFallback className="bg-muted">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{member.name}</h3>
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            {getRoleBadge(member.role)}
                            <span className="text-xs text-muted-foreground">{member.lastActive}</span>
                            {getStatusBadge(member.status)}
                            {member.status === "offline" && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-xs"
                                onClick={() => handleInvite(member.email)}
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                Invite
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="permissions" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Role Permissions</CardTitle>
                    <CardDescription>Configure access levels for your team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 rounded-md bg-secondary/50">
                        <h3 className="text-lg font-medium mb-2">Admin</h3>
                        <p className="text-sm text-muted-foreground mb-3">Full access to all features and settings.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          <Badge variant="outline" className="justify-start">Upload Assets</Badge>
                          <Badge variant="outline" className="justify-start">Edit Metadata</Badge>
                          <Badge variant="outline" className="justify-start">Manage Team</Badge>
                          <Badge variant="outline" className="justify-start">View Analytics</Badge>
                          <Badge variant="outline" className="justify-start">Change Settings</Badge>
                          <Badge variant="outline" className="justify-start">Delete Content</Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-md bg-secondary/50">
                        <h3 className="text-lg font-medium mb-2">Manager</h3>
                        <p className="text-sm text-muted-foreground mb-3">Can manage content and view all data.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          <Badge variant="outline" className="justify-start">Upload Assets</Badge>
                          <Badge variant="outline" className="justify-start">Edit Metadata</Badge>
                          <Badge variant="outline" className="justify-start">View Team</Badge>
                          <Badge variant="outline" className="justify-start">View Analytics</Badge>
                          <Badge variant="outline" className="justify-start">View Settings</Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-md bg-secondary/50">
                        <h3 className="text-lg font-medium mb-2">Editor</h3>
                        <p className="text-sm text-muted-foreground mb-3">Can edit content and view analytics.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          <Badge variant="outline" className="justify-start">Upload Assets</Badge>
                          <Badge variant="outline" className="justify-start">Edit Metadata</Badge>
                          <Badge variant="outline" className="justify-start">View Analytics</Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-md bg-secondary/50">
                        <h3 className="text-lg font-medium mb-2">Viewer</h3>
                        <p className="text-sm text-muted-foreground mb-3">Read-only access to content and analytics.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          <Badge variant="outline" className="justify-start">View Assets</Badge>
                          <Badge variant="outline" className="justify-start">View Metadata</Badge>
                          <Badge variant="outline" className="justify-start">View Analytics</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Team;
