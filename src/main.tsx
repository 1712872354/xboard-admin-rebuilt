import React from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Moon, ChevronDown, Plus, Server, Activity, Wifi, AlertTriangle, Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import './styles.css';

type ServerRow = { name: string; sid: string; online: boolean; cpu: number; mem: number; disk: string; nodes: number; heartbeat: string };
const servers: ServerRow[] = [{ name: 'vip', sid: '1', online: true, cpu: 0, mem: 53, disk: '2.9 GB / 18.33 GB', nodes: 2, heartbeat: '19s' }];

function Stat({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string | number; hint: string }) {
  return <div className="stat card"><div className="stat-icon"><Icon size={19}/></div><div><div className="muted">{label}</div><div className="stat-value">{value}</div><div className="hint">{hint}</div></div></div>;
}
function App() {
  const [dark, setDark] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const filtered = servers.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.sid.includes(query));
  return <div className={dark ? 'app dark' : 'app'}>
    <header className="topbar">
      <div className="brand">Admin</div>
      <div className="top-actions"><button className="icon-btn"><Search size={18}/></button><button className="icon-btn" onClick={()=>setDark(!dark)}><Moon size={18}/></button><button className="lang">CN <ChevronDown size={14}/></button><div className="avatar">A</div></div>
    </header>
    <main className="container">
      <section className="heading"><div><h1>服务器管理</h1><p>管理服务器、节点和服务器状态。</p></div><button className="primary"><Plus size={17}/> 添加服务器</button></section>
      <section className="stats"><Stat icon={Server} label="服务器总数" value={1} hint="全部服务器"/><Stat icon={Wifi} label="在线服务器" value={1} hint="当前在线"/><Stat icon={AlertTriangle} label="离线服务器" value={0} hint="已断开连接"/><Stat icon={Activity} label="高负载服务器" value={0} hint="CPU / 内存异常"/><Stat icon={Server} label="节点总数" value={2} hint="所有服务器节点"/></section>
      <section className="card table-card">
        <div className="toolbar"><button className="primary"><Plus size={16}/> 添加服务器</button><div className="filters"><div className="search"><Search size={16}/><input placeholder="搜索服务器..." value={query} onChange={e=>setQuery(e.target.value)}/></div><button className="select">全部状态 <ChevronDown size={15}/></button><button className="select">全部节点 <ChevronDown size={15}/></button></div></div>
        <div className="table-wrap"><table><thead><tr><th>服务器名称</th><th>状态</th><th>负载</th><th>节点数</th><th>最后心跳</th><th className="right">操作</th></tr></thead><tbody>{filtered.map(s=><tr key={s.sid}><td><div className="server-name"><span className="server-dot"/> <div><strong>{s.name}</strong><small>SID: {s.sid}</small></div></div></td><td><span className="status online"><span/>在线</span></td><td><div className="load"><span>CPU {s.cpu}%</span><span>MEM {s.mem}%</span></div><div className="bar"><i style={{width:`${s.mem}%`}}/></div><small>{s.disk}</small></td><td>{s.nodes}</td><td>{s.heartbeat}</td><td><div className="row-actions"><button title="详情"><Eye size={17}/></button><button title="编辑"><Pencil size={17}/></button><button title="删除"><Trash2 size={17}/></button></div></td></tr>)}</tbody></table></div>
        <div className="pagination"><span>共 {filtered.length} 条</span><div><button disabled><ChevronLeft size={16}/></button><button className="page active">1</button><button disabled><ChevronRight size={16}/></button><button className="select size">10 条/页 <ChevronDown size={14}/></button></div></div>
      </section>
    </main>
  </div>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
