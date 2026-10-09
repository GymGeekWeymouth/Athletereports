/* GymGeek Analyse staff app · hosted on GitHub Pages, loaded by App.html in Apps Script */
(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Open+Sans:wght@400;500;600;700&family=Raleway:ital,wght@1,900&family=DM+Mono:wght@400;500&display=swap';document.head.appendChild(l);})();
document.getElementById('gg-root').innerHTML="<div class=\"splash\" id=\"splash\">\n  <div class=\"logo\">GYMGEEK<span>ANALYSE</span></div>\n  <div class=\"pby\">Powered by <b>ATHLEEK</b></div>\n  <div class=\"loader\" id=\"loader\"><i></i></div>\n  <div class=\"signin\" id=\"signin\" hidden>\n    <h2>Sign in</h2><p>Enter your staff code</p>\n    <div class=\"code\" id=\"code\"><input inputmode=\"numeric\" maxlength=\"1\" aria-label=\"Code digit 1\" autocomplete=\"one-time-code\"><input inputmode=\"numeric\" maxlength=\"1\" aria-label=\"Code digit 2\"><input inputmode=\"numeric\" maxlength=\"1\" aria-label=\"Code digit 3\"><input inputmode=\"numeric\" maxlength=\"1\" aria-label=\"Code digit 4\"></div>\n    <div class=\"err\" id=\"codeErr\" aria-live=\"polite\"></div>\n  </div>\n</div>\n\n<main id=\"view\"></main>\n\n\n\n<nav class=\"tabbar\" id=\"tabbar\" hidden><div class=\"in\">\n  <button data-tab=\"home\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><path d=\"M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z\"/></svg>Home</button>\n  <button data-tab=\"clients\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20a6.5 6.5 0 0 1 13 0\"/><path d=\"M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6\"/></svg>Clients</button>\n  <button data-tab=\"progs\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z\"/><path d=\"M8 7h8M8 11h6\"/></svg>Programmes</button>\n  <button data-tab=\"cal\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"4.5\" width=\"18\" height=\"16.5\" rx=\"2.5\"/><path d=\"M3 9.5h18M8 2.5v4M16 2.5v4\"/></svg>Calendar</button>\n  <button data-tab=\"admin\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><path d=\"M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z\"/><path d=\"M14 3v6h6M8.5 14.5l2 2 4-4.5\"/></svg>Admin</button>\n</div></nav>\n<div class=\"actionbar\" id=\"actionbar\" hidden><div class=\"in\" id=\"actions\"></div></div>\n<div id=\"layer\"></div>\n\n<datalist id=\"dl-clients\"></datalist>\n<datalist id=\"dl-sports\"><option>Football</option><option>Golf</option><option>Running</option><option>Triathlon</option><option>General fitness</option></datalist>";
/* Shows any start-up problem on screen instead of loading forever */
(function(){
  function show(msg){var s=document.getElementById("signin"),l=document.getElementById("loader");if(!s)return;if(l)l.hidden=true;s.hidden=false;
    s.innerHTML='<h2>Something went wrong</h2><p style="word-break:break-word">'+String(msg).replace(/[<>&]/g,"")+'</p><p style="margin-top:14px">Send a screenshot of this to Joe.</p>';}
  window.addEventListener("error",function(e){show((e.message||"Script error")+(e.lineno?" (line "+e.lineno+")":""));});
  window.addEventListener("unhandledrejection",function(e){var m=e.reason&&e.reason.message||String(e.reason);if(m!=="LOCKED")show(m);});
  setTimeout(function(){if(!window.__ggStarted)show("The app didn't finish starting. App.html may not have pasted in completely: it should be about 830 lines long and the last line should be the closing html tag.");},8000);
})();

/* ======================= constants ======================= */
const GROUPS=["Active Males — Over 50", "Active Females — Over 50", "Active Males — Under 40", "Active Females — Under 40", "Active Males — Over 40", "Active Females — Over 40", "Active Males — Under 16", "Active Females — Under 16", "Elite Male — Academy U16 (PL/EFL Cat. 1)", "Elite Male — Academy U18 (PL/EFL Cat. 1)", "Elite Female — Academy U16 (WSL / FA WSL Academy)", "Elite Female — Academy U18 (WSL / FA WSL Academy)", "Elite Male — Premier League / EFL Pro", "Competitive Male — Semi-Pro / National League", "Elite Female — WSL / FAWSL", "Competitive Female — Women's Championship / Tier 3", "Tour Level — PGA Tour Bottom / DP World Tour", "Elite Amateur — Category 1 / Scratch (Handicap 0–5)", "Tour Level Female — LPGA / LET", "Elite Amateur Female — Category 1 (Handicap 0–5)", "Elite Male — International / GB Squad (800m–10,000m)", "Competitive Male — National / Regional (800m–10,000m)", "Elite Female — International / GB Squad (800m–10,000m)", "Competitive Female — National / Regional (800m–10,000m)", "Elite Male — ITU / PTO World Tour", "Competitive Male — Age-Group / National Level", "Elite Female — ITU / PTO World Tour", "Competitive Female — Age-Group / National Level"];
const AREAS=["Neck","Shoulder","Elbow","Wrist/hand","Upper back","Lower back","Hip/groin","Hamstring","Quad","Knee","Calf/Achilles","Ankle","Foot","Other"];
const AGG=["Running","Jumping","Lifting","Stairs","Sitting","Sleeping","Twisting","Other"];
const FLAGS=["Night pain that won't settle","Numbness or pins and needles","New weakness","Unexplained weight loss","Fever or unwell","Bladder or bowel changes"];
const STAFF_COLS=["#61C599","#7C9BFF","#FFC11E","#FF8FB1","#5FD1E0","#B18CFF","#FF9F5A"];
const I={ /* icons */
  back:'<path d="m15 18-6-6 6-6"/>',chev:'<path d="m9 18 6-6-6-6"/>',plus:'<path d="M12 5v14M5 12h14"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  check:'<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',jump:'<path d="M12 18V5M6.5 10.5 12 5l5.5 5.5M4 21h16"/>',
  send:'<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',doc:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  tool:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  more:'<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
  ext:'<path d="M14 4h6v6M10 14 20 4M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',left:'<path d="m15 18-6-6 6-6"/>',right:'<path d="m9 18 6-6-6-6"/>',
  flag:'<path d="M4 22V4M4 4h12l-2 4 2 4H4"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'};
const ico=(n,cls)=>`<svg class="ic ${cls||""}" viewBox="0 0 24 24">${I[n]}</svg>`;

/* ======================= utils ======================= */
const $=id=>document.getElementById(id);
const LS={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pad=n=>String(n).padStart(2,"0");
const ymd=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const today=()=>ymd(new Date());
const D=s=>{if(!s)return null;const m=String(s).match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);return m?new Date(+m[1],+m[2]-1,+m[3],+(m[4]||0),+(m[5]||0)):new Date(s);};
const fdate=s=>{const d=D(s);return d&&!isNaN(d)?d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}):"";};
const fshort=s=>{const d=D(s);return d&&!isNaN(d)?d.toLocaleDateString("en-GB",{day:"numeric",month:"short"}):"";};
const ftime=s=>{const d=D(s);return d?pad(d.getHours())+":"+pad(d.getMinutes()):"";};
const ago=s=>{const d=D(s);if(!d)return"";const m=(Date.now()-d)/6e4;if(m<1)return"just now";if(m<60)return Math.round(m)+" min ago";if(m<1440)return Math.round(m/60)+" h ago";if(m<2880)return"yesterday";return fshort(s);};
const initials=n=>String(n||"?").trim().split(/\s+/).map(w=>w[0]).slice(0,2).join("").toUpperCase();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const validEmail=e=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
const isAdmin=()=>S.me&&S.me.role==="admin";

/* ======================= state + server ======================= */
const S={code:LS.get("gg_code",""),data:null,me:null,tab:"home",stacks:{home:[{p:"home"}],clients:[{p:"clients"}],progs:[{p:"progs"}],cal:[{p:"cal"}],admin:[{p:"admin"}]},calOffset:0,calOff:LS.get("gg_caloff",[])};
function api(fn,...args){
  return new Promise((res,rej)=>google.script.run.withSuccessHandler(res).withFailureHandler(e=>{
    const m=String(e&&e.message||e).replace(/^(Error|Exception):\s*/,"");
    if(m==="LOCKED"){LS.del("gg_code");LS.del("gg_boot");S.code="";showSignIn();}
    rej(new Error(m));
  })[fn](S.code,...args));
}
function toast(msg,err){const t=document.createElement("div");t.className="toast"+(err?" err":"");t.textContent=msg;t.setAttribute("role","status");document.body.appendChild(t);setTimeout(()=>t.remove(),err?4800:2400);}

