import React from "react";
import ActivityTimeline, { ActivityItem } from "./ActivityTimeline";
import TaskList, { TaskItem } from "./TaskList";
import type { TeamMember } from "./TeamCard";

interface TeamProfileTabsProps {
  tab: string;
  setTab: (tab: string) => void;
  tabKey: number;
  activities: ActivityItem[] | undefined;
  loadingActivities: boolean;
  tasks: TaskItem[] | undefined;
  loadingTasks: boolean;
  member: TeamMember;
}

const tabs = ["Overview", "Activity", "Tasks", "Files"];

const tabTransition = {
  enter: "opacity-0 translate-y-2",
  enterActive: "opacity-100 translate-y-0 transition-all duration-200",
};

const Skeleton = ({ lines = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-muted/40 rounded animate-pulse" />
    ))}
  </div>
);

const TeamProfileTabs: React.FC<TeamProfileTabsProps> = ({ tab, setTab, tabKey, activities, loadingActivities, tasks, loadingTasks, member }) => {
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const handleTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (idx + 1) % tabs.length;
      tabRefs.current[next]?.focus();
      setTab(tabs[next]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (idx - 1 + tabs.length) % tabs.length;
      tabRefs.current[prev]?.focus();
      setTab(tabs[prev]);
    }
  };
  return (
    <>
      <div className="flex border-b border-border bg-background px-6">
        <div className="flex gap-2" role="tablist" aria-label="Profile sections">
          {tabs.map((t, idx) => (
            <button
              key={t}
              ref={el => tabRefs.current[idx] = el}
              className={`px-4 py-2 text-base font-medium rounded-t transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-electric ${tab === t ? 'border-b-2 border-electric text-electric bg-secondary' : 'text-muted-foreground hover:bg-muted/30'}`}
              onClick={() => setTab(t)}
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
      <section className="flex-1 overflow-y-auto relative">
        <div
          key={tabKey}
          className="w-full h-full"
          style={{ pointerEvents: 'auto' }}
          role="tabpanel"
          id={`tabpanel-${tab}`}
          aria-labelledby={`tab-${tab}`}
        >
          <div className={`transition-all duration-200 ${tabTransition.enter} ${tabTransition.enterActive}`}>
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
    </>
  );
};

export default TeamProfileTabs; 