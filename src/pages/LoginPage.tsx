import React from 'react';
import { LockKeyhole, Mail } from 'lucide-react';
import { admin } from '../api/admin';

export function LoginPage({onSuccess}:{onSuccess:()=>void}){
 const [email,setEmail]=React.useState(''); const [password,setPassword]=React.useState(''); const [busy,setBusy]=React.useState(false); const [error,setError]=React.useState('');
 const submit=async(e:React.FormEvent)=>{e.preventDefault();setBusy(true);setError('');try{await admin.auth.login(email,password);onSuccess()}catch(err){setError(err instanceof Error?err.message:'登录失败')}finally{setBusy(false)}};
 return <div className="login-page"><form className="login-card" onSubmit={submit}><div className="login-mark">X</div><h1>XBoard Admin</h1><p>管理员登录</p><label><span>邮箱</span><div className="login-input"><Mail size={16}/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="username" required/></div></label><label><span>密码</span><div className="login-input"><LockKeyhole size={16}/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" autoComplete="current-password" required/></div></label>{error&&<div className="error">{error}</div>}<button className="btn primary login-submit" disabled={busy}>{busy?'登录中…':'登录'}</button></form></div>;
}
