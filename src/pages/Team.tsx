
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Mail, ShieldCheck, ShieldAlert, Pencil, Trash2, Users, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Editor" | "Viewer";
  status: "Active" | "Pending" | "Inactive";
  avatarUrl?: string;
  dateAdded: string;
  permissions: string[];
}

const Team = () => {
  const { toast } = useToast();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("");
  const [activeView, setActiveView] = useState<"members" | "roles">("members");
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Jane Smith",
      email: "jane@company.com",
      role: "Admin",
      status: "Active",
      avatarUrl: "",
      dateAdded: "2023-04-12",
      permissions: ["Full access", "Catalog management", "Royalty reporting", "User management"]
    },
    {
      id: "2",
      name: "John Doe",
      email: "john@company.com",
      role: "Manager",
      status: "Active",
      avatarUrl: "",
      dateAdded: "2023-05-20",
      permissions: ["Catalog management", "Metadata editing", "Asset uploads", "Royalty reporting"]
    },
    {
      id: "3",
      name: "Sarah Wilson",
      email: "sarah@company.com",
      role: "Editor",
      status: "Active",
      avatarUrl: "",
      dateAdded: "2023-06-15",
      permissions: ["Metadata editing", "Asset uploads", "View royalties"]
    },
    {
      id: "4",
      name: "Mike Johnson",
      email: "mike@company.com",
      role: "Viewer",
      status: "Pending",
      avatarUrl: "",
      dateAdded: "2023-07-01",
      permissions: ["View metadata", "View assets", "View royalties"]
    }
  ]);
  
  useEffect(() => {
    document.title = "Tuneator - Team Management";
  }, []);
  
  const handleInvite = () => {
    if (!email || !role) {
      toast({
        title: "Missing Information",
        description: "Please provide an email and select a role",
        variant: "destructive",
      });
      return;
    }
    
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role: role as any,
      status: "Pending",
      dateAdded: new Date().toISOString().split('T')[0],
      permissions: getRolePermissions(role as any)
    };
    
    setMembers([...members, newMember]);
    setShowInviteDialog(false);
    setEmail("");
    setRole("");
    
    toast({
      title: "Invitation Sent",
      description: `An invitation has been sent to ${email}`,
    });
  };
  
  const getRolePermissions = (role: string): string[] => {
    switch (role) {
      case "Admin":
        return ["Full access", "Catalog management", "Royalty reporting", "User management"];
      case "Manager":
        return ["Catalog management", "Metadata editing", "Asset uploads", "Royalty reporting"];
      case "Editor":
        return ["Metadata editing", "Asset uploads", "View royalties"];
      case "Viewer":
        return ["View metadata", "View assets", "View royalties"];
      default:
        return [];
    }
  };
  
  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "Manager":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Editor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Viewer":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "";
    }
  };
  
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "";
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
              <div>
                <h1 className="text-2xl font-bold">Team Management</h1>
                <p className="text-muted-foreground">Manage team members and access permissions</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={activeView === "members" ? "default" : "outline"}
                  onClick={() => setActiveView("members")}
                  className={activeView === "members" ? "bg-electric hover:bg-electric/90" : ""}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Team Members
                </Button>
                <Button
                  variant={activeView === "roles" ? "default" : "outline"}
                  onClick={() => setActiveView("roles")}
                  className={activeView === "roles" ? "bg-electric hover:bg-electric/90" : ""}
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Roles & Permissions
                </Button>
                <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-mint hover:bg-mint/90">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Team Member</DialogTitle>
                      <DialogDescription>
                        Send an invitation to a new team member to collaborate on your catalog.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="colleague@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={role} onValueChange={setRole}>
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Editor">Editor</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {role && (
                        <div className="rounded-md bg-muted p-4">
                          <h4 className="text-sm font-medium mb-2">This role has the following permissions:</h4>
                          <ul className="text-xs space-y-1">
                            {getRolePermissions(role).map((permission) => (
                              <li key={permission} className="flex items-center gap-2">
                                <ShieldCheck className="h-3.5 w-3.5 text-mint" />
                                {permission}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleInvite} className="bg-mint hover:bg-mint/90">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Invitation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {activeView === "members" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Added</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={member.avatarUrl} />
                                <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">{member.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getRoleBadgeStyles(member.role)}>
                              {member.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeStyles(member.status)}>
                              {member.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{member.dateAdded}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="roles" className="space-y-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="roles">Role Definitions</TabsTrigger>
                  <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
                </TabsList>
                
                <TabsContent value="roles" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-red-500" />
                        Admin Role
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Administrators have full access to all features and settings within the application. 
                        They can manage users, catalog, royalties, and all system settings.
                      </p>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Permissions:</h4>
                        <ul className="text-sm space-y-1">
                          {getRolePermissions("Admin").map((permission) => (
                            <li key={permission} className="flex items-center gap-2">
                              <ShieldCheck className="h-3.5 w-3.5 text-mint" />
                              {permission}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-purple-500" />
                        Manager Role
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Managers can manage the catalog, edit metadata, upload assets, and view royalty reports.
                        They cannot manage users or system settings.
                      </p>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Permissions:</h4>
                        <ul className="text-sm space-y-1">
                          {getRolePermissions("Manager").map((permission) => (
                            <li key={permission} className="flex items-center gap-2">
                              <ShieldCheck className="h-3.5 w-3.5 text-mint" />
                              {permission}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-blue-500" />
                          Editor Role
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Editors can edit metadata, upload assets, and view royalty data.
                          They cannot manage users, system settings, or the catalog structure.
                        </p>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Permissions:</h4>
                          <ul className="text-sm space-y-1">
                            {getRolePermissions("Editor").map((permission) => (
                              <li key={permission} className="flex items-center gap-2">
                                <ShieldCheck className="h-3.5 w-3.5 text-mint" />
                                {permission}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-green-500" />
                          Viewer Role
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Viewers have read-only access to metadata, assets, and royalty information.
                          They cannot make any changes to the data.
                        </p>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Permissions:</h4>
                          <ul className="text-sm space-y-1">
                            {getRolePermissions("Viewer").map((permission) => (
                              <li key={permission} className="flex items-center gap-2">
                                <ShieldCheck className="h-3.5 w-3.5 text-mint" />
                                {permission}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="permissions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Permission Matrix</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[180px]">Permission</TableHead>
                              <TableHead className="text-center">Admin</TableHead>
                              <TableHead className="text-center">Manager</TableHead>
                              <TableHead className="text-center">Editor</TableHead>
                              <TableHead className="text-center">Viewer</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              { name: "Manage Users", admin: true, manager: false, editor: false, viewer: false },
                              { name: "Manage Roles", admin: true, manager: false, editor: false, viewer: false },
                              { name: "Manage Catalog", admin: true, manager: true, editor: false, viewer: false },
                              { name: "Edit Metadata", admin: true, manager: true, editor: true, viewer: false },
                              { name: "Upload Assets", admin: true, manager: true, editor: true, viewer: false },
                              { name: "Delete Assets", admin: true, manager: true, editor: false, viewer: false },
                              { name: "View Royalties", admin: true, manager: true, editor: true, viewer: true },
                              { name: "Export Reports", admin: true, manager: true, editor: false, viewer: false },
                              { name: "System Settings", admin: true, manager: false, editor: false, viewer: false },
                              { name: "API Access", admin: true, manager: true, editor: false, viewer: false },
                            ].map((permission, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{permission.name}</TableCell>
                                <TableCell className="text-center">
                                  {permission.admin ? (
                                    <ShieldCheck className="h-4 w-4 text-mint mx-auto" />
                                  ) : (
                                    <ShieldAlert className="h-4 w-4 text-muted-foreground mx-auto" />
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  {permission.manager ? (
                                    <ShieldCheck className="h-4 w-4 text-mint mx-auto" />
                                  ) : (
                                    <ShieldAlert className="h-4 w-4 text-muted-foreground mx-auto" />
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  {permission.editor ? (
                                    <ShieldCheck className="h-4 w-4 text-mint mx-auto" />
                                  ) : (
                                    <ShieldAlert className="h-4 w-4 text-muted-foreground mx-auto" />
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  {permission.viewer ? (
                                    <ShieldCheck className="h-4 w-4 text-mint mx-auto" />
                                  ) : (
                                    <ShieldAlert className="h-4 w-4 text-muted-foreground mx-auto" />
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Team;
