import React from "react";

interface CRMModuleProps {
  title: string;
  count?: number;
  children?: React.ReactNode;
  onAdd?: () => void;
}

const CRMModule: React.FC<CRMModuleProps> = ({ title, count = 0, children, onAdd }) => (
  <div className="bg-secondary rounded-lg shadow p-4 flex flex-col gap-2 min-h-[80px] transition hover:ring-2 hover:ring-electric focus-within:ring-2 focus-within:ring-electric">
    <div className="flex items-center gap-2 font-semibold text-sm mb-1">
      {title}
      <span className="inline-block bg-muted text-xs px-2 py-0.5 rounded-full font-mono">({count})</span>
    </div>
    <div className="flex-1 text-xs text-muted-foreground">
      {children || "No data yet."}
    </div>
    <button className="btn btn-xs btn-electric self-end mt-2 font-bold" onClick={onAdd}>+ Add</button>
  </div>
);

export default CRMModule; 