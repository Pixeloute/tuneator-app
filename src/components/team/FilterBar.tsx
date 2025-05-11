import React from "react";

interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  role: string;
  onRoleChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  roles: string[];
}

const baseField =
  "h-10 px-3 text-sm rounded-md border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-electric placeholder:text-muted-foreground transition";

const FilterBar: React.FC<FilterBarProps> = ({ search, onSearch, role, onRoleChange, sort, onSortChange, roles }) => (
  <div className="flex flex-wrap gap-2 p-4 border-b border-border items-center bg-transparent">
    <input
      className={`${baseField} w-56`}
      placeholder="Search name or email"
      value={search}
      onChange={e => onSearch(e.target.value)}
      aria-label="Search team members"
      type="text"
    />
    <select
      className={`${baseField} w-36 text-muted-foreground`}
      value={role}
      onChange={e => onRoleChange(e.target.value)}
      aria-label="Filter by role"
    >
      <option value="all">All Roles</option>
      {roles.map(r => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>
    <select
      className={`${baseField} w-36 text-muted-foreground`}
      value={sort}
      onChange={e => onSortChange(e.target.value)}
      aria-label="Sort team members"
    >
      <option value="az">A-Z</option>
      <option value="role">Role</option>
      <option value="recent">Recently Added</option>
    </select>
  </div>
);

export default FilterBar; 