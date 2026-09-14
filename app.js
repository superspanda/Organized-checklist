const KEY="organize-v1";
let state=JSON.parse(localStorage.getItem(KEY)||"null")||{
  id:"root",name:"My Lists",folders:[
    {id:uid(),name:"Study",note:"Subjects, chapters and revision",folders:[
      {id:uid(),name:"Microbiology",note:"",folders:[],items:[]},
      {id:uid(),name:"Pharmacology",note:"",folders:[],items:[]},
      {id:uid(),name:"Pathology",note:"",folders:[],items:[]}
    ],items:[]},
    {id:uid(),name:"Personal",note:"",folders:[],items:[]}
  ],items:[]
};
let path=["root"];
let modalType="folder";

function uid(){return Math.random().toString(36).slice(2,10)}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function node(){let n=state;for(let i=1;i<path.length;i++)n=findNode(n,path[i]);return n}
function findNode(n,id){if(n.id===id)return n;for(const f of n.folders||[]){let x=findNode(f,id);if(x)return x}return null}
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function render(){
  const n=node(); document.getElementById("title").textContent=n.name;
  const main=document.getElementById("main");
  let html='<div class="content">';
  if(path.length>1)html+=`<div class="back" onclick="goBack()">← Back</div>`;
  html+=crumbs();
  const folders=n.folders||[], items=n.items||[];
  if(path.length===1)html+=`<div class="home-intro"><p>Keep everything in groups, subgroups and checkable lists.</p></div>`;
  if(folders.length){
    html+='<div class="section"><div class="section-title">Groups</div>';
    for(const f of folders)html+=folderCard(f);
    html+='</div>';
  }
  if(items.length){
    const done=items.filter(x=>x.done).length;
    html+=`<div class="section"><div class="section-title">List</div><div class="stats">${done} of ${items.length} completed</div><div class="progress"><i style="width:${items.length?done/items.length*100:0}%"></i></div>`;
    for(const it of items)html+=itemCard(it);
    html+='</div>';
  }
  if(!folders.length&&!items.length)html+=`<div class="empty"><div class="empty-icon">＋</div><h3>Nothing here yet</h3><p>Use the + button to add a group or a list item.</p></div>`;
  html+='</div>';main.innerHTML=html;
}
function crumbs(){
  let html='<div class="crumbs">';
  let n=state;html+=`<span class="crumb ${path.length===1?'current':''}" onclick="jump(0)">Home</span>`;
  for(let i=1;i<path.length;i++){n=findNode(n,path[i]);html+=`<span class="arrow">›</span><span class="crumb ${i===path.length-1?'current':''}" onclick="jump(${i})">${esc(n.name)}</span>`}
  return html+'</div>';
}
function folderCard(f){return `<div class="card" onclick="openFolder('${f.id}')"><div class="folder-icon">▱</div><div class="card-main"><div class="card-name">${esc(f.name)}</div>${f.note?`<div class="card-note">${esc(f.note)}</div>`:""}</div><div class="chev">›</div></div>`}
function itemCard(it){return `<div class="card item ${it.done?'done':''}"><button class="check ${it.done?'done':''}" onclick="toggle('${it.id}',event)"></button><div class="card-main" onclick="editItem('${it.id}')"><div class="card-name">${esc(it.name)}</div>${it.note?`<div class="card-note">${esc(it.note)}</div>`:""}</div></div>`}
function openFolder(id){path.push(id);render()}
function jump(i){path=path.slice(0,i+1);render()}
function goBack(){path.pop();render()}
function toggle(id,e){e.stopPropagation();const it=(node().items||[]).find(x=>x.id===id);if(it){it.done=!it.done;save();render()}}
function openModal(type,id=null){
 modalType=type; document.getElementById("modalTitle").textContent=id?"Edit "+(type==="folder"?"group":"item"):"Add "+(type==="folder"?"group":"list item");
 const target=id?findNode(node(),id):null; const item=id?(node().items||[]).find(x=>x.id===id):null;
 document.getElementById("nameInput").value=target?.name||item?.name||"";
 document.getElementById("noteInput").value=target?.note||item?.note||"";
 document.getElementById("modal").dataset.id=id||"";
 document.getElementById("modal").classList.remove("hidden");setTimeout(()=>document.getElementById("nameInput").focus(),100)
}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
function saveModal(){
 const name=document.getElementById("nameInput").value.trim();if(!name)return;
 const note=document.getElementById("noteInput").value.trim();const id=document.getElementById("modal").dataset.id;
 if(id){
  if(modalType==="folder"){const x=findNode(node(),id);if(x){x.name=name;x.note=note}}
  else {const x=(node().items||[]).find(a=>a.id===id);if(x){x.name=name;x.note=note}}
 }else{
  if(modalType==="folder")node().folders.push({id:uid(),name,note,folders:[],items:[]});
  else node().items.push({id:uid(),name,note,done:false});
 }
 save();closeModal();render()
}
function editItem(id){openModal("item",id)}
function search(q){
 const out=[];function walk(n,trail){for(const f of n.folders||[]){if(f.name.toLowerCase().includes(q))out.push({type:"group",name:f.name,trail:[...trail,f.id],note:f.note});walk(f,[...trail,f.id])}for(const i of n.items||[]){if(i.name.toLowerCase().includes(q))out.push({type:"item",name:i.name,trail,note:i.note,done:i.done})}}
 walk(state,["root"]);document.getElementById("searchResults").innerHTML=out.length?out.map((r,idx)=>`<div class="result" onclick="resultOpen(${idx})"><strong>${r.type==="group"?"▱ ":"☐ "}${esc(r.name)}</strong><small>${esc(r.note||"")}</small></div>`).join(""):`<div class="empty"><h3>No results</h3><p>Try another search.</p></div>`;window.searchOut=out}
document.getElementById("fab").onclick=()=>openModal("folder");
document.getElementById("saveModal").onclick=saveModal;
document.getElementById("cancelModal").onclick=closeModal;
document.getElementById("modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
document.getElementById("searchBtn").onclick=()=>{document.getElementById("searchPanel").classList.remove("hidden");document.getElementById("searchInput").focus()};
document.getElementById("closeSearch").onclick=()=>document.getElementById("searchPanel").classList.add("hidden");
document.getElementById("searchInput").oninput=e=>search(e.target.value.toLowerCase().trim());
document.getElementById("fab").addEventListener("contextmenu",e=>e.preventDefault());
window.resultOpen=i=>{const r=window.searchOut[i];path=r.trail;document.getElementById("searchPanel").classList.add("hidden");render()};
window.openFolder=openFolder;window.jump=jump;window.goBack=goBack;window.toggle=toggle;window.editItem=editItem;
render();
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