/* ======================= start + sign in ======================= */
async function start(){
  if(!S.code){showSignIn();return;}
  const cached=LS.get("gg_boot",null);
  if(cached&&cached.me){ S.data=cached; S.me=cached.me; enter(); refreshInBackground(); return; }   // instant open, then refresh
  try{ S.data=await api("boot"); S.me=S.data.me; LS.set("gg_boot",S.data); enter(); }
  catch(e){ if(e.message!=="LOCKED"){ $("loader").hidden=true; $("signin").hidden=false; $("signin").innerHTML=`<h2>Couldn't connect</h2><p>${esc(e.message)}</p><div style="margin-top:20px"><button class="chipbtn g" onclick="location.reload()">Try again</button></div>`; } }
}
function showSignIn(){const sp=$("splash");sp.hidden=false;sp.style.opacity=1;$("loader").hidden=true;$("signin").hidden=false;$("tabbar").hidden=true;$("actionbar").hidden=true;$("layer").innerHTML="";const ins=[...$("code").children];ins.forEach(i=>i.value="");setTimeout(()=>ins[0].focus(),120);}
[...$("code").children].forEach((inp,i,all)=>{
  inp.addEventListener("input",()=>{inp.value=inp.value.replace(/\D/g,"").slice(-1);if(inp.value&&i<all.length-1)all[i+1].focus();const c=all.map(x=>x.value).join("");if(c.length===all.length)signIn(c);});
  inp.addEventListener("keydown",e=>{if(e.key==="Backspace"&&!inp.value&&i)all[i-1].focus();});
  inp.addEventListener("paste",e=>{const t=(e.clipboardData.getData("text")||"").replace(/\D/g,"").slice(0,4);if(t.length===4){e.preventDefault();t.split("").forEach((c,j)=>all[j].value=c);signIn(t);}});
});
async function signIn(code){
  S.code=code;$("codeErr").textContent="";$("loader").hidden=false;
  try{S.data=await api("boot");S.me=S.data.me;LS.set("gg_code",code);LS.set("gg_boot",S.data);$("signin").hidden=true;enter();}
  catch(e){$("loader").hidden=true;$("codeErr").textContent=e.message==="LOCKED"?"That code isn't recognised":e.message;const c=$("code");c.classList.remove("shake");void c.offsetWidth;c.classList.add("shake");[...c.children].forEach(x=>x.value="");c.children[0].focus();}
}
function enter(){$("signin").hidden=true;applyData();S.tab="home";S.stacks={home:[{p:"home"}],clients:[{p:"clients"}],progs:[{p:"progs"}],cal:[{p:"cal"}],admin:[{p:"admin"}]};S.calOffset=0;render();const sp=$("splash");sp.style.opacity=0;setTimeout(()=>sp.hidden=true,300);}
function applyData(){$("dl-clients").innerHTML=S.data.clients.map(c=>`<option value="${esc(c.name)}">`).join("");}
async function reload(){try{S.data=await api("boot");S.me=S.data.me;LS.set("gg_boot",S.data);applyData();}catch(e){}}
async function refreshInBackground(){ try{ const d=await api("boot"); S.data=d; S.me=d.me; LS.set("gg_boot",d); applyData();
  const top=stack()[stack().length-1]; if(S.tab==="home"&&top.p==="home") render(true); }catch(e){} }
function signOut(){LS.del("gg_code");LS.del("gg_boot");S.code="";closeSheet();showSignIn();}

/* ======================= navigation ======================= */
function stack(){return S.stacks[S.tab];}
function push(p,params){stack().push({p,params:params||{}});render();}
function pop(){if(stack().length>1)stack().pop();render(true);}
function render(isBack){
  const top=stack()[stack().length-1], P=PAGES[top.p];
  document.querySelectorAll("#tabbar [data-tab]").forEach(b=>b.classList.toggle("on",b.dataset.tab===S.tab));
  const v=$("view"); v.innerHTML=`<div class="page">${P.html(top.params||{})}</div>`;
  const acts=P.actions?P.actions(top.params||{}):"";
  $("actions").innerHTML=acts; $("actionbar").hidden=!acts; $("tabbar").hidden=!!acts; document.body.classList.toggle("formmode",!!acts);
  if(!isBack) scrollTo(0,0);
  P.mount&&P.mount(top.params||{});
}
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-tab]"); if(t){ if(S.tab===t.dataset.tab&&stack().length>1){S.stacks[S.tab]=[stack()[0]];} S.tab=t.dataset.tab; render(); return; }
  if(e.target.closest("[data-back]")){pop();return;}
  const a=e.target.closest("[data-act]"); if(a){ const f=ACT[a.dataset.act]; if(f){e.preventDefault(); f(a.dataset, a);} }
  const s=e.target.closest(".seg button"); if(s&&!s.closest("[data-tab]")){ e.preventDefault(); const seg=s.parentElement; [...seg.children].forEach(x=>x.classList.toggle("on",x===s)); seg.dispatchEvent(new CustomEvent("segchange",{bubbles:true,detail:s.dataset.v})); }
  const p=e.target.closest(".pills button"); if(p){ e.preventDefault(); p.classList.toggle("on"); p.parentElement.dispatchEvent(new CustomEvent("segchange",{bubbles:true})); }
});
const head=(o)=>`<header class="ph">${o.back?`<button class="bk" data-back>${ico("back")}${esc(o.backLabel||"Back")}</button>`:""}${o.eyebrow?`<div class="eyebrow" style="margin-top:${o.back?4:10}px">${esc(o.eyebrow)}</div>`:""}<div class="ph-row"><h1>${o.title}</h1>${o.right||""}</div>${o.sub?`<div class="sub">${o.sub}</div>`:""}</header>`;
const empty=(t,s)=>`<div class="empty"><b>${t}</b>${s||""}</div>`;
const skel=(n,h)=>Array.from({length:n||3},()=>`<div class="sk" style="height:${h||64}px"></div>`).join("");

/* form helpers */
const seg=(id,opts,val,cls)=>`<div class="seg ${cls||""}" id="${id}">${opts.map(o=>{const [v,l]=Array.isArray(o)?o:[o,o];return `<button type="button" data-v="${esc(v)}" class="${v===val?"on":""}">${esc(l)}</button>`;}).join("")}</div>`;
const pills=(id,opts,vals,cls)=>{const set=new Set(String(vals||"").split(",").map(s=>s.trim()).filter(Boolean));return `<div class="pills ${cls||""}" id="${id}">${opts.map(o=>`<button type="button" data-v="${esc(o)}" class="${set.has(o)?"on":""}">${esc(o)}</button>`).join("")}</div>`;};
const field=(label,inner,o={})=>`<div class="field ${o.full?"full":""}" ${o.attr||""}><${o.lbl?"div class='lbl'":"label"} ${o.for?`for="${o.for}"`:""}>${label}</${o.lbl?"div":"label"}>${inner}${o.help?`<div class="help">${o.help}</div>`:""}${o.err?`<div class="err" id="${o.err}" hidden></div>`:""}</div>`;
const slider=(id,label,val)=>field(label,`<div class="slider"><input type="range" id="${id}" min="0" max="10" value="${val??0}" oninput="document.getElementById('${id}-v').textContent=this.value" aria-label="${esc(label)}"><b id="${id}-v">${val??0}</b></div>`,{lbl:1});
const segVal=id=>{const b=document.querySelector(`#${id} button.on`);return b?b.dataset.v:"";};
const pillVals=id=>[...document.querySelectorAll(`#${id} button.on`)].map(b=>b.dataset.v);
const val=id=>($(id)?$(id).value.trim():"");
const emailFor=name=>{const c=(S.data.clients||[]).find(c=>c.name.toLowerCase()===String(name).trim().toLowerCase());return c?c.email:"";};
const sheetHTML=(title,sub,body)=>`<div class="scrim" id="scrim"><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="grab"></div><h2>${title}</h2>${sub?`<div class="sub">${sub}</div>`:""}<div class="body">${body}</div></div></div>`;
function openSheet(title,sub,body){ $("layer").innerHTML=sheetHTML(title,sub,body); $("scrim").addEventListener("click",e=>{if(e.target.id==="scrim")closeSheet();}); }
function closeSheet(){ $("layer").innerHTML=""; }
async function readFile(f){return await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});}
function blobUrl(b64,mime){const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));return URL.createObjectURL(new Blob([bytes],{type:mime||"application/octet-stream"}));}

/* ======================= pages ======================= */
const PAGES={};
const ACT={};

