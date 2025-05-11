import React from "react";

export type ActivityItem = {
  id: string;
  type: "email" | "note" | "call" | "task";
  content: string;
  timestamp: string | Date;
};

function relativeTime(ts: string | Date) {
  const d = typeof ts === "string" ? new Date(ts) : ts;
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return d.toLocaleDateString();
}

const icons: Record<ActivityItem["type"], React.ReactNode> = {
  email: <span className="text-electric">✉️</span>,
  note: <span className="text-mint">📝</span>,
  call: <span className="text-electric">📞</span>,
  task: <span className="text-mint">✅</span>,
};

interface ActivityTimelineProps {
  items?: ActivityItem[];
}

const dummy: ActivityItem[] = [
  { id: "1", type: "email", content: "Sent welcome email", timestamp: new Date(Date.now() - 3600_000) },
  { id: "2", type: "note", content: "Added note: 'VIP client'", timestamp: new Date(Date.now() - 7200_000) },
  { id: "3", type: "call", content: "Called for onboarding", timestamp: new Date(Date.now() - 86400_000) },
];

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ items }) => (
  <ol className="relative border-l border-border pl-4 space-y-6">
    {(items && items.length ? items : dummy).map(item => (
      <li key={item.id} className="flex items-start gap-3">
        <span className="absolute -left-5 top-0">{icons[item.type]}</span>
        <div>
          <div className="text-sm">{item.content}</div>
          <div className="text-xs text-muted-foreground">{relativeTime(item.timestamp)}</div>
        </div>
      </li>
    ))}
  </ol>
);

export default ActivityTimeline; 