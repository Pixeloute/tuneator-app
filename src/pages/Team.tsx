import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { create } from "zustand";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import TeamCard, { TeamMember } from "@/components/team/TeamCard";
import FilterBar from "@/components/team/FilterBar";
import PaginationControls from "@/components/team/PaginationControls";
import TeamProfilePanel from "@/components/team/TeamProfilePanel";
import ActivityTimeline from "@/components/team/ActivityTimeline";
import TaskList from "@/components/team/TaskList";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const TeamTableView = ({ members, selected, onSelect, onRowClick, search, onSearch, role, onRoleChange, sort, onSortChange, page, totalPages, onPageChange, roles }: any) => (
  <>
    <FilterBar search={search} onSearch={onSearch} role={role} onRoleChange={onRoleChange} sort={sort} onSortChange={onSortChange} roles={roles} />
    <div className="space-y-3 p-4">
      {members.map((m: TeamMember) => (
        <TeamCard key={m.id} member={m} selected={selected.includes(m.id)} onClick={() => onRowClick(m.id)} onSelect={checked => onSelect(m.id, checked)} />
      ))}
    </div>
    <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />
  </>
);

const TeamGridView = ({ members, selected, onSelect, onRowClick, search, onSearch, role, onRoleChange, sort, onSortChange, page, totalPages, onPageChange, roles }: any) => (
  <>
    <FilterBar search={search} onSearch={onSearch} role={role} onRoleChange={onRoleChange} sort={sort} onSortChange={onSortChange} roles={roles} />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {members.map((m: TeamMember) => (
        <TeamCard key={m.id} member={m} selected={selected.includes(m.id)} onClick={() => onRowClick(m.id)} onSelect={checked => onSelect(m.id, checked)} />
      ))}
    </div>
    <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />
  </>
);