/* ---------- HOME ---------- */
PAGES.home={
  html(){
    const d=S.data, h=new Date().getHours(), greet=h<12?"Good morning":h<18?"Good afternoon":"Good evening", st=d.stats;
    const dateStr=new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"});
    return `${head({eyebrow:dateStr,title:`${greet},<br>${esc(S.me.name)}`,right:`<button class="me" data-act="profile" aria-label="Account">${esc(initials(S.me.name))}</button>`})}
    <button class="hero-cta" data-act="newCheckin"><span class="lead">${ico("check")}</span><span><b>New injury check-in</b><span>Log today's session in under a minute</span></span></button>
    <div class="duo">
      <button class="tile" data-act="intake"><span class="lead">${ico("jump")}</span><span><b>Force plate intake</b><span>Prep a report prompt</span></span></button>
      <button class="tile" data-act="sendAny"><span class="lead">${ico("send")}</span><span><b>Send a programme</b><span>Branded PDF by email</span></span></button>
    </div>
    <div class="label">This week</div>
    <div class="metrics">
      <div class="metric"><b>${st.week}</b><span>Check-ins<br>this week</span></div>
      <div class="metric ${st.flags?"red":""}"><b>${st.flags}</b><span>Red flags<br>last 30 days</span></div>
      <div class="metric ${st.maint.total&&st.maint.done===st.maint.total?"grn":""}"><b>${st.maint.total?st.maint.done+"/"+st.maint.total:"–"}</b><span>Maintenance<br>checks done</span></div>
    </div>
    ${st.flagClients&&st.flagClients.length?`<div class="label">Needs attention</div><div class="group">${st.flagClients.map(n=>`<button class="row" data-act="openClient" data-name="${esc(n)}"><span class="lead" style="color:var(--red)">${ico("flag")}</span><span class="main"><span class="t">${esc(n)}</span><span class="s">Red flag recorded recently</span></span><span class="end">${ico("chev","chev")}</span></button>`).join("")}</div>`:""}
    ${st.docsDue?`<div class="label">Documents</div><div class="group"><button class="row" data-act="docs"><span class="lead" style="color:var(--amber)">${ico("doc")}</span><span class="main"><span class="t">${st.docsDue} document${st.docsDue>1?"s":""} due for review</span><span class="s">Within the next 30 days</span></span><span class="end">${ico("chev","chev")}</span></button></div>`:""}
    <div id="h-today"></div>
    <div class="label">Recent activity</div>
    <div class="group">${(d.activity||[]).length?d.activity.map(a=>`<div class="row noicon"><span class="main"><span class="t">${esc(a.staff)} ${esc(String(a.action||"").toLowerCase())} ${esc(String(a.type||"").toLowerCase())}</span><span class="s">${esc([a.client,a.record].filter(Boolean).join(" · "))}</span></span><span class="end">${esc(ago(a.timestamp))}</span></div>`).join(""):`<div class="empty" style="padding:24px">Nothing yet. Activity from all staff appears here.</div>`}</div>`;
  },
  async mount(){
    if(!S.data.staff.some(s=>s.hasCalendar)) return;
    try{ const r=await api("teamCalendar",today(),1); const now=new Date(); const evs=r.events.filter(e=>e.allDay||D(e.end)>now).slice(0,4);
      if($("h-today")) $("h-today").innerHTML=`<div class="label">Team today <button data-tab="cal">See all</button></div><div class="group">${evs.length?evs.map(e=>evRow(e)).join(""):`<div class="empty" style="padding:22px">Nothing else on today</div>`}</div>`;
    }catch(e){}
  }
};
ACT.profile=()=>openSheet(esc(S.me.name),isAdmin()?"Admin":"Staff",`<div class="group" style="background:var(--s2)"><button class="row noicon" data-act="signOut"><span class="main"><span class="t">Switch user or sign out</span><span class="s">You'll need a staff code to sign back in</span></span></button></div><button class="btn sec" data-act="close">Close</button>`);
ACT.signOut=signOut; ACT.close=closeSheet;
ACT.newCheckin=(d)=>{closeSheet();push("checkin",d&&d.name?{client:d.name}:{});};
ACT.intake=()=>push("intake",{});
ACT.sendAny=()=>sendSheet(null,null);
ACT.openClient=(d)=>{S.tab="clients";S.stacks.clients=[{p:"clients"},{p:"client",params:{name:d.name}}];render();};
ACT.docs=()=>{S.tab="admin";S.stacks.admin=[{p:"admin"},{p:"docs",params:{}}];render();};

/* ---------- CHECK-IN (new + edit) ---------- */
PAGES.checkin={
  html(p){
    const c=p.rec||{}, edit=!!p.rec, staffList=S.data.staff.map(s=>s.name);
    const staffVal=c.staff||S.me.name;
    return `${head({back:true,title:edit?"Edit check-in":"Injury check-in",sub:edit?`${esc(c.client)} · ${fdate(c.date)}${c.editedBy?` · last edited by ${esc(c.editedBy)}`:""}`:`Signed in as ${esc(S.me.name)}`})}
    <div class="stack" style="margin-top:22px">
    <section class="section"><h3>Session</h3><div class="fgrid">
      ${field("Client name",`<input id="c-client" list="dl-clients" autocomplete="off" autocapitalize="words" placeholder="e.g. Sam Carter" value="${esc(c.client||p.client||"")}">`,{full:1,for:"c-client",err:"e-client"})}
      ${field("Client email",`<input id="c-email" type="email" inputmode="email" autocomplete="off" placeholder="Used for sending programmes" value="${esc(c.email||emailFor(p.client||"")||"")}">`,{full:1,for:"c-email",help:"Fills in automatically for existing clients"})}
      ${field("Date",`<input id="c-date" type="date" value="${esc(c.date?String(c.date).slice(0,10):today())}">`,{for:"c-date"})}
      ${field("Clinician",`<select id="c-staff">${staffList.concat(staffList.includes(staffVal)?[]:[staffVal]).map(n=>`<option ${n===staffVal?"selected":""}>${esc(n)}</option>`).join("")}</select>`,{for:"c-staff"})}
      ${field("Session type",seg("c-sessionType",["Initial","Follow-up","Discharge"],c.sessionType||"Follow-up"),{full:1,lbl:1})}
    </div></section>
    <section class="section"><h3>Injury</h3><div class="fgrid">
      ${field("Body area",`<select id="c-bodyArea"><option value="">Choose…</option>${AREAS.map(a=>`<option ${a===c.bodyArea?"selected":""}>${a}</option>`).join("")}</select>`,{for:"c-bodyArea",err:"e-bodyArea"})}
      ${field("Side",seg("c-side",[["Left","L"],["Right","R"],["Both","Both"],["N/A","N/A"]],c.side),{lbl:1})}
      ${field("Diagnosis or working impression",`<input id="c-diagnosis" autocomplete="off" value="${esc(c.diagnosis||"")}">`,{full:1,for:"c-diagnosis"})}
      ${field("Mechanism",seg("c-mechanism",["Gradual","Sudden","Unknown"],c.mechanism),{full:1,lbl:1})}
    </div></section>
    <section class="section"><h3>Pain</h3>
      ${slider("c-painNow","Pain now",c.painNow)}${slider("c-painWorst","Worst in the last 7 days",c.painWorst)}${slider("c-painActivity","During activity",c.painActivity)}
      ${field("Since last session",seg("c-trend",["Better","Same","Worse"],c.trend,"trend"),{lbl:1})}
    </section>
    <section class="section"><h3>Function</h3>
      ${field("What aggravates it",pills("c-aggravating",AGG,c.aggravating),{lbl:1})}
      ${field("Swelling",seg("c-swelling",["None","Some","A lot"],c.swelling),{lbl:1})}
      ${slider("c-confidence","Confidence to train fully",c.confidence??5)}
      ${field("Objective test or measure",`<input id="c-objective" autocomplete="off" placeholder="e.g. SL hop 85% LSI, knee flexion 120°" value="${esc(c.objective||"")}">`,{for:"c-objective"})}
    </section>
    <section class="section"><h3>Load and rehab</h3><div class="fgrid">
      ${field("Home exercises",seg("c-adherence",["None","Some","Most","All"],c.adherence),{full:1,lbl:1})}
      ${field("Training sessions this week",`<input id="c-sessionsWeek" type="number" inputmode="numeric" min="0" max="21" value="${esc(c.sessionsWeek??"")}">`,{for:"c-sessionsWeek"})}
      ${field("Sleep",seg("c-sleep",["Poor","OK","Good"],c.sleep),{lbl:1})}
    </div></section>
    <section class="section"><h3>Red flags</h3>${pills("c-redFlags",FLAGS,c.redFlags,"flags")}<div class="callout red" id="c-flagWarn" ${c.redFlags?"":"hidden"}>Red flag recorded: review before the next session.</div></section>
    <section class="section"><h3>Plan</h3><div class="fgrid">
      ${field("Done today",`<textarea id="c-doneToday">${esc(c.doneToday||"")}</textarea>`,{full:1,for:"c-doneToday"})}
      ${field("Plan and next steps",`<textarea id="c-plan">${esc(c.plan||"")}</textarea>`,{full:1,for:"c-plan"})}
      ${field("Next session",`<input id="c-nextSession" type="date" value="${esc(c.nextSession?String(c.nextSession).slice(0,10):"")}">`,{for:"c-nextSession"})}
      ${field("Status",seg("c-status",["Progressing","Plateau","Flare-up","Discharged"],c.status),{full:1,lbl:1})}
    </div></section></div>`;
  },
  actions(p){return p.rec?`<button class="btn del" data-act="delCheckin">Delete</button><button class="btn pri" data-act="saveCheckin" id="c-save">Save changes</button>`:`<button class="btn pri" data-act="saveCheckin" id="c-save">Save check-in</button>`;},
  mount(){
    $("c-client").addEventListener("change",()=>{const e=emailFor($("c-client").value);if(e&&!$("c-email").value)$("c-email").value=e;});
    $("c-redFlags").addEventListener("segchange",()=>$("c-flagWarn").hidden=!pillVals("c-redFlags").length);
  }
};
function collectCheckin(){return {staff:val("c-staff"),client:val("c-client").replace(/\s+/g," "),email:val("c-email"),date:val("c-date"),sessionType:segVal("c-sessionType"),
  bodyArea:val("c-bodyArea"),side:segVal("c-side"),diagnosis:val("c-diagnosis"),mechanism:segVal("c-mechanism"),
  painNow:+$("c-painNow").value,painWorst:+$("c-painWorst").value,painActivity:+$("c-painActivity").value,trend:segVal("c-trend"),
  aggravating:pillVals("c-aggravating"),swelling:segVal("c-swelling"),confidence:+$("c-confidence").value,objective:val("c-objective"),
  adherence:segVal("c-adherence"),sessionsWeek:val("c-sessionsWeek")===""?"":+val("c-sessionsWeek"),sleep:segVal("c-sleep"),
  redFlags:pillVals("c-redFlags"),doneToday:val("c-doneToday"),plan:val("c-plan"),nextSession:val("c-nextSession"),status:segVal("c-status")};}
