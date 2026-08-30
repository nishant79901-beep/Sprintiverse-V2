import fs from 'node:fs';
const p='src/Entry.jsx';
let s=fs.readFileSync(p,'utf8');
const oldImport="MoreHorizontal,Clock,UserRound}";
if(s.includes(oldImport)) s=s.replace(oldImport,"MoreHorizontal,Clock,UserRound,Paperclip}");
if(!s.includes('const PLAN=')) s=s.replace("const AG=[", "const PLAN=[['Starter','₹1,599/mo','2 seats · 500 tickets'],['Growth','₹4,099/mo','5 seats · 2,500 tickets'],['Pro','₹8,299/mo','15 seats · 10,000 tickets']];const AG=[");
s=s.replace(/\bP\.map\(/g,'PLAN.map(');
if(!s.includes("await db.rpc('seed_sample_data'")) s=s.replace("if(store)await db.from('integrations').insert({workspace_id:data,provider:store,status:'pending'});sessionStorage.setItem('workspace_id',data);nav('/billing')", "if(store)await db.from('integrations').insert({workspace_id:data,provider:store,status:'pending'});await db.rpc('seed_sample_data',{w:data});sessionStorage.setItem('workspace_id',data);nav('/billing')");
const start=s.indexOf('function Profile(');
const end=s.indexOf('function Metric(',start);
if(start>=0&&end>start){
const profile=`function Profile({session}){const[open,setOpen]=useState(false),[theme,setTheme]=useState(localStorage.getItem('sp-theme')||'system'),[active,setActive]=useState(localStorage.getItem('sp-active')==='1'),[editing,setEditing]=useState(false),[draft,setDraft]=useState(session.user.user_metadata?.full_name||''),[saving,setSaving]=useState(false),[msg,setMsg]=useState('');useEffect(()=>{document.documentElement.dataset.theme=theme==='dark'?'dark':'light'},[theme]);const save=async()=>{const workspaceId=sessionStorage.getItem('workspace_id');if(!workspaceId)return setMsg('Open the workspace again before editing your name.');setSaving(true);setMsg('');const{data,error}=await db.rpc('update_owner_profile_name',{w:workspaceId,new_name:draft.trim()});setSaving(false);if(error){setMsg(error.message);return}setEditing(false);session.user.user_metadata={...(session.user.user_metadata||{}),full_name:data?.full_name||draft.trim()};};return <div className="profile"><button className="avatar" onClick={()=>setOpen(!open)}><UserRound/>{active&&<i/>}</button>{open&&<div className="profileMenu"><b>{session.user.user_metadata?.full_name||'User'}</b><span>{session.user.email}</span><hr/>{editing?<><input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Your name"/><button className="primary" disabled={saving||draft.trim().length<2} onClick={save}>{saving?'Saving…':'Save name'}</button><button onClick={()=>setEditing(false)}>Cancel</button>{msg&&<span className="danger">{msg}</span>}</>:<button onClick={()=>setEditing(true)}>Edit name <small>once every 7 days</small></button>}<label>Theme</label><div className="theme">{['system','light','dark'].map(t=><button className={theme===t?'on':''} onClick={()=>{setTheme(t);localStorage.setItem('sp-theme',t)}}>{t}</button>)}</div><button onClick={()=>{const x=!active;setActive(x);localStorage.setItem('sp-active',x?'1':'0')}}>{active?'● Active':'○ Inactive'}</button><button className="danger" onClick={async()=>{await db.auth.signOut();nav('/')}}><LogOut size={15}/> Sign out</button></div>}</div>}
`;
s=s.slice(0,start)+profile+s.slice(end);
}
s=s.replace("<main><h2>{items.find(x=>x[0]===tab)[1]}</h2>","<main><Back to=\"/app\"/><h2>{items.find(x=>x[0]===tab)[1]}</h2>");
fs.writeFileSync(p,s);
