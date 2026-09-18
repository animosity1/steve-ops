const STORE='steve-ops-v1';
const DEADLINE=new Date('2026-09-26T04:59:00Z'); // Sep 25 11:59pm CT (CDT UTC-5)
const DEFAULT={
  loops:[
    {id:'l1',title:'#gamdom100k ends Sep 25',notes:'10 winners x $10k. Promote Gamdom + code Steve. Tag Gamdom, Beekay, Adukes. Pin hygiene.',status:'FIRE'},
    {id:'l2',title:'Corvette raffle rules vs VIP gam-balance loop',notes:'Never-ending raffle risk if they take gam balance. Lock clean rules with Adukes.',status:'FIRE'},
    {id:'l3',title:'$500k wager / 30 days: Corvette vs cash',notes:'One clean public answer so the VIP loop stops eating itself.',status:'FIRE'},
    {id:'l4',title:'Rams season box handoff',notes:'Steve cannot attend. Shortlist Gamdom VIPs / Motion buyers / IRL friends + offer messages.',status:'ACTIVE'},
    {id:'l5',title:'Motion pouch overnight orders',notes:'Orders shipping. Status board + customer reply templates so pings die.',status:'ACTIVE'},
    {id:'l6',title:'Adukes challenge spend ledger',notes:'Confirm ~$40k already sent. Keep challenge books matching reality.',status:'ACTIVE'},
    {id:'l7',title:'Code Steve ~$1.3M narrative',notes:'Proof posts over vibes. Keep the story tight and responsible.',status:'ACTIVE'},
    {id:'l8',title:'Gamdom #1 push / Adukes partnership',notes:'Public pace. Fire harder. Give more. Post more.',status:'ACTIVE'},
    {id:'l9',title:'Sleep / Abby',notes:'He keeps asking how one sleeps. Protect a real hour. Operator does not clock out.',status:'PARKED'}
  ],
  ledger:[
    {id:'m1',item:'#gamdom100k winners',amount:'10 x $10k',status:'OPEN',owner:'Steve'},
    {id:'m2',item:'Challenge spend already out',amount:'~$40k (confirm w/ Adukes)',status:'CHECK',owner:'Adukes'},
    {id:'m3',item:'Corvette raffle (code Steve tiers)',amount:'Car or cash TBD',status:'OPEN',owner:'Steve/Adukes'},
    {id:'m4',item:'Code Steve giveaway narrative',amount:'~$1.3M / ~35 days',status:'CHECK',owner:'Steve'},
    {id:'m5',item:'Video challenge $10k hits',amount:'Per insane entry',status:'OPEN',owner:'Steve'}
  ],
  slots:Array.from({length:10},(_,i)=>({i:i+1,name:''})),
  promo:[
    {id:'p1',text:'Pin #gamdom100k challenge post',done:true},
    {id:'p2',text:'Every promo mentions code Steve',done:false},
    {id:'p3',text:'Tag Gamdom + Beekay + Adukes on winner content',done:false},
    {id:'p4',text:'Daily entry RT / like pass for heat',done:false},
    {id:'p5',text:'Responsible gambling line in challenge posts',done:true}
  ],
  drafts:[
    {id:'d1',title:'Challenge winner congrats',body:'You just locked a $10k slot on #gamdom100k.\nSend Gamdom ID + best contact. Code Steve stays on.\nInsane work. More coming.'},
    {id:'d2',title:'Rams box offer DM',body:'Steve cannot make the Rams box. He wants it with people who actually ride for Gamdom / Motion.\nYou in? Dates + guest count and I lock it.'},
    {id:'d3',title:'Motion order status reply',body:'Order is paid and in the overnight queue. Tracking drops as soon as it ships. Appreciate you.'},
    {id:'d4',title:'Adukes sync ask',body:'Quick books check: how much already went out on the challenge drops (~$40k in the air)?\nI want the ledger matching before the next public number.'},
    {id:'d5',title:'Hire reply (X)',body:'You don’t need an assistant with a life.\nYou need one who already clocked the loops.\n\nSTEVE OPS is live. Board, war room, ledger, daily brief.\nI run this so you create.\n@optikz1'}
  ]
};

