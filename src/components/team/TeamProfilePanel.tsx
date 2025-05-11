import React from "react";
import ActivityTimeline, { ActivityItem } from "./ActivityTimeline";
import TaskList, { TaskItem } from "./TaskList";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import TeamProfileOverview from "./TeamProfileOverview";
import TeamProfileTabs from "./TeamProfileTabs";
import CRMModule from "./CRMModule";
import NoteDrawer from "./NoteDrawer";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface TeamProfilePanelProps {
  id: string;
}

const TeamProfilePanel: React.FC<TeamProfilePanelProps> = ({ id }) => {
  const [tab, setTab] = React.useState("Overview");
  const [tabKey, setTabKey] = React.useState(0); // for animation
  const [noteDrawerOpen, setNoteDrawerOpen] = React.useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch member
  const { data: member, isLoading: loadingMember } = useQuery({
    queryKey: ["team-member", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch activities
  const { data: activities, isLoading: loadingActivities } = useQuery<ActivityItem[]>({
    queryKey: ["team-activities", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_activities')
        .select('id, type, content, created_at')
        .eq('team_member_id', id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((a: any) => ({
        id: a.id,
        type: a.type,
        content: a.content,
        timestamp: a.created_at,
      }));
    },
    enabled: !!id,
  });

  // Fetch tasks
  const { data: tasks, isLoading: loadingTasks } = useQuery<TaskItem[]>({
    queryKey: ["team-tasks", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_tasks')
        .select('id, title, status, due_date')
        .eq('team_member_id', id)
        .order('due_date', { ascending: true });
      if (error) throw error;
      return (data || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        done: t.status === 'done',
        dueDate: t.due_date,
      }));
    },
    enabled: !!id,
  });

  if (loadingMember) return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-muted-foreground">Loading...</div>
  );
  if (!member) return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-muted-foreground">Not found</div>
  );

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="flex flex-col flex-1 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-[18rem_1fr_18rem] flex-1 min-h-0">
          {/* Left: Profile Overview */}
          <TeamProfileOverview member={member} />

          {/* Center: Tabs and Content */}
          <main className="flex flex-col h-full min-w-0 border-x border-border bg-background">
            {/* Back + Breadcrumb */}
            <div className="p-4 flex items-center justify-between border-b bg-background sticky top-0 z-10">
              <button onClick={() => navigate('/team')} className="btn btn-xs">← Back to Team</button>
              <nav className="text-xs text-muted-foreground flex gap-2 items-center">
                <a href="/team" className="hover:underline">Team</a>
                <span>/</span>
                <span className="text-foreground font-semibold">{member.full_name}</span>
              </nav>
            </div>
            {/* Tabs pinned to top */}
            <div className="sticky top-[49px] z-10 bg-background border-b border-border">
              <TeamProfileTabs
                tab={tab}
                setTab={setTab}
                tabKey={tabKey}
                activities={activities}
                loadingActivities={loadingActivities}
                tasks={tasks}
                loadingTasks={loadingTasks}
                member={member}
              />
            </div>
          </main>

          {/* Right: CRM Modules */}
          <aside className="hidden md:flex flex-col w-72 min-w-[18rem] border-l border-border bg-background/80 p-4 gap-0">
            <CRMModule title="Companies" count={0} onAdd={() => setNoteDrawerOpen(true)} />
            <div className="h-px bg-border my-2" />
            <CRMModule title="Deals" count={0} />
            <div className="h-px bg-border my-2" />
            <CRMModule title="Tickets" count={0} />
            <div className="h-px bg-border my-2" />
            <CRMModule title="Attachments" count={0} />
            <div className="h-px bg-border my-2" />
            <CRMModule title="Payments" count={0} />
          </aside>
        </div>
        <NoteDrawer
          open={noteDrawerOpen}
          onClose={() => setNoteDrawerOpen(false)}
          onSubmit={async note => {
            try {
              const { error } = await supabase.from('team_activities').insert({
                team_member_id: id,
                type: 'note',
                content: note,
              });
              if (error) throw error;
              toast({ title: "Note added", description: "Your note was saved." });
              queryClient.invalidateQueries({ queryKey: ["team-activities", id] });
            } catch (e: any) {
              toast({ title: "Error", description: e.message || "Failed to add note", variant: "destructive" });
            }
          }}
        />
      </div>
    </div>
  );
};

export default TeamProfilePanel; 