const TeamDetailPanel = ({ id }: { id: string }) => {
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ['team-member', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, role, email, phone, company')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // File UploadZone fetch
  const { data: files, isLoading: filesLoading, error: filesError } = useQuery<any[]>({
    queryKey: ['assets', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('id, name, type, file_size, created_at')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  // CRM Metadata (local state for tags/custom fields)
  const [tags, setTags] = useState<string[]>(['VIP', 'PR']);
  const [newTag, setNewTag] = useState('');
  const [fields, setFields] = useState<{ key: string; value: string }[]>([
    { key: 'Timezone', value: 'GMT' },
    { key: 'Lifecycle', value: 'Active' },
  ]);

  if (isLoading) return <aside className="w-full md:w-[420px] max-w-full bg-secondary/80 border-l border-border flex flex-col h-full"><div className="p-6">Loading...</div></aside>;
  if (error || !data) return <aside className="w-full md:w-[420px] max-w-full bg-secondary/80 border-l border-border flex flex-col h-full"><div className="p-6 text-destructive">Error loading member.</div></aside>;

  return (
    <aside className="w-full md:w-[420px] max-w-full bg-secondary/80 border-l border-border flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 flex flex-col items-center gap-4 border-b border-border">
        {data.avatar_url ? (
          <img src={data.avatar_url} alt="avatar" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
            {data.first_name?.[0] || ''}{data.last_name?.[0] || ''}
          </div>
        )}
        <div className="text-center">
          <div className="text-xl font-bold">{data.first_name} {data.last_name}</div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="badge badge-xs bg-mint/20 text-mint">{data.role || 'Member'}</span>
            <span className="badge badge-xs bg-electric/20 text-electric">Active</span>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button className="btn btn-xs btn-secondary">Note</button>
          <button className="btn btn-xs btn-secondary">Email</button>
          <button className="btn btn-xs btn-secondary">Call</button>
          <button className="btn btn-xs btn-secondary">Task</button>
          <button className="btn btn-xs btn-secondary">Meet</button>
        </div>
      </div>
      {/* Contact Info */}
      <div className="p-6 flex flex-col gap-2 border-b border-border">
        <div className="flex items-center justify-between"><span className="font-medium">Email:</span> <span>{data.email || '-'}</span></div>
        <div className="flex items-center justify-between"><span className="font-medium">Phone:</span> <span>{data.phone || '-'}</span></div>
        <div className="flex items-center justify-between"><span className="font-medium">Company:</span> <span>{data.company || '-'}</span></div>
      </div>
      {/* Team Involvement */}
      <div className="p-6 border-b border-border">
        <div className="font-semibold mb-2">Team Involvement</div>
        <div className="text-xs text-muted-foreground">Associated Artist(s), Tasks, Activity, Uploads (placeholder)</div>
      </div>
      {/* Activity Timeline */}
      <div className="p-6 border-b border-border">
        <div className="font-semibold mb-2">Activity Timeline</div>
        <div className="text-xs text-muted-foreground">Emails, notes, calls (placeholder)</div>
      </div>
      {/* Task Checklist */}
      <div className="p-6 border-b border-border">
        <div className="font-semibold mb-2">Task Checklist</div>
        <div className="text-xs text-muted-foreground">(No tasks table yet. Placeholder only.)</div>
      </div>
      {/* File UploadZone */}
      <div className="p-6 border-b border-border">
        <div className="font-semibold mb-2">Uploads</div>
        {filesLoading ? (
          <div className="text-xs text-muted-foreground">Loading...</div>
        ) : filesError ? (
          <div className="text-xs text-destructive">Error loading files.</div>
        ) : !files?.length ? (
          <div className="text-xs text-muted-foreground">No files found.</div>
        ) : (
          <ul className="space-y-2">
            {files.map(f => (
              <li key={f.id} className="text-xs flex items-center gap-2">
                <span className="font-medium">{f.name}</span>
                <span className="text-muted-foreground">{f.type}</span>
                <span className="text-muted-foreground">{(f.file_size / 1024).toFixed(1)} KB</span>
                <span className="text-muted-foreground">{new Date(f.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* CRM Metadata */}
      <div className="p-6">
        <div className="font-semibold mb-2">CRM Metadata</div>
        <div className="mb-2">
          <div className="text-xs font-medium mb-1">Tags</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, i) => (
              <span key={tag} className="badge badge-xs bg-mint/20 text-mint flex items-center gap-1">
                {tag}
                <button className="ml-1 text-xs" onClick={() => setTags(tags.filter((_, idx) => idx !== i))}>&times;</button>
              </span>
            ))}
            <input
              className="input input-xs w-20"
              placeholder="Add tag"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && newTag.trim()) {
                  setTags([...tags, newTag.trim()]);
                  setNewTag('');
                }
              }}
            />
          </div>
        </div>
        <div className="mb-2">
          <div className="text-xs font-medium mb-1">Custom Fields</div>
          <div className="flex flex-col gap-1">
            {fields.map((f, i) => (
              <div key={f.key} className="flex gap-2 items-center">
                <input
                  className="input input-xs w-24"
                  value={f.key}
                  onChange={e => setFields(fields.map((x, idx) => idx === i ? { ...x, key: e.target.value } : x))}
                  aria-label="Custom field key"
                  placeholder="Field"
                />
                <input
                  className="input input-xs w-32"
                  value={f.value}
                  onChange={e => setFields(fields.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x))}
                  aria-label="Custom field value"
                  placeholder="Value"
                />
                <button className="btn btn-xs" onClick={() => setFields(fields.filter((_, idx) => idx !== i))}>&times;</button>
              </div>
            ))}
            <button className="btn btn-xs mt-1" onClick={() => setFields([...fields, { key: '', value: '' }])}>Add Field</button>
          </div>
        </div>
      </div>
    </aside>
  );
};

const createContactSchema = z.object({
  first_name: z.string().min(2, "First name required"),
  last_name: z.string().min(2, "Last name required"),
  email: z.string().email("Invalid email").optional().or(z.literal("").transform(() => undefined)),
  phone: z.string().optional(),
  role: z.string().optional(),
  company: z.string().optional(),
  avatar_url: z.string().url("Invalid URL").optional().or(z.literal("").transform(() => undefined)),
});
type CreateContactValues = z.infer<typeof createContactSchema>;

const CreateContactDrawer: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; onCreated?: () => void; roles: string[] }> = ({ open, onOpenChange, onCreated, roles }) => {
  const { toast } = useToast();
  const form = useForm<CreateContactValues>({
    resolver: zodResolver(createContactSchema),
    defaultValues: { first_name: "", last_name: "", email: "", phone: "", role: "", company: "", avatar_url: "" },
  });
  const [submitting, setSubmitting] = React.useState(false);
  const avatarUrl = form.watch("avatar_url");

  const handleCreate = async (addAnother: boolean) => {
    setSubmitting(true);
    try {
      const id = uuidv4();
      const values = form.getValues();
      const { error } = await supabase.from("team_members").insert([{
        id,
        full_name: `${values.first_name} ${values.last_name}`.trim(),
        role: values.role,
        email: values.email,
        phone: values.phone,
        avatar_url: values.avatar_url,
        company: values.company,
      }]);
      if (error) throw error;
      toast({ title: "Contact created", description: `${values.first_name} ${values.last_name} added.` });
      if (addAnother) {
        form.reset();
      } else {
        onOpenChange(false);
        onCreated?.();
        form.reset();
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to create contact", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="h-screen max-w-[600px] w-full flex flex-col bg-background shadow-xl animate-in slide-in-from-right-80"
        style={{ right: 0, left: 'auto' }}
      >
        <DrawerHeader>
          <DrawerTitle>Create Contact</DrawerTitle>
        </DrawerHeader>
        <form
          onSubmit={e => { e.preventDefault(); handleCreate(false); }}
          className="flex-1 overflow-y-auto px-6 pt-2 pb-4 flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 gap-2">
            <label className="text-sm font-medium">First Name *</label>
            <Input {...form.register("first_name")} placeholder="First name" />
            <span className="text-xs text-destructive">{form.formState.errors.first_name?.message as string}</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <label className="text-sm font-medium">Last Name *</label>
            <Input {...form.register("last_name")} placeholder="Last name" />
            <span className="text-xs text-destructive">{form.formState.errors.last_name?.message as string}</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <label className="text-sm font-medium">Email</label>
            <Input {...form.register("email")} placeholder="Email" type="email" />
            <span className="text-xs text-destructive">{form.formState.errors.email?.message as string}</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <label className="text-sm font-medium">Phone</label>
            <Input {...form.register("phone")} placeholder="Phone" />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <label className="text-sm font-medium">Role</label>
            {roles.length ? (
              <select {...form.register("role")} className="input">
                <option value="">Select role</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            ) : (
              <Input {...form.register("role")} placeholder="Role" />
            )}
          </div>
          <div className="grid grid-cols-1 gap-2">
            <label className="text-sm font-medium">Company</label>
            <Input {...form.register("company")} placeholder="Company" />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <label className="text-sm font-medium">Avatar URL</label>
            <Input {...form.register("avatar_url")} placeholder="Avatar URL" />
            {avatarUrl && <img src={avatarUrl} alt="avatar preview" className="h-12 w-12 rounded-full object-cover mt-2" />}
            <span className="text-xs text-destructive">{form.formState.errors.avatar_url?.message as string}</span>
          </div>
        </form>
        <div className="border-t border-border flex gap-2 px-6 py-4 bg-background">
          <Button
            type="button"
            className="flex-1"
            onClick={() => handleCreate(false)}
            disabled={submitting}
          >
            Create
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={() => handleCreate(true)}
            disabled={submitting}
            variant="secondary"
          >
            Create and add another
          </Button>
          <DrawerClose asChild>
            <Button type="button" className="flex-1" variant="outline">Cancel</Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const Team: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState("table");
  const params = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [sort, setSort] = useState('az');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const pageSize = viewMode === 'grid' ? 12 : 10;
  const { data = [], isLoading, error } = useQuery<TeamMember[]>({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*');
      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState('member');
  const { toast } = useToast();

  const handleInvite = async () => {
    if (!inviteEmail) return;
    const { error } = await supabase.from('team_members').insert({ email: inviteEmail, role: inviteRole, status: 'invited' });
    if (error) {
      toast({ title: 'Invite failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Invite sent', description: `Invitation sent to ${inviteEmail}` });
      setInviteOpen(false);
      setInviteEmail('');
      setInviteRole('member');
    }
  };
  const filtered = (data as TeamMember[]).filter(m => {
    const matchesSearch =
      !search ||
      (m.full_name && m.full_name.toLowerCase().includes(search.toLowerCase())) ||
      (m.email && m.email.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = role === 'all' || m.role === role;
    return matchesSearch && matchesRole;
  });
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'az') return (a.full_name).localeCompare(b.full_name);
    if (sort === 'role') return (a.role || '').localeCompare(b.role || '');
    return 0;
  });
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);
  const uniqueRoles = Array.from(new Set((data as TeamMember[]).map(m => m.role).filter(Boolean)));
  const handleSelect = (id: string) => {
    navigate(`/team/${id}`);
  };
  const handleBulkSelect = (id: string, checked: boolean) => {
    setSelected(checked ? [...selected, id] : selected.filter(x => x !== id));
  };
  if (!authLoading && !user) return <Navigate to="/auth" />;
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground font-inter">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 flex flex-row gap-0 p-0 md:p-0">
            <section className="w-full md:w-2/3 xl:w-3/5 flex flex-col border-r border-border h-full flex-grow relative">
              <div className="flex items-center justify-between p-4 border-b border-border relative">
                <h1 className="text-xl font-bold">Team Directory</h1>
                <div className="flex gap-2">
                  <button className={`btn btn-xs ${viewMode === "table" ? "btn-primary" : "btn-secondary"}`} onClick={() => setViewMode("table")}>Table</button>
                  <button className={`btn btn-xs ${viewMode === "grid" ? "btn-primary" : "btn-secondary"}`} onClick={() => setViewMode("grid")}>Grid</button>
                  <Button onClick={() => setDrawerOpen(true)} className="ml-2">Create Contact</Button>
                </div>
              </div>
              {isLoading ? <div className="p-4">Loading...</div> : error ? <div className="p-4 text-destructive">Error loading team members.</div> : !paged.length ? <div className="p-4 text-muted-foreground">No team members found.</div> : (
                viewMode === "table"
                  ? <TeamTableView members={paged} selected={selected} onSelect={handleBulkSelect} onRowClick={handleSelect} search={search} onSearch={setSearch} role={role} onRoleChange={setRole} sort={sort} onSortChange={setSort} page={page} totalPages={totalPages} onPageChange={setPage} roles={uniqueRoles} />
                  : <TeamGridView members={paged} selected={selected} onSelect={handleBulkSelect} onRowClick={handleSelect} search={search} onSearch={setSearch} role={role} onRoleChange={setRole} sort={sort} onSortChange={setSort} page={page} totalPages={totalPages} onPageChange={setPage} roles={uniqueRoles} />
              )}
              <CreateContactDrawer open={drawerOpen} onOpenChange={setDrawerOpen} onCreated={() => { setDrawerOpen(false); /* Optionally refetch team list here */ }} roles={uniqueRoles} />
            </section>
          </main>
        </div>
      </div>
      {/* Invite Team Member Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email address"
              className="border rounded px-2 py-1 w-full"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
            />
            <select
              className="border rounded px-2 py-1 w-full"
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value)}
              title="Role"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <DialogFooter>
            <button className="bg-mint px-4 py-2 rounded text-white font-semibold" onClick={handleInvite}>
              Send Invite
            </button>
            <button className="text-muted-foreground underline text-sm ml-2" onClick={() => setInviteOpen(false)}>
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Team;