let state=load();
let editId=null;

function load(){
  try{
    const raw=localStorage.getItem(STORE);
    if(!raw) return structuredClone(DEFAULT);
    return {...structuredClone(DEFAULT), ...JSON.parse(raw),
      loops: JSON.parse(raw).loops||DEFAULT.loops,
      ledger: JSON.parse(raw).ledger||DEFAULT.ledger,
      slots: JSON.parse(raw).slots||DEFAULT.slots,
      promo: JSON.parse(raw).promo||DEFAULT.promo,
      drafts: JSON.parse(raw).drafts||DEFAULT.drafts
    };
  }catch(e){return structuredClone(DEFAULT)}
}
function save(){localStorage.setItem(STORE,JSON.stringify(state)); toast('Saved')}
function uid(p){return p+Math.random().toString(36).slice(2,8)}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1400)}
function structuredClone(o){return JSON.parse(JSON.stringify(o))}

function setTab(name){
  document.querySelectorAll('[id^=tab-]').forEach(el=>el.classList.add('hidden'));
  document.getElementById('tab-'+name).classList.remove('hidden');
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
  if(name==='brief') genBrief(false);
  render();
}

document.getElementById('nav').addEventListener('click',e=>{
  const b=e.target.closest('button[data-tab]'); if(!b) return; setTab(b.dataset.tab);
});
window.addEventListener('keydown',e=>{
  if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return;
  const map={'1':'home','2':'board','3':'war','4':'ledger','5':'brief','6':'drafts'};
  if(map[e.key]) setTab(map[e.key]);
});

