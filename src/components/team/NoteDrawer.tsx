import React, { useState } from "react";

interface NoteDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

const NoteDrawer: React.FC<NoteDrawerProps> = ({ open, onClose, onSubmit }) => {
  const [note, setNote] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Add Note</h2>
        <textarea
          className="input w-full h-24 mb-4"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Write your note..."
        />
        <div className="flex gap-2 justify-end">
          <button className="btn btn-xs" onClick={onClose}>Cancel</button>
          <button className="btn btn-xs btn-mint font-semibold" onClick={() => { onSubmit(note); setNote(""); onClose(); }} disabled={!note.trim()}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default NoteDrawer; 