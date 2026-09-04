import React from 'react';
import { Activity, CreditCard, Server, ShoppingCart, Users } from 'lucide-react';
import { admin } from '../api/admin';

export function DashboardPage(){
  const [stats,setStats]=React.useState<any>(); const [orders,setOrders]=React.useState<any>(); const [traffic,setTraffic]=React.useState<any>(); const [error,setError]=React.useState('');
  React.useEffect(()=>{Promise.all([admin.dashboard.stats(),admin.dashboard.order(),admin.dashboard.trafficRank()]).then(([s,o,t])=>{setStats(s);setOrders(o);setTraffic(t)}).catch(e=>setError(e instanceof Error?e.message:'加载失败'))},[]);
  const number=(v:any)=>typeof v==='number'?v.toLocaleString():String(v??'0');
  const cards=[['用户总数',stats?.total_users??stats?.users??0,Users],['今日订单',orders?.today??orders?.total??0,ShoppingCart],['服务器/节点',stats?.server_count??stats?.servers??0,Server],['流量排名',Array.isArray(traffic)?traffic.length:(traffic?.length??0),Activity],['收入',orders?.today_income??orders?.income??0,CreditCard]] as const;
  return <section><div className="page-head"><div><h1>仪表盘</h1><p>查看 XBoard 的核心运营指标与系统状态。</p></div></div><div className="overview">{cards.map(([l,v,I])=><div className="stat" key={l}><div><div className="stat-label">{l}</div><div className="stat-value">{number(v)}</div></div><span className="stat-icon"><I size={15}/></span></div>)}</div>{error&&<div className="error">{error}</div>}<div className="dashboard-grid"><div className="panel dashboard-card"><h3>核心统计</h3><pre className="code">{JSON.stringify(stats??{},null,2)}</pre></div><div className="panel dashboard-card"><h3>订单概览</h3><pre className="code">{JSON.stringify(orders??{},null,2)}</pre></div></div></section>;
}
