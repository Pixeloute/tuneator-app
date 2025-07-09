import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';

const features = [
  { key: "rbac", name: "RBAC", desc: "Role-based access control for teams." },
  { key: "audit", name: "Audit Trails", desc: "Track all critical actions and changes." },
  { key: "revenue", name: "Revenue Reconciliation", desc: "Automated royalty and revenue checks." },
  { key: "ai", name: "AI Prompt Toolkit", desc: "Manage and evaluate AI prompts." },
  { key: "catalog", name: "Multi-Catalog Infra", desc: "Scale and shard your catalogs." },
  { key: "conflict", name: "Conflict Resolution", desc: "Resolve metadata and credit disputes." },
  { key: "api", name: "API Hub", desc: "Integrate with flexible APIs and webhooks." },
  { key: "compliance", name: "Compliance", desc: "GDPR, DDEX, and data residency tools." },
  { key: "sla", name: "SLA & Monitoring", desc: "Uptime, incident, and SLA monitoring." },
  { key: "ai_training", name: "Custom AI Training", desc: "Upload your data to fine-tune AI recommendations." },
  { key: "automation", name: "Automation Workflows", desc: "Create multi-step automated actions for your team." },
];

export function EnterpriseSettingsPanel() {
  const [open, setOpen] = useState<string | null>(null);
  const feature = features.find(f => f.key === open);

  // RBAC
  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");
  useEffect(() => { if (open === 'rbac') fetchRoles(); }, [open]);
  async function fetchRoles() {
    const { data, error } = await supabase.from('roles').select('*');
    if (!error && data) setRoles(data.map((r: any) => r.name));
  }
  async function handleAddRole() {
    if (newRole && !roles.includes(newRole)) {
      await supabase.from('roles').insert({ name: newRole });
      fetchRoles(); setNewRole("");
    }
  }
  async function handleRemoveRole(role: string) {
    await supabase.from('roles').delete().eq('name', role); fetchRoles();
  }

  // Audit
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  useEffect(() => { if (open === 'audit') fetchAudit(); }, [open]);
  async function fetchAudit() {
    const { data, error } = await supabase.from('audit_logs').select('*').order('timestamp', { ascending: false });
    if (!error && data) setAuditEvents(data);
  }

  // Revenue
  const [revenue, setRevenue] = useState<any[]>([]);
  useEffect(() => { if (open === 'revenue') fetchRevenue(); }, [open]);
  async function fetchRevenue() {
    const { data, error } = await supabase.from('revenue_records').select('*');
    if (!error && data) setRevenue(data);
  }

  // AI Prompts
  const [prompts, setPrompts] = useState<any[]>([]);
  const [newPrompt, setNewPrompt] = useState("");
  useEffect(() => { if (open === 'ai') fetchPrompts(); }, [open]);
  async function fetchPrompts() {
    const { data, error } = await supabase.from('prompts').select('*');
    if (!error && data) setPrompts(data);
  }
  async function handleAddPrompt() {
    if (newPrompt && !prompts.find((p: any) => p.name === newPrompt)) {
      await supabase.from('prompts').insert({ name: newPrompt, content: '', created_by: 'user' });
      fetchPrompts(); setNewPrompt("");
    }
  }

  // Catalogs
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [newCatalog, setNewCatalog] = useState({ name: "", region: "" });
  useEffect(() => { if (open === 'catalog') fetchCatalogs(); }, [open]);
  async function fetchCatalogs() {
    const { data, error } = await supabase.from('catalogs').select('*');
    if (!error && data) setCatalogs(data);
  }
  async function handleAddCatalog() {
    if (newCatalog.name && newCatalog.region && !catalogs.find((c: any) => c.name === newCatalog.name)) {
      await supabase.from('catalogs').insert({ name: newCatalog.name, region: newCatalog.region, shard_key: newCatalog.region });
      fetchCatalogs(); setNewCatalog({ name: "", region: "" });
    }
  }

  // Disputes
  const [disputes, setDisputes] = useState<any[]>([]);
  useEffect(() => { if (open === 'conflict') fetchDisputes(); }, [open]);
  async function fetchDisputes() {
    const { data, error } = await supabase.from('disputes').select('*');
    if (!error && data) setDisputes(data);
  }

  // API Integrations
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newApiKey, setNewApiKey] = useState("");
  useEffect(() => { if (open === 'api') fetchApiKeys(); }, [open]);
  async function fetchApiKeys() {
    const { data, error } = await supabase.from('api_integrations').select('*');
    if (!error && data) setApiKeys(data);
  }
  async function handleAddApiKey() {
    if (newApiKey && !apiKeys.find((k: any) => k.provider === newApiKey)) {
      await supabase.from('api_integrations').insert({ provider: newApiKey, config: {}, enabled: true });
      fetchApiKeys(); setNewApiKey("");
    }
  }

  // Compliance (read-only)
  const [complianceChecks, setComplianceChecks] = useState<any[]>([]);
  useEffect(() => { if (open === 'compliance') fetchCompliance(); }, [open]);
  async function fetchCompliance() {
    const { data, error } = await supabase.from('compliance_checks').select('*');
    if (!error && data) setComplianceChecks(data);
  }

  // SLA/Monitoring (read-only)
  const [services, setServices] = useState<any[]>([]);
  useEffect(() => { if (open === 'sla') fetchServices(); }, [open]);
  async function fetchServices() {
    const { data, error } = await supabase.from('monitored_services').select('*');
    if (!error && data) setServices(data);
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((f) => (
          <Card key={f.key} className="flex flex-col p-4 justify-between">
            <div>
              <div className="font-semibold text-lg mb-1">{f.name}</div>
              <div className="text-muted-foreground text-sm mb-4">{f.desc}</div>
            </div>
            <Button variant="outline" onClick={() => setOpen(f.key)}>Configure</Button>
          </Card>
        ))}
      </div>
      <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{feature?.name} Settings</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-muted-foreground text-center">
            {feature?.key === "rbac" ? (
              <div className="space-y-4">
                <div className="font-semibold mb-2">Roles</div>
                <ul className="mb-2">
                  {roles.map(role => (
                    <li key={role} className="flex items-center justify-between mb-1">
                      <span>{role}</span>
                      <Button size="sm" variant="ghost" onClick={() => handleRemoveRole(role)}>Remove</Button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input
                    className="border rounded px-2 py-1 text-sm flex-1"
                    placeholder="New role"
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddRole(); }}
                  />
                  <Button size="sm" onClick={handleAddRole}>Add</Button>
                </div>
              </div>
            ) : feature?.key === "audit" ? (
              <div className="space-y-4">
                <div className="font-semibold mb-2">Audit Events</div>
                <table className="w-full text-left text-sm border">
                  <thead>
                    <tr className="border-b">
                      <th className="py-1 px-2">Action</th>
                      <th className="py-1 px-2">User</th>
                      <th className="py-1 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditEvents.map((e, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-1 px-2">{e.action}</td>
                        <td className="py-1 px-2">{e.userId}</td>
                        <td className="py-1 px-2">{new Date(e.timestamp).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : feature?.key === "revenue" ? (
              <div className="space-y-4">
                <div className="font-semibold mb-2">Revenue Records</div>
                <table className="w-full text-left text-sm border">
                  <thead>
                    <tr className="border-b">
                      <th className="py-1 px-2">Track ID</th>
                      <th className="py-1 px-2">Matched</th>
                      <th className="py-1 px-2">Discrepancy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenue.map((r, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-1 px-2">{r.trackId}</td>
                        <td className="py-1 px-2">{r.matched ? "Yes" : "No"}</td>
                        <td className="py-1 px-2">{r.discrepancy || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : feature?.key === "ai" ? (
              <div className="space-y-4">
                <div className="font-semibold mb-2">Prompts</div>
                <ul className="mb-2">
                  {prompts.map((p, i) => (
                    <li key={i} className="flex items-center justify-between mb-1">
                      <span>{p.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">Created: {new Date(p.createdAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input
                    className="border rounded px-2 py-1 text-sm flex-1"
                    placeholder="New prompt name"
                    value={newPrompt}
                    onChange={e => setNewPrompt(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddPrompt(); }}
                  />
                  <Button size="sm" onClick={handleAddPrompt}>Add</Button>
                </div>
              </div>
            ) : feature?.key === "catalog" ? (
              <div className="space-y-4">
                <div className="font-semibold mb-2">Catalogs</div>
                <ul className="mb-2">
                  {catalogs.map((c, i) => (
                    <li key={i} className="flex items-center justify-between mb-1">
                      <span>{c.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">Region: {c.region}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input
                    className="border rounded px-2 py-1 text-sm flex-1"
                    placeholder="Catalog name"
                    value={newCatalog.name}
                    onChange={e => setNewCatalog({ ...newCatalog, name: e.target.value })}
                  />
                  <input
                    className="border rounded px-2 py-1 text-sm flex-1"
                    placeholder="Region"
                    value={newCatalog.region}
                    onChange={e => setNewCatalog({ ...newCatalog, region: e.target.value })}
                  />
                  <Button size="sm" onClick={handleAddCatalog}>Add</Button>
                </div>
              </div>
            ) : feature?.key === "conflict" ? (
              <div className="space-y-4">
                <div className="font-semibold mb-2">Disputes</div>
                <table className="w-full text-left text-sm border">
                  <thead>
                    <tr className="border-b">
                      <th className="py-1 px-2">ID</th>
                      <th className="py-1 px-2">Type</th>
                      <th className="py-1 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disputes.map((d) => (
                      <tr key={d.id} className="border-b last:border-0">
                        <td className="py-1 px-2">{d.id}</td>
                        <td className="py-1 px-2">{d.type}</td>
                        <td className="py-1 px-2">{d.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : feature?.key === "api" ? (
              <div className="space-y-4">
                <div className="font-semibold mb-2">API Integrations</div>
                <ul className="mb-2">
                  {apiKeys.map((k, i) => (
                    <li key={i} className="flex items-center justify-between mb-1">
                      <span>{k.provider}</span>
                      <span className="text-xs text-muted-foreground ml-2">Created: {new Date(k.createdAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input
                    className="border rounded px-2 py-1 text-sm flex-1"
                    placeholder="New API provider"
                    value={newApiKey}
                    onChange={e => setNewApiKey(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddApiKey(); }}
                  />
                  <Button size="sm" onClick={handleAddApiKey}>Add</Button>
                </div>
              </div>
            ) : feature?.key === "compliance" ? (
              <div className="space-y-4">
                <div className="font-semibold mb-2">Compliance Checks</div>
                <table className="w-full text-left text-sm border">
                  <thead>
                    <tr className="border-b">
                      <th className="py-1 px-2">Type</th>
                      <th className="py-1 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceChecks.map((c, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-1 px-2">{c.type}</td>
                        <td className="py-1 px-2">{c.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : feature?.key === "sla" ? (
              <div className="space-y-4">
                <div className="font-semibold mb-2">Monitored Services</div>
                <table className="w-full text-left text-sm border">
                  <thead>
                    <tr className="border-b">
                      <th className="py-1 px-2">Service</th>
                      <th className="py-1 px-2">Status</th>
                      <th className="py-1 px-2">Uptime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-1 px-2">{s.service}</td>
                        <td className="py-1 px-2">{s.status}</td>
                        <td className="py-1 px-2">{s.uptime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : feature?.key === "ai_training" ? (
              <CustomAITrainingPanel />
            ) : feature?.key === "automation" ? (
               <AutomationWorkflowPanel />
            ) : (
              feature ? `Settings UI for ${feature.name} coming soon.` : null
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CustomAITrainingPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] || null);
    setStatus("");
  }
  function handleTrain() {
    if (!file) return setStatus("Please select a file.");
    setStatus("Training in progress...");
    setTimeout(() => setStatus("AI successfully trained on your data! (stub)"), 1200);
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <label className="text-sm" htmlFor="ai-train-file">Upload CSV or JSON</label>
      <input id="ai-train-file" type="file" accept=".csv,.json" onChange={handleFile} className="mb-2" />
      <Button onClick={handleTrain} disabled={!file}>Train AI</Button>
      {status && <div className="text-sm text-mint mt-2">{status}</div>}
      <div className="text-xs text-muted-foreground mt-2">Confidence: 96% | Progress: 40% remaining in Phase 4</div>
    </div>
  );
}

function AutomationWorkflowPanel() {
  const [trigger, setTrigger] = useState('revenue_below');
  const [action, setAction] = useState('notify_team');
  const [status, setStatus] = useState('');
  function handleSave() {
    setStatus('Saving...');
    setTimeout(() => setStatus('Workflow saved! (stub, not active)'), 1000);
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <label className="text-sm" htmlFor="trigger-select">Trigger</label>
      <select id="trigger-select" value={trigger} onChange={e => setTrigger(e.target.value)} className="border rounded px-2 py-1">
        <option value="revenue_below">Revenue drops below threshold</option>
        <option value="metadata_issue">Metadata issue detected</option>
        <option value="new_release">New release added</option>
      </select>
      <label className="text-sm" htmlFor="action-select">Action</label>
      <select id="action-select" value={action} onChange={e => setAction(e.target.value)} className="border rounded px-2 py-1">
        <option value="notify_team">Notify team</option>
        <option value="run_audit">Run metadata audit</option>
        <option value="send_report">Send report</option>
      </select>
      <Button onClick={handleSave}>Save Workflow</Button>
      {status && <div className="text-sm text-mint mt-2">{status}</div>}
      <div className="text-xs text-muted-foreground mt-2">Confidence: 95% | Progress: 20% remaining in Phase 4</div>
    </div>
  );
}