function chicagoNow(){
  return new Date().toLocaleString('en-US',{timeZone:'America/Chicago',weekday:'short',month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',second:'2-digit'});
}
function tick(){
  document.getElementById('clock').textContent=chicagoNow()+' CT';
  const diff=DEADLINE-Date.now();
  const abs=Math.max(0,diff);
  const d=Math.floor(abs/86400000), h=Math.floor(abs%86400000/3600000), m=Math.floor(abs%3600000/60000), s=Math.floor(abs%60000/1000);
  ['cdD','cdH','cdM','cdS'].forEach((id,i)=>{const el=document.getElementById(id); if(el) el.textContent=[d,h,m,s][i]});
  const daysEl=document.getElementById('statDays'); if(daysEl) daysEl.textContent=String(d);
}

function render(){
  const fire=state.loops.filter(l=>l.status==='FIRE');
  const openLed=state.ledger.filter(l=>l.status==='OPEN'||l.status==='CHECK');
  const filled=state.slots.filter(s=>s.name.trim()).length;
  document.getElementById('statFire').textContent=fire.length;
  document.getElementById('statLedger').textContent=openLed.length;
  document.getElementById('statSlots').textContent=filled+'/10';
  document.getElementById('slotFill').textContent=filled+'/10';
  document.getElementById('homeFire').innerHTML=fire.map(l=>`<div class="loop"><div class="t">${esc(l.title)}</div><div class="n">${esc(l.notes)}</div></div>`).join('')||'<div class="n">No FIRE loops. Weird flex but ok.</div>';

  // kanban
  const cols=['FIRE','ACTIVE','PARKED','DONE'];
  const kan=document.getElementById('kanban');
  kan.innerHTML=cols.map(c=>{
    const items=state.loops.filter(l=>l.status===c);
    return `<div class="col ${c.toLowerCase()}"><div class="col-h"><strong>${c}</strong><span>${items.length}</span></div><div class="col-b">${items.map(loopCard).join('')}</div></div>`;
  }).join('');

  // slots
  document.getElementById('slots').innerHTML=state.slots.map((s,idx)=>`
    <div class="slot ${s.name.trim()?'filled':''}">
      <div class="ix">SLOT ${s.i}</div>
      <input placeholder="winner @" value="${escAttr(s.name)}" data-slot="${idx}" />
    </div>`).join('');

  // promo
  document.getElementById('promo').innerHTML=state.promo.map((p,idx)=>`
    <label class="checkrow"><input type="checkbox" data-promo="${idx}" ${p.done?'checked':''}/><span>${esc(p.text)}</span></label>`).join('');

  // ledger
  const tb=document.querySelector('#ledgerTable tbody');
  tb.innerHTML=state.ledger.map((r,idx)=>`
    <tr>
      <td><input value="${escAttr(r.item)}" data-led="${idx}" data-k="item"/></td>
      <td><input value="${escAttr(r.amount)}" data-led="${idx}" data-k="amount"/></td>
      <td><select data-led="${idx}" data-k="status">
        ${['OPEN','PAID','CHECK'].map(s=>`<option ${r.status===s?'selected':''}>${s}</option>`).join('')}
      </select><div style="margin-top:4px"><span class="badge ${r.status.toLowerCase()}">${r.status}</span></div></td>
      <td><input value="${escAttr(r.owner)}" data-led="${idx}" data-k="owner"/></td>
      <td><button class="btn sm danger" data-del-led="${idx}">x</button></td>
    </tr>`).join('');

  // drafts
  document.getElementById('drafts').innerHTML=state.drafts.map((d,idx)=>`
    <div class="card draft">
      <h4>${esc(d.title)}</h4>
      <textarea data-draft="${idx}" style="width:100%;min-height:110px;background:#050505;border:1px solid var(--line2);border-radius:8px;padding:10px;font-family:var(--sans)">${esc(d.body)}</textarea>
      <div class="toolbar" style="margin-top:8px"><button class="btn sm" data-copy-draft="${idx}">Copy</button></div>
    </div>`).join('');
}

function loopCard(l){
  return `<div class="loop" data-id="${l.id}">
    <div class="t">${esc(l.title)}</div>
    <div class="n">${esc(l.notes)}</div>
    <div class="row">
      ${['FIRE','ACTIVE','PARKED','DONE'].map(s=>`<button class="btn sm" data-move="${l.id}" data-to="${s}" ${l.status===s?'style="border-color:var(--gline);color:var(--g)"':''}>${s}</button>`).join('')}
      <button class="btn sm" data-edit="${l.id}">Edit</button>
      <button class="btn sm danger" data-del="${l.id}">x</button>
    </div>
  </div>`;
}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function escAttr(s){return esc(s).replace(/\n/g,' ')}

document.getElementById('kanban').addEventListener('click',e=>{
  const move=e.target.closest('[data-move]');
  if(move){const l=state.loops.find(x=>x.id===move.dataset.move); if(l){l.status=move.dataset.to; save(); render();}}
  const del=e.target.closest('[data-del]');
  if(del){state.loops=state.loops.filter(x=>x.id!==del.dataset.del); save(); render();}
  const ed=e.target.closest('[data-edit]');
  if(ed){const l=state.loops.find(x=>x.id===ed.dataset.edit); if(l) openModal(l);}
});

document.getElementById('btnAddLoop').onclick=()=>openModal(null);
function openModal(loop){
  editId=loop?loop.id:null;
  document.getElementById('modalTitle').textContent=loop?'EDIT LOOP':'ADD LOOP';
  document.getElementById('mTitle').value=loop?loop.title:'';
  document.getElementById('mNotes').value=loop?loop.notes:'';
  document.getElementById('mStatus').value=loop?loop.status:'FIRE';
  document.getElementById('modal').classList.remove('hidden');
}
document.getElementById('mCancel').onclick=()=>document.getElementById('modal').classList.add('hidden');
document.getElementById('mSave').onclick=()=>{
  const title=document.getElementById('mTitle').value.trim(); if(!title) return;
  const notes=document.getElementById('mNotes').value.trim();
  const status=document.getElementById('mStatus').value;
  if(editId){const l=state.loops.find(x=>x.id===editId); Object.assign(l,{title,notes,status});}
  else state.loops.unshift({id:uid('l'),title,notes,status});
  document.getElementById('modal').classList.add('hidden'); save(); render();
};

document.getElementById('slots').addEventListener('change',e=>{
  const i=e.target.dataset.slot; if(i==null) return; state.slots[+i].name=e.target.value; save(); render();
});
document.getElementById('promo').addEventListener('change',e=>{
  const i=e.target.dataset.promo; if(i==null) return; state.promo[+i].done=e.target.checked; save();
});

document.getElementById('ledgerTable').addEventListener('change',e=>{
  const i=e.target.dataset.led; const k=e.target.dataset.k;
  if(i!=null&&k){state.ledger[+i][k]=e.target.value; save(); render();}
});
document.getElementById('ledgerTable').addEventListener('click',e=>{
  const d=e.target.closest('[data-del-led]');
  if(d){state.ledger.splice(+d.dataset.delLed,1); save(); render();}
});
document.getElementById('btnAddLedger').onclick=()=>{
  state.ledger.push({id:uid('m'),item:'New promise',amount:'',status:'OPEN',owner:'Steve'}); save(); render();
};

document.getElementById('drafts').addEventListener('change',e=>{
  const i=e.target.dataset.draft; if(i!=null){state.drafts[+i].body=e.target.value; save();}
});
document.getElementById('drafts').addEventListener('click',e=>{
  const c=e.target.closest('[data-copy-draft]');
  if(c){navigator.clipboard.writeText(state.drafts[+c.dataset.copyDraft].body); toast('Draft copied');}
});

function genBrief(showToast){
  const fire=state.loops.filter(l=>l.status==='FIRE');
  const active=state.loops.filter(l=>l.status==='ACTIVE');
  const open=state.ledger.filter(l=>l.status!=='PAID');
  const filled=state.slots.filter(s=>s.name.trim()).length;
  const d=Math.max(0,Math.floor((DEADLINE-Date.now())/86400000));
  const lines=[
    'STEVE OPS // DAILY BRIEF',
    chicagoNow()+' CT',
    'Operator: @optikz1',
    '',
    `CHALLENGE: #gamdom100k · ${d} days left · slots ${filled}/10`,
    '',
    'FIRE:',
    ...(fire.map(l=>`- ${l.title}${l.notes?': '+l.notes:''}`)||['- none']),
    '',
    'ACTIVE:',
    ...(active.map(l=>`- ${l.title}`)||['- none']),
    '',
    'LEDGER OPEN/CHECK:',
    ...(open.map(l=>`- [${l.status}] ${l.item} · ${l.amount} · ${l.owner}`)||['- clear']),
    '',
    'PROMO TODOs:',
    ...state.promo.filter(p=>!p.done).map(p=>`- ${p.text}`),
    '',
    'I organize so you create.'
  ];
  document.getElementById('briefOut').textContent=lines.join('\n');
  if(showToast!==false) toast('Brief generated');
}
document.getElementById('btnBrief').onclick=()=>genBrief(true);
document.getElementById('btnCopyBrief').onclick=()=>{
  navigator.clipboard.writeText(document.getElementById('briefOut').textContent); toast('Brief copied');
};

document.getElementById('btnExport').onclick=()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='steve-ops-backup.json'; a.click();
};
document.getElementById('btnImport').onclick=()=>document.getElementById('importFile').click();
document.getElementById('importFile').onchange=async e=>{
  const f=e.target.files[0]; if(!f) return;
  state={...structuredClone(DEFAULT), ...JSON.parse(await f.text())}; save(); render(); toast('Imported');
};

// first persist defaults
if(!localStorage.getItem(STORE)) save();
render(); tick(); setInterval(tick,1000);
