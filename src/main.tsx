import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Cpu, HardDrive, Languages, Moon, Pencil, Plus, Search, Server, Trash2, Users, X } from 'lucide-react';
import { machineApi, type Machine, type MachineNode } from './api/client';
import './styles.css';

type Status = 'online' | 'offline' | 'inactive' | 'never';
const statusOf = (m: Machine): Status => !m.is_active ? 'inactive' : !m.last_seen_at ? 'never' : Date.now() / 1000 - m.last_seen_at < 300 ? 'online' : 'offline';
const pct = (m: Machine) => ({ cpu: m.load_status?.cpu ?? 0, mem: m.load_status?.mem?.total ? (m.load_status.mem.used / m.load_status.mem.total) * 100 : 0, disk: m.load_status?.disk?.total ? (m.load_status.disk.used / m.load_status.disk.total) * 100 : 0 });
const ago = (n?: number | null) => { if (!n) return '-'; const s = Math.max(0, Math.floor(Date.now() / 1000 - n)); return s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`; };
const bytes = (n = 0) => n < 1024 ** 3 ? `${(n / 1024 ** 2).toFixed(0)} MB` : `${(n / 1024 ** 3).toFixed(2)} GB`;

function Header() {
  const [dark, setDark] = useState(false);
  useEffect(() => document.documentElement.classList.toggle('dark', dark), [dark]);
  return <header className="topbar"><div className="brand">XBoard</div><div className="top-actions"><button className="icon-btn"><Search size={17}/></button><button className="icon-btn" onClick={() => setDark(v => !v)}><Moon size={17}/></button><button className="lang"><Languages size={15}/> CN</button><div className="avatar">A</div></div></header>;
}

function Overview({ machines }: { machines: Machine[] }) {
  const online = machines.filter(m => statusOf(m) === 'online').length;
  const offline = machines.filter(m => ['offline', 'never'].includes(statusOf(m))).length;
  const high = machines.filter(m => { const p = pct(m); return p.cpu >= 85 || p.mem >= 90 || p.disk >= 90; }).length;
  const nodes = machines.reduce((n, m) => n + (m.servers_count ?? 0), 0);
  const cards = [['total', 'TOTAL', machines.length, Server], ['online', 'ONLINE', online, Activity], ['offline', 'OFFLINE', offline, CircleHelp], ['high', 'HIGH LOAD', high, Cpu], ['nodes', 'NODES', nodes, Users]] as const;
  return <div className="overview">{cards.map(([k, l, v, I]) => <div className="stat" key={k}><div><div className="stat-label">{l}</div><div className="stat-value">{v}</div></div><span className={`stat-icon ${k}`}><I size={15}/></span></div>)}</div>;
}

function Metric({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return <div><div className="metric-head"><span>{icon}{label}</span><b>{value.toFixed(0)}%</b></div><div className="bar"><i style={{ width: `${Math.min(value, 100)}%` }}/></div></div>;
}
function Load({ machine }: { machine: Machine }) {
  const p = pct(machine);
  if (!machine.load_status) return <span className="muted">No data</span>;
  return <div className="load"><Metric label="CPU" value={p.cpu} icon={<Cpu size={11}/>}/><Metric label="MEM" value={p.mem} icon={<Users size={11}/>}/><div className="disk"><span><HardDrive size={11}/> DISK</span><span>{bytes(machine.load_status.disk.used)} / {bytes(machine.load_status.disk.total)}</span></div></div>;
}

function MachineModal({ machine, onClose, onSaved }: { machine?: Machine | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(machine?.name ?? '');
  const [notes, setNotes] = useState(machine?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const save = async () => { if (!name.trim()) return; setSaving(true); try { await machineApi.save({ id: machine?.id, name: name.trim(), notes }); onSaved(); onClose(); } finally { setSaving(false); } };
  return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><h3>{machine ? '编辑服务器' : '添加服务器'}</h3><button className="icon-btn" onClick={onClose}><X size={17}/></button></div><label>名称<input value={name} onChange={e => setName(e.target.value)} placeholder="服务器名称"/></label><label>备注<textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}/></label><div className="modal-actions"><button className="btn ghost" onClick={onClose}>取消</button><button className="btn primary" disabled={saving || !name.trim()} onClick={save}>{saving ? '保存中…' : '保存'}</button></div></div></div>;
}

function Detail({ machine, onClose }: { machine: Machine; onClose: () => void }) {
  const [nodes, setNodes] = useState<MachineNode[]>([]); const [loading, setLoading] = useState(true); const [token, setToken] = useState<string>(); const [command, setCommand] = useState<string>();
  useEffect(() => { machineApi.nodes(machine.id).then(setNodes).finally(() => setLoading(false)); }, [machine.id]);
  return <div className="modal-backdrop"><div className="modal wide"><div className="modal-head"><h3><Server size={18}/> {machine.name}</h3><button className="icon-btn" onClick={onClose}><X size={17}/></button></div><div className="detail-meta"><span>SID: {machine.id}</span><span className={`badge ${statusOf(machine)}`}>{statusOf(machine)}</span><span>CPU {pct(machine).cpu.toFixed(0)}%</span><span>最后心跳: {ago(machine.last_seen_at)}</span><span>节点: {machine.servers_count}</span></div>{machine.notes && <p className="muted">{machine.notes}</p>}<div className="detail-actions"><button className="btn" onClick={async () => setToken((await machineApi.token(machine.id)).token)}>获取 Token</button><button className="btn" onClick={async () => setCommand((await machineApi.installCommand(machine.id)).command)}>安装命令</button></div>{token && <pre className="code">{token}</pre>}{command && <pre className="code">{command}</pre>}<h4>关联节点</h4>{loading ? <p className="muted">加载中…</p> : nodes.length ? <div className="node-list">{nodes.map(n => <div key={n.id}><b>#{n.id} {n.name}</b><span>{n.type}</span><span>{n.host}:{n.port}</span><span className={n.enabled ? 'enabled' : 'disabled'}>{n.enabled ? 'Enabled' : 'Disabled'}</span></div>)}</div> : <p className="muted">暂无节点</p>}</div></div>;
}

function App() {
  const [machines, setMachines] = useState<Machine[]>([]); const [query, setQuery] = useState(''); const [status, setStatus] = useState(''); const [nodeState, setNodeState] = useState(''); const [selected, setSelected] = useState<Machine | null>(null); const [editing, setEditing] = useState<Machine | null | undefined>(undefined); const [error, setError] = useState('');
  const reload = () => machineApi.list().then(setMachines).catch(e => setError(e instanceof Error ? e.message : String(e)));
  useEffect(() => { void reload(); }, []);
  const filtered = useMemo(() => machines.filter(m => { const q = query.toLowerCase(), s = statusOf(m), p = pct(m), high = p.cpu >= 85 || p.mem >= 90 || p.disk >= 90; return (!q || `${m.name} ${m.notes ?? ''} sid:${m.id}`.toLowerCase().includes(q)) && (!status || s === status) && (!nodeState || (nodeState === 'with_nodes' ? m.servers_count > 0 : nodeState === 'idle_nodes' ? m.servers_count === 0 : high)); }), [machines, query, status, nodeState]);
  const remove = async (m: Machine) => { if (confirm(`确定删除 ${m.name}？`)) { await machineApi.remove(m.id); await reload(); } };
  return <><Header/><main><div className="page-head"><div><h1>服务器管理</h1><p>用于查看服务器健康、负载与承载节点，并从运维视角快捷发起节点操作。</p></div></div><Overview machines={machines}/><section><div className="server-toolbar"><div className="toolbar-left"><button className="btn-outline" onClick={() => setEditing(null)}><Plus size={15}/>添加服务器</button><div className="search"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索服务器名称、备注或 SID..."/></div><select value={status} onChange={e => setStatus(e.target.value)}><option value="">状态</option><option value="online">在线</option><option value="offline">离线</option><option value="inactive">停用</option><option value="never">未连接</option></select><select value={nodeState} onChange={e => setNodeState(e.target.value)}><option value="">节点</option><option value="with_nodes">有节点</option><option value="idle_nodes">无节点</option><option value="high_load">高负载</option></select></div><div className="ratios">在线: {machines.filter(m => statusOf(m) === 'online').length}/{machines.length}　高负载: {machines.filter(m => { const p = pct(m); return p.cpu >= 85 || p.mem >= 90 || p.disk >= 90; }).length}</div></div><p className="helper">适合集中查看服务器在线情况、承载节点数量与资源压力。</p>{error && <div className="error">{error}</div>}<div className="table-card"><div className="table-wrap"><table><thead><tr><th>服务器名称</th><th>状态</th><th>负载</th><th>节点数</th><th>最后心跳</th><th>操作</th></tr></thead><tbody>{filtered.map(m => <tr key={m.id}><td><div className="machine"><span className="machine-icon"><Server size={16}/></span><div><div className="machine-name">{m.name}<i className={`dot ${statusOf(m)}`}/></div><small>SID: {m.id}</small><div className="server-meta"><span className={`badge ${statusOf(m)}`}>{statusOf(m) === 'online' ? '在线' : statusOf(m) === 'offline' ? '离线' : statusOf(m) === 'inactive' ? '停用' : '未连接'}</span><span>•</span><span>最后心跳: {ago(m.last_seen_at)}</span><span>•</span><span>节点数: {m.servers_count}</span></div></div></div></td><td><span className={`badge ${statusOf(m)}`}>{statusOf(m) === 'online' ? '在线' : statusOf(m) === 'offline' ? '离线' : statusOf(m)}</span></td><td><Load machine={m}/></td><td><div className="node-count"><b>{m.servers_count}</b><span>已承载节点</span><button className="mini-btn" onClick={() => setSelected(m)}><EyeIcon/>服务器详情</button></div></td><td><b>{ago(m.last_seen_at)}</b><div className="muted">{m.load_status?.updated_at ? `负载上报: ${ago(m.load_status.updated_at)}` : '无负载数据'}</div></td><td><div className="actions"><button className="icon-btn" onClick={() => setSelected(m)}><Activity size={15}/></button><button className="icon-btn" onClick={() => setEditing(m)}><Pencil size={15}/></button><button className="icon-btn danger" onClick={() => void remove(m)}><Trash2 size={15}/></button></div></td></tr>)}{!filtered.length && <tr><td colSpan={6} className="empty">暂无数据</td></tr>}</tbody></table></div></div><div className="pagination"><span>已选择 0 项，共 {filtered.length} 项</span><div><span>每页显示</span><button className="page-size">10 <ChevronDown size={13}/></button><button className="icon-btn" disabled><ChevronLeft size={15}/></button><span>第 1 页，共 1 页</span><button className="icon-btn" disabled><ChevronRight size={15}/></button></div></div></section></main>{editing !== undefined && <MachineModal machine={editing} onClose={() => setEditing(undefined)} onSaved={reload}/>} {selected && <Detail machine={selected} onClose={() => setSelected(null)}/>}</>;
}
function EyeIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>; }
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