ACT.saveCheckin=async()=>{
  const top=stack()[stack().length-1], d=collectCheckin(); let bad=null;
  const showErr=(id,msg)=>{const e=$(id);e.textContent=msg||"";e.hidden=!msg;if(msg&&!bad)bad=e;};
  showErr("e-client",d.client?"":"Add the client's full name"); showErr("e-bodyArea",d.bodyArea?"":"Choose a body area");
  if(d.email&&!validEmail(d.email)){toast("That email doesn't look right",true);return;}
  if(bad){bad.closest(".section").scrollIntoView({behavior:"smooth",block:"center"});return;}
  const b=$("c-save");b.disabled=true;b.textContent="Saving…";
  try{
    if(top.params.rec){await api("updateCheckin",top.params.rec.id,d);toast("Changes saved");}
    else{d.id=crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random();await api("saveCheckinApp",d);toast(d.redFlags.length?"Saved · red flag recorded":"Check-in saved");}
    await reload(); pop();
  }catch(e){toast(e.message,true);b.disabled=false;b.textContent=top.params.rec?"Save changes":"Save check-in";}
};
ACT.delCheckin=()=>{const r=stack()[stack().length-1].params.rec;
  openSheet("Delete this check-in?",`${esc(r.client)} · ${fdate(r.date)}. This can't be undone. The deletion is logged.`,`<div class="btns"><button class="btn sec" data-act="close">Cancel</button><button class="btn pri" style="background:var(--red);color:#fff" data-act="delConfirm">Delete</button></div>`);};
ACT.delConfirm=async()=>{const r=stack()[stack().length-1].params.rec;try{await api("deleteCheckin",r.id);closeSheet();toast("Check-in deleted");await reload();pop();}catch(e){toast(e.message,true);}};
async function editCheckin(id){try{const rec=await api("getCheckin",id);push("checkin",{rec});}catch(e){toast(e.message,true);}}
ACT.editCheckin=d=>editCheckin(d.id);

/* ---------- INTAKE ---------- */
PAGES.intake={
  html(){return `${head({back:true,title:"Force plate intake",sub:"Builds the prompt for GymGeek Analyse"})}
  <div class="stack" style="margin-top:22px">
  <section class="section"><h3>Type</h3>${seg("i-type",["New report","Retest",["Readiness check","Readiness"]],"New report")}</section>
  <section class="section"><h3>Athlete</h3><div class="fgrid">
    ${field("Full name",`<input id="i-name" list="dl-clients" autocomplete="off" autocapitalize="words" placeholder="e.g. Sam Carter">`,{full:1,for:"i-name"})}
    ${field("Email",`<input id="i-email" type="email" inputmode="email" autocomplete="off" placeholder="For reports and programmes">`,{full:1,for:"i-email"})}
    ${field("Sex",seg("i-sex",["Male","Female"],"Male"),{full:1,lbl:1,attr:'data-i="full"'})}
    ${field("Date of birth",`<input id="i-dob" type="date">`,{for:"i-dob",help:"Used to work out age only. Not saved.",attr:'data-i="full"'})}
    ${field("Test date",`<input id="i-date" type="date" value="${today()}">`,{for:"i-date"})}
    ${field("Height (cm)",`<input id="i-height" type="number" inputmode="decimal" step="0.1">`,{for:"i-height",attr:'data-i="full"'})}
    ${field("Sitting height (cm)",`<input id="i-sit" type="number" inputmode="decimal" step="0.1">`,{for:"i-sit",help:"For the growth estimate (under 18s)",attr:'data-i="youth"'})}
    ${field("Sport",`<input id="i-sport" list="dl-sports" autocomplete="off">`,{for:"i-sport",attr:'data-i="full"'})}
    ${field("Position or event",`<input id="i-pos" autocomplete="off" placeholder="Optional">`,{for:"i-pos",attr:'data-i="full"'})}
    ${field("Level",`<select id="i-level"><option>Active</option><option>Competitive</option><option>Academy</option><option>Elite</option></select>`,{for:"i-level",attr:'data-i="full"'})}
  </div><div class="callout" id="i-warn" hidden></div></section>
  <section class="section" data-i="full"><h3>Comparison groups</h3><div class="fgrid">
    ${field("Group 1 · peer group",`<select id="i-g1"></select>`,{full:1,for:"i-g1"})}
    ${field("Group 2 · long-term goal",`<select id="i-g2"></select>`,{full:1,for:"i-g2"})}</div>
    <label class="check" data-i="retest"><input type="checkbox" id="i-keep" checked> Keep the same groups as last time</label></section>
  <section class="section"><h3>Context</h3>${field("Anything worth knowing",`<textarea id="i-ctx" placeholder="Injury history, ankle mobility, fatigue, goals… (optional)"></textarea>`,{for:"i-ctx"})}
    <label class="check" data-i="full"><input type="checkbox" id="i-photo"> I'm attaching a headshot photo</label></section>
  <section class="section"><h3>Your prompt</h3><div class="mono" id="i-out"></div><div class="help" id="i-attach" style="font-size:13px;color:var(--t2)"></div></section></div>`;},
  actions(){return `<button class="btn pri" data-act="exportIntake">Export</button>`;},
  mount(){ IS.type="New report";IS.sex="Male";IS.lastBand=null; fillGroups(); const v=$("view");
    v.addEventListener("input",updIntake); v.addEventListener("change",updIntake);
    $("i-type").addEventListener("segchange",e=>{IS.type=e.detail;updIntake();}); $("i-sex").addEventListener("segchange",e=>{IS.sex=e.detail;fillGroups();updIntake();});
    $("i-name").addEventListener("change",()=>{const e=emailFor(val("i-name"));if(e&&!val("i-email"))$("i-email").value=e;}); updIntake(); }
};
const IS={type:"New report",sex:"Male",lastBand:null};
function ageAt(dob,date){if(!dob||!date)return null;const a=D(dob),b=D(date);if(!a||!b||b<a)return null;return (b-a)/(365.2425*864e5);}
function fillGroups(){const fem=IS.sex==="Female",list=GROUPS.filter(g=>/female/i.test(g)===fem);["i-g1","i-g2"].forEach((id,i)=>{const el=$(id),cur=el.value;el.innerHTML=list.map(g=>`<option>${esc(g)}</option>`).join("");if(list.includes(cur))el.value=cur;else el.selectedIndex=Math.min(i,list.length-1);});IS.lastBand=null;}
function updIntake(){
  if(!$("i-out"))return;
  const t=IS.type,full=t!=="Readiness check",age=ageAt(val("i-dob"),val("i-date"));
  document.querySelectorAll('[data-i="full"]').forEach(e=>e.hidden=!full);
  document.querySelectorAll('[data-i="youth"]').forEach(e=>e.hidden=!full||!(age!=null&&age<18));
  document.querySelectorAll('[data-i="retest"]').forEach(e=>e.hidden=t!=="Retest");
  const keep=t==="Retest"&&$("i-keep").checked;$("i-g1").disabled=$("i-g2").disabled=keep;
  const band=age==null?null:Math.floor(age/10);
  if(band!==IS.lastBand){IS.lastBand=band;if(age!=null){const sx=IS.sex==="Female"?"Females":"Males",b=age<16?"Under 16":age<40?"Under 40":age<50?"Over 40":"Over 50",g=`Active ${sx} — ${b}`;if([...$("i-g1").options].some(o=>o.value===g))$("i-g1").value=g;}}
  const w=full&&age!=null&&age<18&&/Under 40|Over 40|Over 50/.test($("i-g1").value);$("i-warn").hidden=!w;$("i-warn").textContent=w?"Group 1 is an adult group for an under-18.":"";
  const L=[t],name=val("i-name")||"[name]";
  if(full){const p=[`Athlete: ${name}`,`Sex: ${IS.sex}`,`Age: ${age==null?"[age]":Math.floor(age)+" ("+age.toFixed(1)+")"}`,`Height: ${val("i-height")||"[cm]"}`];
    if(age!=null&&age<18)p.push(`Sitting height: ${val("i-sit")||"[cm]"}`);p.push(`Sport: ${val("i-sport")||"[sport]"}`);if(val("i-pos"))p.push(`Position: ${val("i-pos")}`);
    p.push(`Level: ${val("i-level")}`,`Date: ${fdate(val("i-date"))}`);L.push(p.join(" | "));L.push(keep?"Groups: same as last time":`Groups: ${$("i-g1").value} / ${$("i-g2").value}`);if($("i-photo").checked)L.push("Photo: attached");
  }else L.push(`Athlete: ${name} | Date: ${fdate(val("i-date"))}`);
  if(val("i-ctx"))L.push(`Context: ${val("i-ctx").replace(/\s+/g," ")}`);
  $("i-out").textContent=L.join("\n");
  $("i-attach").innerHTML=t==="New report"?"Attach every CSV from the session"+($("i-photo").checked?" and the headshot.":"."):t==="Retest"?"Attach the previous report (.html) and every CSV from today.":"Attach today's CMJ CSVs (3 jumps).";
}
ACT.exportIntake=async()=>{
  const name=val("i-name"),email=val("i-email");
  if(!name){toast("Add the athlete's name",true);$("i-name").focus();return;}
  if(email&&!validEmail(email)){toast("That email doesn't look right",true);return;}
  const txt=$("i-out").textContent;let ok=false;
  try{await navigator.clipboard.writeText(txt);ok=true;}catch(e){const r=document.createRange();r.selectNodeContents($("i-out"));const s=getSelection();s.removeAllRanges();s.addRange(r);try{ok=document.execCommand("copy");}catch(_){}}
  toast(ok?"Exported · copied, ready to paste":"Selected · tap Copy");
  try{await api("saveIntake",{name,email,type:IS.type,sex:IS.type==="Readiness check"?"":IS.sex,sport:val("i-sport"),level:IS.type==="Readiness check"?"":val("i-level")});reload();}catch(e){}
};

