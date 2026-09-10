const KEY="quantrisk_tracker_v2";
const STAGES=["Learn","Practice","Build","Test","Interview","Master"];
const defaultState={skills:{},projects:{},checks:{},stageChecks:{},streak:0,lastActive:null,theme:"light"};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||defaultState;
state.stageChecks=state.stageChecks||{};

function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function allSkills(){return ROADMAP.categories.flatMap(c=>c.skills.map(s=>({name:s[0],desc:s[1],cat:c.id})))}
function getSkillPct(name){return state.skills[name]??0}
function skillStages(name){return STAGES.map((stage,i)=>({stage,done:!!state.stageChecks[name+"-"+i]}))}
function stagePct(name){const stages=skillStages(name);return Math.round(stages.filter(x=>x.done).length/STAGES.length*100)}
function nextSkillAction(){
 const skill=allSkills().sort((a,b)=>getSkillPct(a.name)-getSkillPct(b.name))[0];
 if(!skill)return null;
 const next=skillStages(skill.name).find(x=>!x.done);
 return {skill,stage:next?.stage||"Master"};
}
function setSkill(name,pct){
  state.skills[name]=Math.max(0,Math.min(100,Number(pct)));
  touch(); save(); render();
}
function touch(){
  const today=new Date().toISOString().slice(0,10);
  if(state.lastActive!==today){state.streak=(state.lastActive&&new Date(today)-new Date(state.lastActive)===86400000)?state.streak+1:1;state.lastActive=today;}
}
function avgSkill(){let s=allSkills();return Math.round(s.reduce((a,x)=>a+getSkillPct(x.name),0)/s.length)}
function projectStats(){let vals=Object.values(state.projects);return {done:vals.filter(x=>x==="done").length,total:ROADMAP.projects.length}}
function view(id){
 document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));
 document.getElementById(id+"View").classList.add("active");
 document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.view===id));
 const titles={dashboard:"Becoming a Quantitative Risk Professional",roadmap:"Gideon's Roadmap",skills:"Gideon's Skills",projects:"Gideon's Projects",interview:"Interview Practice",evidence:"Evidence & Mastery",settings:"Settings"};
 document.getElementById("pageTitle").textContent=titles[id];
}
function renderDashboard(){
 const pct=avgSkill(), ps=projectStats(), mastered=allSkills().filter(x=>getSkillPct(x.name)>=80).length;
 const next=ROADMAP.phases.find(p=>p.status==="current")||ROADMAP.phases[0], action=nextSkillAction();
 document.getElementById("dashboardView").innerHTML=`
 <div class="hero">
  <div><span class="tag">GIDEON JUMA · CAREER DIRECTION</span><h2>Becoming a Quantitative Risk &<br>Financial Analytics Professional</h2>
  <p>Build the mathematical judgement, financial knowledge and engineering ability to solve real risk problems with data, models and technology.</p></div>
  <div class="progress-ring"><div class="ring" style="--p:${pct}%"><b>${pct}%</b></div><small>overall skill mastery</small></div>
 </div>
 <div class="stats">
  <div class="stat"><small>SKILL MASTERY</small><strong>${pct}%</strong><span>Across ${allSkills().length} tracked skills</span></div>
  <div class="stat"><small>SKILLS ≥80%</small><strong>${mastered}</strong><span>Demonstrated strength</span></div>
  <div class="stat"><small>PROJECTS</small><strong>${ps.done}/${ps.total}</strong><span>Portfolio milestones</span></div>
  <div class="stat"><small>ACTIVE PHASE</small><strong>${next.title.split(" — ")[0]}</strong><span>Foundation</span></div>
 </div>
 <div class="section-head"><div><h3>Six-layer career architecture</h3><p>Build the professional identity, not a random collection of tools.</p></div></div>
 <div class="grid-3">${ROADMAP.layers.map(l=>`<div class="panel"><span class="layer-num">${l.icon}</span><h4>${l.name}</h4><p>${l.desc}</p></div>`).join("")}</div>
 <div class="section-head"><div><h3>Current objective</h3><p>${next.objective}</p></div><button class="primary" onclick="view('roadmap')">Open roadmap</button></div>
 <div class="panel"><div class="mini-row"><span>Foundation completion</span><b>${Math.round(["Python","SQL","R","Probability","Statistics","Financial Mathematics","Git/GitHub","Excel"].reduce((a,n)=>a+getSkillPct(n),0)/8)}%</b></div><div class="bar"><i style="width:${Math.round(["Python","SQL","R","Probability","Statistics","Financial Mathematics","Git/GitHub","Excel"].reduce((a,n)=>a+getSkillPct(n),0)/8)}%"></i></div></div>
 <div class="next-action"><div><span class="tag">Recommended next action</span><h3>${action?`${action.stage}: ${action.skill.name}`:"Choose a skill to begin"}</h3><p>${action?`Use the evidence checklist to prove this stage, then move to the next one.`:"Start with the foundation skills in the Skills Matrix."}</p></div><button class="primary" onclick="${action?`showSkill('${action.skill.name}')`:`view('skills')`}">${action?"Open skill":"Explore skills"}</button></div>`;
}
function renderRoadmap(){
 document.getElementById("roadmapView").innerHTML=`<div class="section-head"><div><h3>Year 3.1 → Year 4.2</h3><p>Each phase has skills, projects and evidence-based outcomes.</p></div></div>`+
 ROADMAP.phases.map((p,i)=>`<article class="phase"><div class="phase-top"><div><span class="tag">${p.period} · ${p.status}</span><h3>${p.title}</h3><p>${p.objective}</p></div><span class="phase-badge">${i===0?"ACTIVE":"PLANNED"}</span></div><strong style="font-size:10px;color:#8e96a1">SKILLS</strong><div class="chips">${p.skills.map(x=>`<span class="chip">${x}</span>`).join("")}</div><strong style="font-size:10px;color:#8e96a1">PROJECTS</strong><div class="chips">${p.projects.map(x=>`<span class="chip">${x}</span>`).join("")}</div><ul class="outcomes">${p.outcomes.map(x=>`<li>${x}</li>`).join("")}</ul></article>`).join("");
}
function renderSkills(){
 const cats=ROADMAP.categories;
 document.getElementById("skillsView").innerHTML=`<div class="section-head"><div><h3>Skill mastery matrix</h3><p>Move a skill only when you can demonstrate it. Every skill follows Learn → Practice → Build → Test → Interview → Master.</p></div></div>
 <div class="skill-tabs">${cats.map((c,i)=>`<button class="tab ${i===0?"active":""}" onclick="filterSkills('${c.id}',this)">${c.name}</button>`).join("")}</div>
 <div id="skillList" class="skill-list"></div>`;
 renderSkillList(cats[0].id);
}
function renderSkillList(cat){
 const list=allSkills().filter(s=>s.cat===cat);
 document.getElementById("skillList").innerHTML=list.map(s=>`<div class="skill-card"><div class="skill-title"><b>${s.name}</b><span>${getSkillPct(s.name)}%</span></div><p>${s.desc}</p><div class="bar"><i style="width:${getSkillPct(s.name)}%"></i></div><div class="stage-line"><span>Evidence progress</span><b>${stagePct(s.name)}%</b></div><div class="stage-dots">${skillStages(s.name).map(x=>`<span class="stage-dot ${x.done?"done":""}" title="${x.stage}">${x.done?"✓":"·"}</span>`).join("")}</div><div class="skill-actions"><button class="small-btn" onclick="adjustSkill('${s.name}',-5)">−5</button><button class="small-btn" onclick="adjustSkill('${s.name}',5)">+5</button><button class="small-btn" onclick="adjustSkill('${s.name}',100)">Mastered</button><button class="small-btn" onclick="showSkill('${s.name}')">Evidence</button></div></div>`).join("");
}
function filterSkills(id,el){document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));el.classList.add("active");renderSkillList(id)}
function adjustSkill(name,delta){setSkill(name,delta===100?100:getSkillPct(name)+delta)}
function showSkill(name){openModal(`<span class="tag">Evidence ladder</span><h2>${name}</h2><p>Mastery is demonstrated capability, not course completion. Check each stage only when you can show the evidence.</p><div class="checklist">${STAGES.map((stage,i)=>`<label class="check-row"><input type="checkbox" onchange="recordStage('${name}',${i},this.checked)" ${state.stageChecks[name+"-"+i]?"checked":""}><span><b>${stage}</b><small>${stageHint(stage)}</small></span></label>`).join("")}</div><div class="modal-progress"><b>${stagePct(name)}% evidence progress</b><div class="bar"><i style="width:${stagePct(name)}%"></i></div></div>`)}
function stageHint(stage){return {Learn:"Explain the concept and its assumptions.",Practice:"Solve guided and independent exercises.",Build:"Use it in a financial or risk project.",Test:"Validate outputs, edge cases and failure modes.",Interview:"Answer a realistic question clearly.",Master:"Teach it or defend a decision using it."}[stage]}
function recordStage(name,i,v){state.stageChecks[name+"-"+i]=v;state.skills[name]=Math.max(getSkillPct(name),stagePct(name));touch();save();render()}
function recordCheck(k,v){state.checks[k]=v;touch();save();render()}
function renderProjects(){
 document.getElementById("projectsView").innerHTML=`<div class="section-head"><div><h3>Portfolio that proves capability</h3><p>Six projects move from analysis to production-grade financial intelligence.</p></div></div><div class="project-grid">${ROADMAP.projects.map(p=>`<article class="project-card"><div class="project-meta"><span>${p.phase}</span><span>${p.level}</span></div><h3>${p.name}</h3><p>${p.brief}</p><strong style="font-size:9px;color:#737c88;letter-spacing:.1em">STACK</strong><div class="chips"><span class="chip">${p.stack}</span></div><strong style="font-size:9px;color:#737c88;letter-spacing:.1em">DELIVERABLES</strong><ul class="deliverables">${p.deliverables.map(x=>`<li>${x}</li>`).join("")}</ul><div class="project-footer"><span class="status ${state.projects[p.id]==="done"?"done":""}">${state.projects[p.id]==="done"?"COMPLETED":"NOT STARTED"}</span><button class="${state.projects[p.id]==="done"?"small-btn":"primary"}" onclick="toggleProject('${p.id}')">${state.projects[p.id]==="done"?"Reopen":"Mark complete"}</button></div></article>`).join("")}</div>`;
}
function toggleProject(id){state.projects[id]=state.projects[id]==="done"?"todo":"done";touch();save();render()}
function renderInterview(){
 document.getElementById("interviewView").innerHTML=`<div class="section-head"><div><h3>Interview Lab</h3><p>Use these questions to test whether knowledge has become job-ready capability.</p></div></div>`+
 ROADMAP.interview.map((x,i)=>`<article class="interview-card"><span class="qtag">${x.q} · ${x.skill}</span><h3>${i+1}. ${x.text}</h3><button class="small-btn" onclick="toggleAnswer(${i})">Show evaluation guide</button><div id="ans${i}" class="answer">${evaluation(x.q)}</div></article>`).join("");
}
function evaluation(q){
 const m={SQL:"Write the query, explain joins/aggregation and validate the result.",Statistics:"Interpret precisely; distinguish statistical significance from causation and business significance.",Risk:"Start with data quality and segmentation, then diagnose drivers, quantify uncertainty and recommend action.",Finance:"Explain assumptions, formulas and trade-offs, not definitions alone.",ML:"Discuss imbalance, precision/recall, ROC/PR, calibration and business costs.",Engineering:"Cover ingestion, validation, storage, transformation, orchestration, monitoring and failure recovery.",AI:"Ground outputs in evidence, evaluate hallucinations, protect sensitive data and define human controls.",Case:"Break the metric down, test competing hypotheses and connect findings to a business decision."};
 return m[q]||"Explain your reasoning, show the implementation and identify assumptions.";
}
function toggleAnswer(i){document.getElementById("ans"+i).classList.toggle("show")}
function renderEvidence(){
 const checks=Object.values(state.checks).filter(Boolean).length, total=Object.keys(state.checks).length;
 document.getElementById("evidenceView").innerHTML=`<div class="section-head"><div><h3>Evidence & Mastery</h3><p>Completion is not mastery. Record evidence that proves competence.</p></div></div><div class="stats"><div class="stat"><small>EVIDENCE CHECKS</small><strong>${checks}</strong><span>Confirmed demonstrations</span></div><div class="stat"><small>RECORDED</small><strong>${total}</strong><span>Checks started</span></div><div class="stat"><small>STREAK</small><strong>${state.streak}</strong><span>Active days</span></div><div class="stat"><small>OVERALL</small><strong>${avgSkill()}%</strong><span>Skill mastery</span></div></div><div class="panel"><h4>Definition of "mastered"</h4><p>He should be able to explain it, solve a practical problem, build with it, debug it, and survive an interview question without copying a tutorial.</p></div>`;
}
function renderSettings(){
 document.getElementById("settingsView").innerHTML=`<div class="section-head"><div><h3>Settings</h3><p>Your data stays in this browser using localStorage.</p></div></div><div class="panel"><div class="setting"><b>Career target</b><p>Quantitative Risk & Financial Analytics — Python + SQL + Data Engineering + ML + AI.</p></div><div class="setting"><b>Current academic stage</b><p>Year 3.1</p></div><div class="setting"><b>Data</b><p>Progress is stored locally. Export/import can be added when you connect a backend.</p></div><button class="danger" onclick="resetAll()">Reset all progress</button></div>`;
}
function openModal(html){document.getElementById("modalBody").innerHTML=html;document.getElementById("modal").classList.remove("hidden")}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
function resetAll(){if(confirm("Reset all tracked progress?")){state={...defaultState,skills:{},projects:{},checks:{},stageChecks:{}};save();render()}}
function render(){renderDashboard();renderRoadmap();renderSkills();renderProjects();renderInterview();renderEvidence();renderSettings();document.getElementById("streakValue").textContent=state.streak;document.body.classList.toggle("light",state.theme==="light")}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>view(b.dataset.view)));
document.getElementById("modalClose").onclick=closeModal;
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
document.getElementById("themeBtn").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";save();render()};
render();
