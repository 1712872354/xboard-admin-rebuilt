import React from 'react';
import { Pencil, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import type { ModuleConfig } from '../config/modules';
import { adminApi } from '../api/admin';

function endpoint(path: string) {
  return `${window.settings?.secure_path ?? ''}${path}`;
}

async function call(path: string, init?: RequestInit) {
  const response = await fetch(endpoint(path), { credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(init?.headers ?? {}) }, ...init });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.message ?? `HTTP ${response.status}`);
  return payload?.data ?? payload;
}

function extractRows(value: any): any[] {
  if (Array.isArray(value)) return value;
  for (const key of ['items','records','list','data','rows','users','orders','servers']) if (Array.isArray(value?.[key])) return value[key];
  return value && typeof value === 'object' ? [value] : [];
}

function idOf(row: any) { return row?.id ?? row?.user_id ?? row?.order_no ?? row?.code ?? row?.email; }

export function ResourcePage({ module }: { module: ModuleConfig }) {
  const [rows, setRows] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [editing, setEditing] = React.useState<any | null>(null);
  const [draft, setDraft] = React.useState('{}');

  const load = React.useCallback(async () => {
    if (!module.fetch) return;
    setLoading(true); setError('');
    try {
      const data = await call(module.fetch, { method: module.fetchMethod === 'POST' ? 'POST' : 'GET', ...(module.fetchMethod === 'POST' ? { body: '{}' } : {}) });
      setRows(extractRows(data));
    } catch (e) { setError(e instanceof Error ? e.message : '加载失败'); }
    finally { setLoading(false); }
  }, [module]);

  React.useEffect(() => { void load(); }, [load]);

  const filtered = rows.filter(row => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));
  const columns = React.useMemo(() => {
    const keys = new Set<string>();
    filtered.slice(0, 20).forEach(row => Object.keys(row ?? {}).forEach(k => keys.add(k)));
    return [...keys].slice(0, 6);
  }, [filtered]);

  const openCreate = () => { setDraft('{}'); setEditing({ __create: true }); };
  const openEdit = (row: any) => { setDraft(JSON.stringify(row, null, 2)); setEditing(row); };
  const save = async () => {
    if (!module.save) return;
    try { await call(module.save, { method: 'POST', body: draft }); setEditing(null); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : '保存失败'); }
  };
  const remove = async (row: any) => {
    if (!module.drop || !confirm(`确认删除 ${String(idOf(row) ?? '')}？`)) return;
    try { await call(module.drop, { method: 'POST', body: JSON.stringify({ id: idOf(row) }) }); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : '删除失败'); }
  };

  return <section>
    <div className="page-head"><div><h1>{module.title}</h1><p>根据 XBoard 后端接口还原的管理页面。</p></div>{module.save && <button className="btn primary" onClick={openCreate}><Plus size={16}/> 新增</button>}</div>
    <section className="panel">
      <div className="toolbar"><div className="toolbar-left"><div className="search"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`搜索${module.title}...`}/></div><button className="btn" onClick={()=>void load()}><RefreshCw size={14}/> 刷新</button></div><span className="ratios">共 {filtered.length} 项</span></div>
      {error && <div className="error">{error}</div>}
      <div className="table-wrap"><table><thead><tr>{columns.map(c=><th key={c}>{c}</th>)}{(module.save || module.drop) && <th>操作</th>}</tr></thead><tbody>
        {loading ? <tr><td colSpan={columns.length + 1} className="empty">加载中...</td></tr> : !filtered.length ? <tr><td colSpan={columns.length + 1} className="empty">暂无数据</td></tr> : filtered.map((row, i)=><tr key={String(idOf(row) ?? i)}>{columns.map(c=><td key={c}><span className="cell-value">{typeof row?.[c] === 'object' ? JSON.stringify(row[c]) : String(row?.[c] ?? '')}</span></td>)}{(module.save || module.drop) && <td><div className="actions">{module.save && <button className="icon-btn" onClick={()=>openEdit(row)}><Pencil size={15}/></button>}{module.drop && <button className="icon-btn danger" onClick={()=>void remove(row)}><Trash2 size={15}/></button>}</div></td>}</tr>)}
      </tbody></table></div>
      <div className="pagination"><span>已显示 {filtered.length} 项</span><span>当前页面</span></div>
    </section>
    {editing && <div className="modal-backdrop"><div className="modal wide"><div className="modal-head"><h3>{editing.__create ? `新增${module.title}` : `编辑${module.title}`}</h3><button className="icon-btn" onClick={()=>setEditing(null)}><X size={17}/></button></div><textarea className="json-editor" value={draft} onChange={e=>setDraft(e.target.value)} rows={18}/><div className="modal-actions"><button className="btn ghost" onClick={()=>setEditing(null)}>取消</button><button className="btn primary" onClick={()=>void save()}>保存</button></div></div></div>}
  </section>;
}

export function moduleEndpointSummary(module: ModuleConfig) {
  const known = adminApi as unknown;
  return known ? module.fetch ?? '' : '';
}