/* ---------- CLIENTS ---------- */
PAGES.clients={
  html(p){const mode=p.mode||"clients";return `${head({title:"Clients",right:`<button class="iconbtn g" data-act="newCheckin" aria-label="New check-in">${ico("plus")}</button>`})}
    <div class="toptabs"><button class="${mode==="clients"?"on":""}" data-act="clientsMode" data-mode="clients">All clients</button><button class="${mode==="recent"?"on":""}" data-act="clientsMode" data-mode="recent">Recent check-ins</button></div>
    <div class="search">${ico("search")}<input id="q" placeholder="${mode==="clients"?"Search clients":"Search client, clinician or area"}" autocomplete="off" aria-label="Search"></div>
    <div id="list" style="margin-top:18px"></div>`;},
  mount(p){const mode=p.mode||"clients";$("q").addEventListener("input",()=>mode==="clients"?drawClients():drawRecent());
    if(mode==="clients")drawClients(); else { $("list").innerHTML=`<div class="stack">${skel(5,62)}</div>`; api("recentCheckins",200).then(r=>{S.recent=r;drawRecent();}).catch(e=>$("list").innerHTML=empty("Couldn't load",esc(e.message))); }}
};
ACT.clientsMode=d=>{stack()[0].params={mode:d.mode};render();};
function drawClients(){
  const q=val("q").toLowerCase(),list=S.data.clients.filter(c=>!q||c.name.toLowerCase().includes(q)||String(c.email).toLowerCase().includes(q));
  if(!list.length){$("list").innerHTML=empty(q?"No matches":"No clients yet",q?"":"Clients appear here after their first check-in or intake.");return;}
  const by={};list.forEach(c=>{const L=c.name[0].toUpperCase();(by[L]=by[L]||[]).push(c);});
  $("list").innerHTML=Object.keys(by).sort().map(L=>`<div class="label" style="margin-top:${L===Object.keys(by).sort()[0]?0:22}px">${L}</div><div class="group">${by[L].map(c=>`<button class="row" data-act="openClientPush" data-name="${esc(c.name)}"><span class="av">${esc(initials(c.name))}</span><span class="main"><span class="t">${esc(c.name)}</span><span class="s">${c.last?"Last seen "+fdate(c.last):esc(c.email||"No email yet")}</span></span><span class="end">${ico("chev","chev")}</span></button>`).join("")}</div>`).join("");
}
function drawRecent(){
  const q=val("q").toLowerCase(),rows=(S.recent||[]).filter(r=>!q||[r.client,r.staff,r.bodyArea,r.status].join(" ").toLowerCase().includes(q));
  $("list").innerHTML=rows.length?`<div class="group">${rows.map(r=>`<button class="row noicon" data-act="${r.id?"editCheckin":"noId"}" data-id="${esc(r.id||"")}"><span class="dot ${r.redFlag===true?"red":r.trend==="Worse"?"amb":r.trend==="Better"?"grn":""}"></span><span class="main"><span class="t">${esc(r.client)}</span><span class="s">${fdate(r.date)} · ${esc([r.bodyArea,r.side].filter(Boolean).join(" "))} · ${esc(r.staff||"")}</span></span><span class="end">${r.status?`<span class="badge">${esc(r.status)}</span>`:""}${ico("chev","chev")}</span></button>`).join("")}</div>`:empty("No check-ins found");
}
ACT.noId=()=>toast("This older check-in can only be edited in the Sheet",true);
ACT.openClientPush=d=>push("client",{name:d.name});

PAGES.client={
  html(p){const c=(S.data.clients||[]).find(x=>x.name===p.name)||{name:p.name,email:""};
    return `${head({back:true,backLabel:"Clients",title:""})}
    <div class="profile"><span class="av">${esc(initials(c.name))}</span><div><h1>${esc(c.name)}</h1><div class="s">${esc(c.email||"No email saved")}</div></div></div>
    <div class="actions"><button class="chipbtn g" data-act="newCheckin" data-name="${esc(c.name)}">${ico("plus")}Check-in</button><button class="chipbtn" data-act="sendTo" data-name="${esc(c.name)}">${ico("send")}Send programme</button></div>
    <div id="tl" class="stack" style="margin-top:26px">${skel(3,150)}</div>`;},
  async mount(p){
    try{const R=await api("clientRecord",p.name);
      const evs=[...R.checkins.map(x=>({k:"c",d:String(x.date),x})),...R.tests.map(x=>({k:"t",d:String(x.date),x})),...R.sends.map(x=>({k:"s",d:String(x.timestamp),x}))].sort((a,b)=>b.d.localeCompare(a.d));
      const n=(v,u)=>v===""||v==null?"–":esc(v)+(u||"");
      $("tl").innerHTML=evs.length?evs.map(e=>{
        if(e.k==="c")return `<article class="ev"><div class="top"><span class="when">${fdate(e.d)} · ${esc(e.x.staff||"")}</span><span>${e.x.redFlag===true?`<span class="badge red">Red flag</span> `:""}<span class="badge">Check-in</span></span></div>
          <h4>${esc([e.x.bodyArea,e.x.side].filter(x=>x&&x!=="N/A").join(" · ")||"Check-in")}${e.x.diagnosis?` <span style="color:var(--t2);font-weight:600">· ${esc(e.x.diagnosis)}</span>`:""}</h4>
          <div class="nums"><div><b>${n(e.x.painNow)}</b>Pain now</div><div><b>${n(e.x.painWorst)}</b>Worst 7 days</div><div><b>${n(e.x.trend)}</b>Trend</div><div><b>${n(e.x.status)}</b>Status</div></div>
          ${e.x.plan?`<p><span style="color:var(--text);font-weight:600">Plan · </span>${esc(e.x.plan)}</p>`:""}${e.x.redFlags?`<p style="color:var(--red)">${esc(e.x.redFlags)}</p>`:""}
          <div class="foot"><span>${e.x.editedBy?`Edited by ${esc(e.x.editedBy)} · ${fshort(e.x.editedAt)}`:""}</span>${e.x.id?`<button data-act="editCheckin" data-id="${esc(e.x.id)}">Edit</button>`:""}</div></article>`;
        if(e.k==="t")return `<article class="ev"><div class="top"><span class="when">${fdate(e.d)}</span><span class="badge grn">${esc(e.x.testType||"Force plate")}</span></div>
          <div class="nums"><div><b>${n(e.x.cmj)}</b>Jump cm</div><div><b>${n(e.x.asym)}</b>Asym %</div><div><b>${n(e.x.rsi)}</b>RSI</div><div><b>${n(e.x.score)}</b>Score</div></div>${e.x.readiness?`<p>Readiness · <span style="color:var(--text);font-weight:600">${esc(e.x.readiness)}</span></p>`:""}</article>`;
        return `<article class="ev"><div class="top"><span class="when">${fdate(e.d)} · ${esc(e.x.staff||"")}</span><span class="badge">Programme sent</span></div><h4>${esc(e.x.programme)}</h4><p>Emailed to ${esc(e.x.email)}</p></article>`;
      }).join(""):empty("Nothing recorded yet","Start with a check-in.");
    }catch(e){$("tl").innerHTML=empty("Couldn't load",esc(e.message));}
  }
};
ACT.sendTo=d=>sendSheet(null,(S.data.clients||[]).find(c=>c.name===d.name)||{name:d.name,email:""});

/* ---------- PROGRAMMES ---------- */
PAGES.progs={
  html(){return `${head({title:"Programmes",sub:"Branded rehab PDFs, ready to send",right:`<button class="iconbtn g" data-act="newProg" aria-label="Add programme">${ico("plus")}</button>`})}
    <div class="search">${ico("search")}<input id="q" placeholder="Search programmes" autocomplete="off" aria-label="Search programmes"></div><div id="list" style="margin-top:18px"></div>`;},
  mount(){$("q").addEventListener("input",drawProgs);drawProgs();}
};
function drawProgs(){
  const q=val("q").toLowerCase(),list=(S.data.programmes||[]).filter(p=>!q||[p.title,p.area,p.summary].join(" ").toLowerCase().includes(q));
  if(!list.length){$("list").innerHTML=q?empty("No matches"):empty("No programmes yet",`Upload your first programme PDF and it becomes a branded GymGeek Analyse PDF.<div style="margin-top:18px"><button class="chipbtn g" data-act="newProg">${ico("plus")}Add programme</button></div>`);return;}
  const by={};list.forEach(p=>(by[p.area||"Other"]=by[p.area||"Other"]||[]).push(p));const keys=Object.keys(by).sort();
  $("list").innerHTML=keys.map((a,i)=>`<div class="label" style="margin-top:${i?22:0}px">${esc(a)}</div><div class="group">${by[a].sort((x,y)=>x.title.localeCompare(y.title)).map(p=>`<button class="row" data-act="progMenu" data-id="${esc(p.id)}"><span class="lead">${ico("doc")}</span><span class="main"><span class="t">${esc(p.title)}</span><span class="s">${esc(p.summary||"Updated "+fdate(p.updated))}</span></span><span class="end">${ico("more","chev")}</span></button>`).join("")}</div>`).join("");
}
ACT.progMenu=d=>{const p=S.data.programmes.find(x=>x.id===d.id);
  openSheet(esc(p.title),esc(p.area||""),`<div class="group" style="background:var(--s2)">
    <button class="row" data-act="sendProg" data-id="${esc(p.id)}"><span class="lead" style="background:var(--green);color:#0B0C0E">${ico("send")}</span><span class="main"><span class="t">Send to a client</span></span></button>
    <button class="row" data-act="previewProg" data-id="${esc(p.id)}"><span class="lead">${ico("eye")}</span><span class="main"><span class="t">Preview PDF</span></span></button>
    <button class="row" data-act="editProg" data-id="${esc(p.id)}"><span class="lead">${ico("edit")}</span><span class="main"><span class="t">Edit</span></span></button></div>
    <button class="btn sec" data-act="close">Close</button>`);};
