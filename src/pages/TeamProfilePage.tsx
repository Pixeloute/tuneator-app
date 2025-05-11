import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TeamProfileOverview from "@/components/team/TeamProfileOverview";
import CRMModule from "@/components/team/CRMModule";
import ActivityTimeline from "@/components/team/ActivityTimeline";
import TaskList from "@/components/team/TaskList";
import NoteDrawer from "@/components/team/NoteDrawer";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { PageLayout } from "@/components/layout/page-layout";

const tabs = ["Overview", "Activity", "Tasks", "Files"];
const Skeleton = ({ lines = 3 }) => (
  <div className="space-y-3">{Array.from({ length: lines }).map((_, i) => (
    <div key={i} className="h-4 bg-muted/40 rounded animate-pulse" />
  ))}</div>
);

export default function TeamProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Overview");
  const [tabKey, setTabKey] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [noteDrawerOpen, setNoteDrawerOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: member, isLoading } = useQuery({
    queryKey: ["team-member", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("id", id)
        .single();
      if (error) return null;
      return data;
    },
    enabled: !!id,
  });

  const { data: activities, isLoading: loadingActivities } = useQuery({
    queryKey: ["team-activities", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_activities')
        .select('id, type, content, created_at')
        .eq('team_member_id', id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((a) => ({
        id: a.id,
        type: a.type,
        content: a.content,
        timestamp: a.created_at,
      }));
    },
    enabled: !!id,
  });

  const { data: tasks, isLoading: loadingTasks } = useQuery({
    queryKey: ["team-tasks", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_tasks')
        .select('id, title, status, due_date')
        .eq('team_member_id', id)
        .order('due_date', { ascending: true });
      if (error) throw error;
      return (data || []).map((t) => ({
        id: t.id,
        title: t.title,
        done: t.status === 'done',
        dueDate: t.due_date,
      }));
    },
    enabled: !!id,
  });

  if (!id) return <div>Missing team member ID</div>;
  if (isLoading || !member) return <div className="flex h-screen w-full items-center justify-center bg-background text-muted-foreground">Loading...</div>;

  // Tab bar only (keyboard nav preserved)
  const handleTabKeyDown = (e, idx) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (idx + 1) % tabs.length;
      tabRefs.current[next]?.focus();
      setTab(tabs[next]);
      setTabKey(k => k + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (idx - 1 + tabs.length) % tabs.length;
      tabRefs.current[prev]?.focus();
      setTab(tabs[prev]);
      setTabKey(k => k + 1);
    }
  };

  return (
    <PageLayout>
      <section className="grid grid-cols-1 lg:grid-cols-[18rem_1fr_20rem] w-full h-[calc(100vh-4rem)]">
        {/* Left: Profile Overview */}
        <aside className="hidden lg:block border-r border-border bg-background min-h-full" aria-label="Profile Overview">
          <TeamProfileOverview member={member} />
        </aside>

        {/* Center: Main Content */}
        <main className="flex flex-col min-h-full overflow-y-auto" aria-label="Team Member Details">
          {/* Header + Breadcrumb */}
          <div className="p-4 border-b flex items-center justify-between bg-background sticky top-0 z-20">
            <button onClick={() => navigate('/team')} className="btn btn-xs">← Back to Team</button>
            <div className="text-sm text-muted-foreground">Team / <span className="text-foreground font-medium">{member.full_name}</span></div>
          </div>
          {/* Tab bar only */}
          <div className="sticky top-[57px] z-10 bg-background border-b">
            <div className="flex border-b border-border bg-background px-6">
              <div className="flex gap-2" role="tablist" aria-label="Profile sections">
                {tabs.map((t, idx) => (
                  <button
                    key={t}
                    ref={el => tabRefs.current[idx] = el}
                    className={`px-4 py-2 text-base font-medium rounded-t transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-electric ${tab === t ? 'border-b-2 border-electric text-electric bg-secondary' : 'text-muted-foreground hover:bg-muted/30'}`}
                    onClick={() => { setTab(t); setTabKey(k => k + 1); }}
                    tabIndex={0}
                    autoFocus={tab === "Overview" && t === "Overview"}
                    aria-controls={`tabpanel-${t}`}
                    id={`tab-${t}`}
                    role="tab"
                    onKeyDown={e => handleTabKeyDown(e, idx)}
                    aria-label={t}
                  >{t}</button>
                ))}
              </div>
            </div>
          </div>
          {/* Tab content */}
          <section className="flex-1 overflow-y-auto relative">
            <div
              key={tabKey}
              className="w-full h-full"
              style={{ pointerEvents: 'auto' }}
              role="tabpanel"
              id={`tabpanel-${tab}`}
              aria-labelledby={`tab-${tab}`}
            >
              <div className="transition-all duration-200 opacity-100 translate-y-0">
                {tab === "Overview" && (
                  <div className="space-y-4 p-6" id="tabpanel-Overview" aria-labelledby="tab-Overview">
                    <div className="font-semibold mb-2">Contact Details</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1">Email</label>
                        <input className="input input-sm w-full" defaultValue={member.email} readOnly placeholder={member.email} title={member.email} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Phone</label>
                        <input className="input input-sm w-full" defaultValue={member.phone} readOnly placeholder={member.phone} title={member.phone} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Company</label>
                        <input className="input input-sm w-full" defaultValue={member.company} readOnly placeholder={member.company} title={member.company} />
                      </div>
                    </div>
                  </div>
                )}
                {tab === "Activity" && (
                  <div className="p-6">
                    {loadingActivities ? <Skeleton lines={5} /> :
                      activities && activities.length ? (
                        <div className="max-h-96 overflow-y-auto" id="tabpanel-Activity" aria-labelledby="tab-Activity"><ActivityTimeline items={activities} /></div>
                      ) : (
                        <div className="text-muted-foreground">No activity found.</div>
                      )}
                  </div>
                )}
                {tab === "Tasks" && (
                  <div className="p-6">
                    {loadingTasks ? <Skeleton lines={4} /> :
                      tasks && tasks.length ? (
                        <div className="max-h-96 overflow-y-auto" id="tabpanel-Tasks" aria-labelledby="tab-Tasks"><TaskList tasks={tasks} /></div>
                      ) : (
                        <div className="text-muted-foreground">No tasks assigned.</div>
                      )}
                  </div>
                )}
                {tab === "Files" && (
                  <div className="text-muted-foreground p-6" id="tabpanel-Files" aria-labelledby="tab-Files">Files (coming soon)</div>
                )}
              </div>
            </div>
          </section>
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
              } catch (e) {
                toast({ title: "Error", description: e.message || "Failed to add note", variant: "destructive" });
              }
            }}
          />
        </main>

        {/* Right: CRM Modules */}
        <aside className="hidden lg:flex flex-col w-80 border-l border-border overflow-y-auto bg-background p-4 min-h-full" aria-label="CRM Modules">
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
      </section>
    </PageLayout>
  );
} 