import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export type Note = {
  id: string;
  text: string;
  author: string;
  date: string;
};

export const NotesPanel = ({ notes, onAddNote }: { notes: Note[]; onAddNote: (note: Note) => void }) => {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (!value.trim()) return;
    onAddNote({ id: Date.now().toString(), text: value, author: "You", date: "now" });
    setValue("");
  };

  return (
    <Card className="p-3 space-y-3">
      <div className="space-y-2">
        <Textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Add a note..."
          className="resize-none"
          rows={2}
        />
        <Button size="sm" onClick={handleAdd} disabled={!value.trim()} className="w-full">Add Note</Button>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {notes.length === 0 && <div className="text-muted-foreground text-center py-4">No notes yet.</div>}
        {notes.map(n => (
          <div key={n.id} className="border-b last:border-0 pb-2">
            <div className="text-sm">{n.text}</div>
            <div className="text-xs text-muted-foreground">{n.author} • {n.date}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}; 