ACT.sendProg=d=>sendSheet(d.id,null);
ACT.previewProg=d=>previewPdf(d.id,"");
ACT.editProg=async d=>{closeSheet();try{const p=await api("getProgramme",d.id);S.tab="progs";push("prog",{p});}catch(e){toast(e.message,true);}};
ACT.newProg=()=>{closeSheet();S.tab="progs";push("prog",{p:null});};
PAGES.prog={
  html(o){const p=o.p||{};return `${head({back:true,backLabel:"Programmes",title:p.id?"Edit programme":"New programme"})}
  <div class="stack" style="margin-top:22px">
  <section class="section"><label class="drop" for="p-file">${ico("doc")}<b>Upload a programme PDF</b><span>It's converted into a GymGeek Analyse PDF</span></label><input type="file" id="p-file" accept="application/pdf" hidden><div class="help" id="p-status" aria-live="polite" style="text-align:center;font-size:13px"></div></section>
  <section class="section"><h3>Details</h3><div class="fgrid">
    ${field("Title",`<input id="p-title" placeholder="e.g. ACL Early Phase" value="${esc(p.title||"")}">`,{full:1,for:"p-title"})}
    ${field("Body area",`<select id="p-area"><option value="">Choose…</option>${AREAS.map(a=>`<option ${a===p.area?"selected":""}>${a}</option>`).join("")}</select>`,{for:"p-area"})}
    ${field("Summary",`<textarea id="p-summary" style="min-height:72px" placeholder="One or two lines on what it's for">${esc(p.summary||"")}</textarea>`,{full:1,for:"p-summary"})}</div></section>
  <section class="section"><h3>Content</h3>
    <div class="tools"><button type="button" data-act="ins" data-t="# ">Heading</button><button type="button" data-act="ins" data-t="## ">Subheading</button><button type="button" data-act="ins" data-t="- ">Bullet</button><button type="button" data-act="ins" data-t="Exercise | Sets | Reps / time | RIR | Rest | Notes">Table header</button><button type="button" data-act="ins" data-t="A · Exercise name | 3 | 10 |  |  | ">Exercise row</button></div>
    <textarea id="p-content" aria-label="Programme content" placeholder="# Day One&#10;## Workout&#10;Exercise | Sets | Reps / time | RIR | Rest | Notes&#10;A · Depth Jump | 3 | 6 | 0 | 3 min |">${esc(p.content||"")}</textarea>
    <div class="help"># heading · ## subheading · - bullet · lines with | become a table (first line is the header). Codes like B1 · Name show as badges and same-letter rows group as a superset.</div></section></div>`;},
  actions(o){return (o.p&&o.p.id?`<button class="btn del" data-act="delProg">Delete</button>`:"")+`<button class="btn sec" data-act="saveProg" data-preview="1">Preview</button><button class="btn pri" data-act="saveProg" id="p-save">Save</button>`;},
  mount(){$("p-file").addEventListener("change",async()=>{const f=$("p-file").files[0];if(!f)return;if(f.size>15e6){toast("That PDF is over 15 MB",true);return;}
    $("p-status").textContent="Converting "+f.name+"…";
    try{const r=await api("readPdf",await readFile(f),f.name);
      if(!val("p-title"))$("p-title").value=r.title||f.name.replace(/\.pdf$/i,"").replace(/[_-]+/g," ");
      if(r.area&&!val("p-area"))$("p-area").value=r.area; if(r.summary&&!val("p-summary"))$("p-summary").value=r.summary;
      $("p-content").value=r.text;$("p-status").textContent=r.smart?"Converted. Give it a quick check, then Preview.":"Text pulled out. Tidy it below, then Preview.";
    }catch(e){$("p-status").textContent="";toast(e.message,true);}});}
};
ACT.ins=d=>{const ta=$("p-content"),s=ta.selectionStart,before=ta.value.slice(0,s),nl=before&&!before.endsWith("\n")?"\n":"",ins=nl+d.t;ta.value=before+ins+ta.value.slice(ta.selectionEnd);ta.focus();ta.selectionStart=ta.selectionEnd=s+ins.length;};
ACT.saveProg=async d=>{
  const top=stack()[stack().length-1],p={id:top.params.p&&top.params.p.id||"",title:val("p-title"),area:val("p-area"),summary:val("p-summary"),content:$("p-content").value};
  if(!p.title){toast("Give the programme a title",true);$("p-title").focus();return;}
  try{const r=await api("saveProgramme",p);top.params.p=Object.assign(p,{id:r.id});await reload();
    if(d.preview){$("actions").innerHTML=PAGES.prog.actions(top.params);previewPdf(r.id,"");}else{toast("Programme saved");pop();}}
  catch(e){toast(e.message,true);}
};
ACT.delProg=()=>openSheet("Delete this programme?","It's removed from the library. PDFs already sent aren't affected.",`<div class="btns"><button class="btn sec" data-act="close">Cancel</button><button class="btn pri" style="background:var(--red);color:#fff" data-act="delProgYes">Delete</button></div>`);
ACT.delProgYes=async()=>{const p=stack()[stack().length-1].params.p;try{await api("deleteProgramme",p.id);closeSheet();await reload();toast("Programme deleted");pop();}catch(e){toast(e.message,true);}};
async function previewPdf(id,client){
  openSheet("Preview","",`<div class="sk" style="height:60vh"></div>`);
  try{const r=await api("programmePdf",id,client||""),url=blobUrl(r.data,"application/pdf");
    openSheet("Preview",esc(r.name),`<iframe class="preview" src="${url}" title="PDF preview"></iframe><div class="btns"><a class="btn sec" href="${url}" download="${esc(r.name)}" style="text-decoration:none">Download</a><button class="btn pri" data-act="close">Done</button></div>`);
  }catch(e){openSheet("Preview",esc(e.message),`<button class="btn sec" data-act="close">Close</button>`);}
}
function sendSheet(progId,client){
  const progs=S.data.programmes||[];
  if(!progs.length){toast("Add a programme to the library first",true);return;}
  openSheet("Send a programme","Emailed as a branded PDF with the client's name on it",`
    ${field("Programme",`<select id="s-prog">${progs.map(p=>`<option value="${esc(p.id)}" ${p.id===progId?"selected":""}>${esc(p.title)}${p.area?" · "+esc(p.area):""}</option>`).join("")}</select>`,{for:"s-prog"})}
    ${field("Client",`<input id="s-client" list="dl-clients" autocomplete="off" value="${esc(client?client.name:"")}" placeholder="Start typing a name">`,{for:"s-client"})}
    ${field("Email",`<input id="s-email" type="email" inputmode="email" value="${esc(client?client.email:"")}" placeholder="client@email.com">`,{for:"s-email"})}
    ${field("Personal note",`<textarea id="s-msg" style="min-height:76px" placeholder="Optional · e.g. Start with Day One this week and we'll review on Thursday."></textarea>`,{for:"s-msg"})}
    <div class="btns"><button class="btn sec" data-act="sendPreview">Preview</button><button class="btn pri" data-act="sendGo" id="s-go">Send</button></div>`);
  $("s-client").addEventListener("change",()=>{const e=emailFor(val("s-client"));if(e)$("s-email").value=e;});
}
ACT.sendPreview=()=>{const id=val("s-prog"),c=val("s-client");previewPdf(id,c);};
ACT.sendGo=async()=>{const c=val("s-client"),em=val("s-email");
  if(!c){toast("Add the client's name",true);return;} if(!validEmail(em)){toast("Add a valid email",true);return;}
  const b=$("s-go");b.disabled=true;b.textContent="Sending…";
  try{await api("sendProgramme",val("s-prog"),c,em,val("s-msg"));closeSheet();toast("Sent to "+em);reload();}catch(e){toast(e.message,true);b.disabled=false;b.textContent="Send";}};

/* ---------- CALENDAR ---------- */
function weekStart(off){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7)+7*(off||0));return d;}
const staffCol=n=>STAFF_COLS[Math.max(0,S.data.staff.findIndex(s=>s.name===n))%STAFF_COLS.length];
function evRow(e){return `<div class="evrow"><span class="bar" style="background:${staffCol(e.staff)}"></span><span class="time">${e.allDay?"All day":ftime(e.start)+"–"+ftime(e.end)}</span><span class="main"><span class="t" style="display:block">${esc(e.title)}</span><span class="s">${esc(e.staff)}${e.location?" · "+esc(e.location):""}</span></span></div>`;}
PAGES.cal={
  html(){const ws=weekStart(S.calOffset),we=new Date(ws.getTime()+6*864e5);
    const any=S.data.staff.some(s=>s.hasCalendar);
    return `${head({title:"Calendar",sub:"Everyone's Google calendars in one place"})}
    ${any?`<div class="weeknav"><button data-act="calWeek" data-d="-1" aria-label="Previous week">${ico("left")}</button><b>${S.calOffset===0?"This week":fshort(ymd(ws))+" – "+fshort(ymd(we))}</b><button data-act="calWeek" data-d="1" aria-label="Next week">${ico("right")}</button></div>
    <div class="chips">${S.data.staff.filter(s=>s.hasCalendar).map(s=>`<button class="chip ${S.calOff.includes(s.name)?"off":""}" data-act="calToggle" data-name="${esc(s.name)}"><i style="background:${staffCol(s.name)}"></i>${esc(s.name)}</button>`).join("")}</div>
    <div id="cal">${skel(4,70)}</div>`:`<div class="card" style="margin-top:22px"><div class="empty" style="padding:12px"><b>Connect your calendars</b>Each staff member shares their Google calendar with the app's Google account, then their email is added in the app settings. Ask Joe to set this up.</div></div>`}`;},
  async mount(){ if(!$("cal"))return; const ws=weekStart(S.calOffset);
    try{const r=await api("teamCalendar",ymd(ws),7);S.calData=r;drawCal();}catch(e){$("cal").innerHTML=empty("Couldn't load calendars",esc(e.message));} }
};
function drawCal(){
  const r=S.calData,ws=weekStart(S.calOffset),evs=r.events.filter(e=>!S.calOff.includes(e.staff));
  let h="";for(let i=0;i<7;i++){const d=new Date(ws.getTime()+i*864e5),k=ymd(d),list=evs.filter(e=>e.start.slice(0,10)===k||(e.allDay&&e.start.slice(0,10)<=k&&e.end.slice(0,10)>k));
    h+=`<div class="day ${k===today()?"today":""}">${d.toLocaleDateString("en-GB",{weekday:"long"})}<span>${d.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</span></div><div class="group">${list.length?list.map(evRow).join(""):`<div class="evrow"><span class="s" style="color:var(--t3)">Nothing scheduled</span></div>`}</div>`;}
  if(r.missing&&r.missing.length)h+=`<div class="callout info" style="margin-top:22px">Couldn't read ${esc(r.missing.join(", "))}'s calendar. Check it's shared with the app's Google account.</div>`;
  $("cal").innerHTML=h;
}
ACT.calWeek=d=>{S.calOffset+=+d.d;render();};
ACT.calToggle=d=>{const i=S.calOff.indexOf(d.name);if(i>=0)S.calOff.splice(i,1);else S.calOff.push(d.name);LS.set("gg_caloff",S.calOff);if(S.calData){document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("off",S.calOff.includes(c.dataset.name)));drawCal();}};

