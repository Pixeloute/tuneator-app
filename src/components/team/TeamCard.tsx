import React from "react";

export type TeamMember = {
  id: string;
  full_name: string;
  avatar_url?: string;
  role?: string;
  email?: string;
  phone?: string;
  company?: string;
};

interface TeamCardProps {
  member: TeamMember;
  selected?: boolean;
  onClick?: () => void;
  onSelect?: (checked: boolean) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ member, selected, onClick, onSelect }) => (
  <div
    className="flex items-center gap-4 bg-secondary/80 rounded-lg shadow p-4 hover:ring-2 hover:ring-electric transition cursor-pointer"
    onClick={onClick}
    tabIndex={0}
    role="button"
  >
    <input
      type="checkbox"
      checked={!!selected}
      onChange={e => onSelect?.(e.target.checked)}
      className="mr-2 accent-electric"
      onClick={e => e.stopPropagation()}
      aria-label="Select team member"
    />
    {member.avatar_url ? (
      <img src={member.avatar_url} alt="avatar" className="h-12 w-12 rounded-full object-cover" />
    ) : (
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-xl font-extrabold text-electric">
        {member.full_name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <div className="truncate mb-1 font-medium text-white" style={{ fontSize: 20 }}>{member.full_name}</div>
      <div className="text-xs text-muted-foreground mb-1">{member.role} &bull; {member.company}</div>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="badge badge-xs bg-mint/20 text-mint">{member.email}</span>
        <span className="badge badge-xs bg-electric/20 text-electric">{member.phone}</span>
      </div>
    </div>
  </div>
);

export default TeamCard; 