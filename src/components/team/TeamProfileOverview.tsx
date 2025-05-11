import React from "react";
import type { TeamMember } from "./TeamCard";

interface TeamProfileOverviewProps {
  member: TeamMember;
}

const TeamProfileOverview: React.FC<TeamProfileOverviewProps> = ({ member }) => (
  <aside className="w-full md:w-72 bg-secondary/80 border-r border-border flex flex-col items-center py-8 px-6 gap-6 min-h-[400px]">
    {member.avatar_url ? (
      <img src={member.avatar_url} alt="avatar" className="h-24 w-24 rounded-full object-cover border-2 border-electric" />
    ) : (
      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold border-2 border-electric">
        {member.full_name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
      </div>
    )}
    <div className="text-center">
      <div className="text-2xl font-bold">{member.full_name}</div>
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="badge badge-xs bg-mint/20 text-mint">{member.role || 'Member'}</span>
        <span className="badge badge-xs bg-electric/20 text-electric">Active</span>
      </div>
    </div>
    <div className="flex flex-wrap gap-2 justify-center mt-2">
      <button className="btn btn-xs btn-mint font-semibold" title="Log a note">Log Note</button>
      <a href={`mailto:${member.email}`} className="btn btn-xs btn-secondary">Email</a>
      <button className="btn btn-xs btn-electric font-semibold" title="Assign a task">Task</button>
      <button className="btn btn-xs btn-secondary" title="Schedule meeting">Meeting</button>
    </div>
    <div className="w-full mt-6 space-y-2">
      <div className="flex items-center justify-between text-xs"><span className="font-medium">Email:</span> <span>{member.email || '-'}</span></div>
      <div className="flex items-center justify-between text-xs"><span className="font-medium">Phone:</span> <span>{member.phone || '-'}</span></div>
      <div className="flex items-center justify-between text-xs"><span className="font-medium">Company:</span> <span>{member.company || '-'}</span></div>
    </div>
  </aside>
);

export default TeamProfileOverview; 