/* ---------- ADMIN ---------- */
PAGES.admin={
  html(){const st=S.data.stats.maint;return `${head({title:"Admin",sub:"Maintenance, documents and compliance"})}
    <div class="label">Weekly</div>
    <div class="group"><button class="row" data-act="maint"><span class="lead">${ico("tool")}</span><span class="main"><span class="t">Maintenance checklist</span><span class="s">${st.total?`${st.done} of ${st.total} done this week`:"Ready for your checklist items"}</span></span><span class="end">${st.total&&st.done===st.total?`<span class="badge grn">Done</span>`:""}${ico("chev","chev")}</span></button></div>
    <div class="label">Documents</div>
    <div class="group">${S.data.categories.map(c=>`<button class="row" data-act="docsCat" data-cat="${esc(c)}"><span class="lead">${ico(c==="Insurance"?"shield":c==="Risk assessments"?"flag":"doc")}</span><span class="main"><span class="t">${esc(c)}</span></span><span class="end">${ico("chev","chev")}</span></button>`).join("")}</div>
    ${isAdmin()?`<div class="label">Admin only</div><div class="group"><button class="row" data-act="activity"><span class="lead">${ico("clock")}</span><span class="main"><span class="t">Activity log</span><span class="s">Who added, edited, sent or ticked what, and when</span></span><span class="end">${ico("chev","chev")}</span></button><button class="row" data-act="staffInfo"><span class="lead">${ico("user")}</span><span class="main"><span class="t">Staff access</span><span class="s">${S.data.staff.length} people</span></span><span class="end">${ico("chev","chev")}</span></button></div>`:""}`;}
};
ACT.maint=()=>push("maint",{off:0});
ACT.docsCat=d=>push("docs",{cat:d.cat});
ACT.activity=()=>push("activity",{});
ACT.staffInfo=()=>openSheet("Staff access","Each person signs in with their own code. Codes and roles are set in the app settings (Code.gs).",`<div class="group" style="background:var(--s2)">${S.data.staff.map(s=>`<div class="row"><span class="av">${esc(initials(s.name))}</span><span class="main"><span class="t">${esc(s.name)}</span><span class="s">${s.hasCalendar?"Calendar connected":"No calendar connected"}</span></span></div>`).join("")}</div><button class="btn sec" data-act="close">Close</button>`);

/* maintenance */
PAGES.maint={
  html(p){return `${head({back:true,backLabel:"Admin",title:"Maintenance",right:isAdmin()?`<button class="iconbtn" data-act="maintItems" aria-label="Edit checklist items">${ico("edit")}</button>`:""})}
    <div class="weeknav"><button data-act="maintWeek" data-d="-1" aria-label="Previous week">${ico("left")}</button><b id="m-week">This week</b><button data-act="maintWeek" data-d="1" aria-label="Next week" ${p.off>=0?"disabled style='opacity:.3'":""}>${ico("right")}</button></div>
    <div id="m-body" style="margin-top:18px">${skel(4,62)}</div>`;},
  async mount(p){
    try{const r=await api("getMaintenance",p.off||0);S.maint=r;drawMaint();}catch(e){$("m-body").innerHTML=empty("Couldn't load",esc(e.message));}
  }
};
function drawMaint(){
  const r=S.maint,ws=D(r.week),off=stack()[stack().length-1].params.off||0;
  $("m-week").textContent=off===0?"This week":"Week of "+fdate(r.week);
  if(!r.items.length){$("m-body").innerHTML=`<div class="card">${empty("No checklist items yet",isAdmin()?`Add the weekly checks here, or send Claude your maintenance spreadsheet to set them up.<div style="margin-top:18px"><button class="chipbtn g" data-act="maintItems">${ico("plus")}Add items</button></div>`:"An admin will add the weekly checks soon.")}</div>`;return;}
  const done=r.items.filter(i=>i.log&&(i.log.done===true||i.log.done==="TRUE")).length,pct=done/r.items.length,C=2*Math.PI*30;
  const by={};r.items.forEach(i=>(by[i.area||"General"]=by[i.area||"General"]||[]).push(i));
  $("m-body").innerHTML=`<div class="card progress"><div class="ring"><svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="30" fill="none" stroke="var(--s3)" stroke-width="7"/><circle cx="36" cy="36" r="30" fill="none" stroke="var(--green)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${C*pct} ${C}"/></svg><b>${Math.round(pct*100)}%</b></div><div><div style="font:800 20px var(--display);letter-spacing:-.02em">${done} of ${r.items.length} checks done</div><div style="font-size:13px;color:var(--t2);margin-top:4px">${done===r.items.length?"All done for this week.":"Tap a check when it's complete."}</div></div></div>`+
  Object.keys(by).map(a=>`<div class="label">${esc(a)}</div><div class="group">${by[a].map(i=>{const on=i.log&&(i.log.done===true||i.log.done==="TRUE");return `<div class="row ${on?"done":""}"><button class="tick ${on?"on":""}" data-act="maintTick" data-id="${esc(i.id)}" aria-label="${on?"Mark not done":"Mark done"}: ${esc(i.item)}"></button><span class="main"><span class="t">${esc(i.item)}</span><span class="s">${on?`${esc(i.log.by)} · ${fshort(i.log.at)} ${ftime(i.log.at)}`:"Not done yet"}${i.log&&i.log.note?" · "+esc(i.log.note):""}</span></span><button class="end" data-act="maintNote" data-id="${esc(i.id)}" aria-label="Add a note">${ico("more","chev")}</button></div>`;}).join("")}</div>`).join("");
}
ACT.maintWeek=d=>{const top=stack()[stack().length-1];const n=(top.params.off||0)+(+d.d);if(n>0)return;top.params.off=n;render();};
ACT.maintTick=async d=>{const r=S.maint,i=r.items.find(x=>x.id===d.id),on=!(i.log&&(i.log.done===true||i.log.done==="TRUE"));
  i.log=Object.assign(i.log||{},{done:on,by:S.me.name,at:new Date().toISOString().slice(0,16)});drawMaint();
  try{await api("tickMaintenance",r.week,d.id,on,null);reload();}catch(e){toast(e.message,true);i.log.done=!on;drawMaint();}};
ACT.maintNote=d=>{const i=S.maint.items.find(x=>x.id===d.id);
  openSheet(esc(i.item),"Add a note, for example a fault found or a part ordered",`${field("Note",`<textarea id="m-note">${esc(i.log&&i.log.note||"")}</textarea>`,{for:"m-note"})}<div class="btns"><button class="btn sec" data-act="close">Cancel</button><button class="btn pri" data-act="maintNoteSave" data-id="${esc(i.id)}">Save</button></div>`);};
ACT.maintNoteSave=async d=>{const r=S.maint,i=r.items.find(x=>x.id===d.id),note=val("m-note"),on=!!(i.log&&(i.log.done===true||i.log.done==="TRUE"));
  try{await api("tickMaintenance",r.week,d.id,on,note);i.log=Object.assign(i.log||{},{note,by:S.me.name,at:new Date().toISOString().slice(0,16),done:on});closeSheet();drawMaint();toast("Note saved");}catch(e){toast(e.message,true);}};
ACT.maintItems=()=>push("mitems",{});
PAGES.mitems={
  html(){return `${head({back:true,backLabel:"Maintenance",title:"Checklist items",sub:"What needs checking every week"})}
    <section class="section" style="margin-top:22px"><h3>Add an item</h3><div class="fgrid">${field("Item",`<input id="mi-item" placeholder="e.g. Check cable machine cables for fraying">`,{full:1,for:"mi-item"})}${field("Area",`<input id="mi-area" list="dl-areas" placeholder="e.g. Gym floor">`,{for:"mi-area"})}<div class="field" style="justify-content:flex-end"><button class="btn pri" data-act="miAdd">Add</button></div></div><datalist id="dl-areas"></datalist></section>
    <div id="mi-list" style="margin-top:22px"></div>`;},
  mount(){drawItems();}
};
function drawItems(){const items=(S.maint&&S.maint.items)||[];$("dl-areas").innerHTML=[...new Set(items.map(i=>i.area).filter(Boolean))].map(a=>`<option value="${esc(a)}">`).join("");
  $("mi-list").innerHTML=items.length?`<div class="group">${items.map(i=>`<div class="row noicon"><span class="main"><span class="t">${esc(i.item)}</span><span class="s">${esc(i.area||"General")}</span></span><button class="end" data-act="miRemove" data-id="${esc(i.id)}" aria-label="Remove ${esc(i.item)}" style="color:var(--red)">${ico("trash")}</button></div>`).join("")}</div>`:empty("No items yet");}
