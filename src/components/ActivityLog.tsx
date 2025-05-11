import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Tag, MessageCircle } from "lucide-react";
import { useState } from "react";

const TABS = ["activity", "notes", "emails", "calls", "tasks", "files"];

export type ActivityEntry = {
  id: string;
  type?: string;
  text: string;
  tags?: string[];
  attachments?: number;
  comments?: number;
  user?: string;
  date?: string;
};

/**
 * ActivityLog displays a list of activities with filter and search.
 * @param activity List of activity entries
 */
export const ActivityLog = ({ activity }: { activity: ActivityEntry[] }) => {
  const [tab, setTab] = useState("activity");
  const [search, setSearch] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterType, setFilterType] = useState("");

  const filtered = activity.filter(e =>
    (tab === "activity" || e.type === tab) &&
    (!search || e.text.toLowerCase().includes(search.toLowerCase())) &&
    (filterUser === "all" || !filterUser || e.user === filterUser) &&
    (filterType === "all" || !filterType || e.type === filterType)
  );

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full h-full flex flex-col">
      <TabsList className="mb-2">
        {TABS.map(t => <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>)}
      </TabsList>
      <div className="flex gap-2 mb-2">
        <Input placeholder="Smart search..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={filterUser} onValueChange={setFilterUser}>
          <SelectTrigger className="w-32">Team</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Alex">Alex</SelectItem>
            <SelectItem value="Jamie">Jamie</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-32">Type</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="note">Note</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="call">Call</SelectItem>
            <SelectItem value="task">Task</SelectItem>
            <SelectItem value="file">File</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {TABS.map(t => (
        <TabsContent key={t} value={t} className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            {filtered.length === 0 && <div className="text-muted-foreground text-center py-8">No entries.</div>}
            {filtered.map(e => (
              <Card key={e.id} className="flex items-center gap-3 p-3">
                <div className="flex-1">
                  <div className="text-sm">{e.text}</div>
                  <div className="flex gap-2 mt-1">
                    {e.tags?.map((tag: string) => <Badge key={tag} variant="secondary" className="flex items-center gap-1"><Tag className="h-3 w-3" />{tag}</Badge>)}
                    {e.attachments > 0 && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Paperclip className="h-3 w-3" />{e.attachments}</span>}
                    {e.comments > 0 && <span className="flex items-center gap-1 text-xs text-muted-foreground"><MessageCircle className="h-3 w-3" />{e.comments}</span>}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-right min-w-[80px]">{e.user}<br />{e.date}</div>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}; 