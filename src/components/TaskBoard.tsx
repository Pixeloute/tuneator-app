import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export type Task = {
  id: string;
  title: string;
  assigned: string;
  due: string;
  status: string;
};

export const TaskBoard = ({ tasks, onAddTask }: { tasks: Task[]; onAddTask: (task: Task) => void }) => {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (!value.trim()) return;
    onAddTask({ id: Date.now().toString(), title: value, assigned: "You", due: "soon", status: "open" });
    setValue("");
  };

  return (
    <Card className="p-3 space-y-3">
      <div className="flex gap-2 mb-2">
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Quick add task..."
          className="flex-1"
        />
        <Button size="sm" onClick={handleAdd} disabled={!value.trim()}>Add</Button>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {tasks.length === 0 && <div className="text-muted-foreground text-center py-4">No tasks.</div>}
        {tasks.map(t => (
          <div key={t.id} className="flex items-center gap-2 border-b last:border-0 pb-2">
            <div className="flex-1 text-sm truncate">{t.title}</div>
            <div className="text-xs text-muted-foreground truncate">{t.assigned}</div>
            <div className="text-xs text-muted-foreground truncate">{t.due}</div>
            <Badge variant={t.status === "done" ? "secondary" : "outline"} className={t.status === "done" ? "text-mint" : ""}>{t.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}; 