ACT.miAdd=async()=>{const item=val("mi-item"),area=val("mi-area");if(!item){toast("Add the item",true);return;}
  try{await api("saveMaintItem",{item,area});S.maint=await api("getMaintenance",0);$("mi-item").value="";drawItems();toast("Item added");reload();}catch(e){toast(e.message,true);}};
ACT.miRemove=async d=>{try{await api("removeMaintItem",d.id);S.maint=await api("getMaintenance",0);drawItems();toast("Item removed");reload();}catch(e){toast(e.message,true);}};

/* documents */
PAGES.docs={
  html(p){return `${head({back:true,backLabel:"Admin",title:esc(p.cat||"Documents"),right:isAdmin()?`<button class="iconbtn g" data-act="docAdd" aria-label="Add document">${ico("plus")}</button>`:""})}<div id="d-list" style="margin-top:22px">${skel(3,62)}</div>`;},
  async mount(p){try{S.docs=await api("listDocs");drawDocs(p.cat);}catch(e){$("d-list").innerHTML=empty("Couldn't load",esc(e.message));}}
};
function reviewBadge(r){if(!r)return"";const d=D(r),days=(d-new Date())/864e5;return days<0?`<span class="badge red">Overdue</span>`:days<=30?`<span class="badge amb">Review ${fshort(r)}</span>`:`<span class="badge">Review ${fshort(r)}</span>`;}
function drawDocs(cat){
  const list=(S.docs||[]).filter(d=>!cat||d.category===cat);
  $("d-list").innerHTML=list.length?`<div class="group">${list.map(d=>`<button class="row" data-act="docOpen" data-id="${esc(d.id)}"><span class="lead">${ico(d.kind==="link"?"link":"doc")}</span><span class="main"><span class="t">${esc(d.title)}</span><span class="s">${cat?"":esc(d.category)+" · "}Added by ${esc(d.by)} · ${fshort(d.added)}</span></span><span class="end">${reviewBadge(d.review)}${isAdmin()?`<span data-act="docMenu" data-id="${esc(d.id)}" role="button" aria-label="Options" style="display:grid;place-items:center;width:32px;height:32px">${ico("more","chev")}</span>`:ico("chev","chev")}</span></button>`).join("")}</div>`
    :`<div class="card">${empty("Nothing here yet",isAdmin()?`Upload a file or add a link to a document you already host.<div style="margin-top:18px"><button class="chipbtn g" data-act="docAdd">${ico("plus")}Add document</button></div>`:"An admin will add documents here.")}</div>`;
}
ACT.docOpen=async(d)=>{
  const doc=S.docs.find(x=>x.id===d.id); if(doc.kind==="link"){window.open(doc.url,"_blank");return;}
  openSheet(esc(doc.title),"Opening…",`<div class="sk" style="height:50vh"></div>`);
  try{const r=await api("openDoc",d.id),url=blobUrl(r.data,r.mime),inline=/pdf|image/.test(r.mime);
    openSheet(esc(doc.title),esc(r.name),`${inline?(/image/.test(r.mime)?`<img src="${url}" alt="${esc(doc.title)}" style="width:100%;border-radius:12px">`:`<iframe class="preview" src="${url}" title="${esc(doc.title)}"></iframe>`):`<div class="callout info">This file type can't be previewed here. Download it to open.</div>`}<div class="btns"><a class="btn sec" href="${url}" download="${esc(r.name)}" style="text-decoration:none">Download</a><button class="btn pri" data-act="close">Done</button></div>`);
  }catch(e){openSheet("Couldn't open",esc(e.message),`<button class="btn sec" data-act="close">Close</button>`);}};
ACT.docMenu=d=>{const doc=S.docs.find(x=>x.id===d.id);
  openSheet(esc(doc.title),esc(doc.category),`${field("Title",`<input id="dm-title" value="${esc(doc.title)}">`,{for:"dm-title"})}${field("Category",`<select id="dm-cat">${S.data.categories.map(c=>`<option ${c===doc.category?"selected":""}>${esc(c)}</option>`).join("")}</select>`,{for:"dm-cat"})}${field("Review date",`<input id="dm-review" type="date" value="${esc(doc.review?String(doc.review).slice(0,10):"")}">`,{for:"dm-review",help:"Shows as due for review 30 days before"})}
  <div class="btns"><button class="btn del" data-act="docDel" data-id="${esc(doc.id)}">Delete</button><button class="btn pri" data-act="docSave" data-id="${esc(doc.id)}">Save</button></div>`);};
ACT.docSave=async d=>{try{await api("updateDoc",d.id,{title:val("dm-title"),category:val("dm-cat"),review:val("dm-review")});closeSheet();toast("Saved");S.docs=await api("listDocs");drawDocs(stack()[stack().length-1].params.cat);reload();}catch(e){toast(e.message,true);}};
ACT.docDel=async d=>{try{await api("deleteDoc",d.id);closeSheet();toast("Document deleted");S.docs=await api("listDocs");drawDocs(stack()[stack().length-1].params.cat);reload();}catch(e){toast(e.message,true);}};
ACT.docAdd=()=>{const cat=stack()[stack().length-1].params.cat||"Other";
  openSheet("Add a document","Upload a file, or link to one you already host",`<div class="toptabs" style="margin:0"><button class="on" data-act="docMode" data-m="file">Upload file</button><button data-act="docMode" data-m="link">Add link</button></div>
  <div id="da-file">${field("File",`<input id="da-upload" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png">`,{for:"da-upload",help:"PDF works best · up to 20 MB"})}</div>
  <div id="da-link" hidden>${field("Link",`<input id="da-url" type="url" placeholder="https://">`,{for:"da-url"})}</div>
  ${field("Title",`<input id="da-title" placeholder="e.g. Public liability insurance 2026">`,{for:"da-title"})}
  ${field("Category",`<select id="da-cat">${S.data.categories.map(c=>`<option ${c===cat?"selected":""}>${esc(c)}</option>`).join("")}</select>`,{for:"da-cat"})}
  ${field("Review date",`<input id="da-review" type="date">`,{for:"da-review",help:"Optional · for renewals and annual reviews"})}
  <div class="btns"><button class="btn sec" data-act="close">Cancel</button><button class="btn pri" data-act="docAddGo" id="da-go">Add</button></div>`);};
ACT.docMode=d=>{document.querySelectorAll('[data-act="docMode"]').forEach(b=>b.classList.toggle("on",b.dataset.m===d.m));$("da-file").hidden=d.m!=="file";$("da-link").hidden=d.m!=="link";};
ACT.docAddGo=async()=>{const isFile=!$("da-file").hidden,meta={title:val("da-title"),category:val("da-cat"),review:val("da-review")},b=$("da-go");
  try{ if(isFile){const f=$("da-upload").files[0];if(!f){toast("Choose a file",true);return;}if(f.size>20e6){toast("That file is over 20 MB",true);return;}
      b.disabled=true;b.textContent="Uploading…";await api("uploadDoc",await readFile(f),f.name,f.type,Object.assign(meta,{title:meta.title||f.name.replace(/\.[^.]+$/,"")}));}
    else{const url=val("da-url");if(!/^https?:\/\//.test(url)){toast("Add a full link starting https://",true);return;}b.disabled=true;await api("addDocLink",Object.assign(meta,{url,title:meta.title||url}));}
    closeSheet();toast("Document added");S.docs=await api("listDocs");drawDocs(stack()[stack().length-1].params.cat);reload();
  }catch(e){toast(e.message,true);b.disabled=false;b.textContent="Add";}};

/* activity */
PAGES.activity={
  html(){return `${head({back:true,backLabel:"Admin",title:"Activity log",sub:"Every change, by everyone"})}<div class="search">${ico("search")}<input id="q" placeholder="Search staff, client or action" aria-label="Search activity"></div><div id="a-list" style="margin-top:18px">${skel(6,62)}</div>`;},
  async mount(){try{S.act=await api("activity",400);$("q").addEventListener("input",drawAct);drawAct();}catch(e){$("a-list").innerHTML=empty("Couldn't load",esc(e.message));}}
};
function drawAct(){const q=val("q").toLowerCase(),rows=(S.act||[]).filter(a=>!q||[a.staff,a.action,a.type,a.record,a.client,a.details].join(" ").toLowerCase().includes(q));
  const col=a=>/Deleted|Removed/.test(a.action)?"red":/Edited|Unticked/.test(a.action)?"amb":"grn";
  $("a-list").innerHTML=rows.length?`<div class="group">${rows.map(a=>`<div class="row noicon" style="align-items:flex-start"><span class="dot ${col(a)}" style="margin-top:8px"></span><span class="main"><span class="t" style="white-space:normal">${esc(a.staff)} ${esc(String(a.action).toLowerCase())} ${esc(String(a.type).toLowerCase())}${a.client?" · "+esc(a.client):""}</span><span class="s" style="white-space:normal">${esc(a.record||"")}${a.details?" · "+esc(a.details):""}</span></span><span class="end" style="white-space:nowrap">${fshort(a.timestamp)} ${ftime(a.timestamp)}</span></div>`).join("")}</div>`:empty("No activity found");}

window.__ggStarted=true;
start();
