import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, CheckCircle, XCircle } from "lucide-react";

export type TeamMember = {
  id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  tasks?: number;
  available?: boolean;
};

export const TeamMemberCard = ({ teamMember }: { teamMember: TeamMember }) => (
  <Card className="flex items-center gap-3 p-3 bg-secondary/80">
    <Avatar className="h-10 w-10">
      <AvatarImage src={teamMember.avatarUrl} alt={teamMember.name} />
      <AvatarFallback>{teamMember.name[0]}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <div className="font-medium truncate">{teamMember.name}</div>
      <div className="text-xs text-muted-foreground truncate">{teamMember.role || "Member"}</div>
      <div className="flex gap-2 mt-1">
        {teamMember.email && <a href={`mailto:${teamMember.email}`} aria-label="Email"><Mail className="h-4 w-4 text-electric" /></a>}
        {teamMember.phone && <a href={`tel:${teamMember.phone}`} aria-label="Call"><Phone className="h-4 w-4 text-mint" /></a>}
      </div>
    </div>
    <Badge variant="outline" className="ml-2">{teamMember.tasks || 0} tasks</Badge>
    {teamMember.available ? <CheckCircle className="h-5 w-5 text-mint ml-2" aria-label="Available" /> : <XCircle className="h-5 w-5 text-destructive ml-2" aria-label="Unavailable" />}
  </Card>
); 