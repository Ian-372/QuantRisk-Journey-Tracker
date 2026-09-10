const KEY="quantrisk_tracker_v2";
const STAGES=["Learn","Practice","Build","Test","Interview","Master"];
const defaultState={skills:{},projects:{},checks:{},stageChecks:{},learningNotes:{},skillUpdated:{},streak:0,lastActive:null,theme:"light"};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||defaultState;
state.stageChecks=state.stageChecks||{};
state.learningNotes=state.learningNotes||{};
state.skillUpdated=state.skillUpdated||{};

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
  state.skillUpdated[name]=new Date().toISOString();
  touch(); save(); render();
}
function touch(){
  const today=new Date().toISOString().slice(0,10);
  if(state.lastActive!==today){state.streak=(state.lastActive&&new Date(today)-new Date(state.lastActive)===86400000)?state.streak+1:1;state.lastActive=today;}
}
function avgSkill(){let s=allSkills();return Math.round(s.reduce((a,x)=>a+getSkillPct(x.name),0)/s.length)}
function projectStats(){let vals=Object.values(state.projects);return {done:vals.filter(x=>x==="done").length,total:ROADMAP.projects.length}}
function phaseStats(phase){
 const skills=phase.skills.map(name=>({name,pct:getSkillPct(name)})), projects=phase.projects.map(name=>ROADMAP.projects.find(project=>project.name===name)), skillProgress=skills.length?Math.round(skills.reduce((total,skill)=>total+skill.pct,0)/skills.length):0, projectProgress=projects.length?Math.round(projects.filter(project=>state.projects[project?.id]==="done").length/projects.length*100):0;
 return {skills,projects:projects.filter(Boolean),skillProgress,projectProgress,progress:Math.round(skillProgress*.7+projectProgress*.3)};
}
function view(id){
 document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));
 document.getElementById(id+"View").classList.add("active");
 document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.view===id));
 const titles={dashboard:"Becoming a Quantitative Risk Professional",roadmap:"Gideon's Roadmap",skills:"Gideon's Skills",projects:"Gideon's Projects",interview:"Interview Practice",evidence:"Evidence & Mastery",settings:"Settings"};
 document.getElementById("pageTitle").textContent=titles[id];
}
function renderDashboard(){
 const pct=avgSkill(), ps=projectStats(), mastered=allSkills().filter(x=>getSkillPct(x.name)>=80).length;
 const phaseProgress=ROADMAP.phases.map(phaseStats), activePhaseIndex=Math.max(0,phaseProgress.findIndex(stat=>stat.progress<100)), next=ROADMAP.phases[activePhaseIndex], action=nextSkillAction();
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
 const stats=ROADMAP.phases.map(phaseStats), activeIndex=Math.max(0,stats.findIndex(stat=>stat.progress<100));
 document.getElementById("roadmapView").innerHTML=`<div class="section-head"><div><h3>Gideon's path to job readiness</h3><p>Move through each phase by recording skill evidence and completing the projects that prove it.</p></div></div><div class="roadmap-flow">${ROADMAP.phases.map((p,i)=>`<div class="flow-step ${i<activeIndex?"complete":""} ${i===activeIndex?"current":""}"><span>${i<activeIndex?"✓":String(i+1).padStart(2,"0")}</span><b>${p.title.split(" — ")[0]}</b><small>${stats[i].progress}%</small></div>`).join("")}</div>`+
 ROADMAP.phases.map((p,i)=>{const stat=stats[i],status=i<activeIndex?"COMPLETE":i===activeIndex?"CURRENT FOCUS":"UP NEXT";return `<article class="phase ${i===activeIndex?"phase-current":""}"><div class="phase-top"><div><span class="tag">${p.period} · ${status}</span><h3>${p.title}</h3><p>${p.objective}</p></div><span class="phase-badge">${stat.progress}%</span></div><div class="phase-progress"><div><span>Phase progress</span><b>${stat.progress}%</b></div><div class="bar"><i style="width:${stat.progress}%"></i></div><div class="phase-split"><span>Skills ${stat.skillProgress}%</span><span>Projects ${stat.projectProgress}%</span></div></div><strong class="phase-label">SKILLS TO DEVELOP</strong><div class="chips">${stat.skills.map(skill=>`<button class="chip chip-button" onclick="focusSkill('${skill.name}')">${skill.name}<b>${skill.pct}%</b></button>`).join("")}</div><strong class="phase-label">PROOF PROJECTS</strong><div class="chips">${p.projects.map(name=>{const project=ROADMAP.projects.find(item=>item.name===name),done=project&&state.projects[project.id]==="done";return `<span class="chip project-chip ${done?"chip-done":""}">${done?"✓ ":""}${name}</span>`}).join("")}</div><ul class="outcomes">${p.outcomes.map(x=>`<li>${x}</li>`).join("")}</ul></article>`}).join("");
}
function focusSkill(name){const skill=allSkills().find(item=>item.name===name);view("skills");setTimeout(()=>{const category=skill&&document.querySelector(`.tab[data-category="${skill.cat}"]`);if(category)filterSkills(skill.cat,category);const skillCard=[...document.querySelectorAll(".skill-card")].find(card=>card.textContent.includes(name));skillCard?.scrollIntoView({behavior:"smooth",block:"center"})},0)}
function renderSkills(){
 const cats=ROADMAP.categories;
 const recorded=allSkills().filter(s=>state.learningNotes[s.name]).length, active=allSkills().filter(s=>getSkillPct(s.name)>0).length, focus=allSkills().sort((a,b)=>getSkillPct(a.name)-getSkillPct(b.name)).slice(0,3);
 document.getElementById("skillsView").innerHTML=`<div class="section-head"><div><h3>Skill mastery matrix</h3><p>Capture what you can actually do, then use evidence to move from learning to mastery.</p></div></div>
 <div class="skill-insights"><div><span>Learning records</span><b>${recorded}/${allSkills().length}</b><small>Skills with notes</small></div><div><span>Skills in progress</span><b>${active}</b><small>With recorded evidence</small></div><div><span>Growth focus</span><b>${focus[0]?.name||"Start here"}</b><small>Lowest current mastery</small></div></div>
 <div class="skill-controls"><label class="skill-search"><span>⌕</span><input id="skillSearch" type="search" placeholder="Search skills..." oninput="updateSkillMatrix()"></label><select id="skillSort" onchange="updateSkillMatrix()"><option value="focus">Sort: growth focus</option><option value="mastery">Sort: highest mastery</option><option value="recent">Sort: recently updated</option><option value="recorded">Sort: learning recorded</option></select></div>
 <div class="skill-tabs">${cats.map((c,i)=>`<button class="tab ${i===0?"active":""}" data-category="${c.id}" onclick="filterSkills('${c.id}',this)">${c.name}</button>`).join("")}</div>
 <div id="skillList" class="skill-list"></div>`;
 renderSkillList(cats[0].id);
}
function renderSkillList(cat){
 const query=document.getElementById("skillSearch")?.value.toLowerCase()||"", sort=document.getElementById("skillSort")?.value||"focus";
 let list=allSkills().filter(s=>s.cat===cat&&(!query||s.name.toLowerCase().includes(query)||s.desc.toLowerCase().includes(query)));
 list.sort((a,b)=>sort==="mastery"?getSkillPct(b.name)-getSkillPct(a.name):sort==="recent"?(new Date(state.skillUpdated[b.name]||0)-new Date(state.skillUpdated[a.name]||0)):sort==="recorded"?Number(!!state.learningNotes[b.name])-Number(!!state.learningNotes[a.name]):getSkillPct(a.name)-getSkillPct(b.name));
 document.getElementById("skillList").innerHTML=list.length?list.map(s=>`<div class="skill-card"><div class="skill-title"><b>${s.name}</b><span>${getSkillPct(s.name)}%</span></div><p>${s.desc}</p><div class="bar"><i style="width:${getSkillPct(s.name)}%"></i></div><div class="stage-line"><span>Mastery pathway</span><b>${stagePct(s.name)}% complete</b></div><div class="stage-steps">${skillStages(s.name).map(x=>`<span class="stage-step ${x.done?"done":""}"><span class="stage-check">${x.done?"✓":""}</span><span>${x.stage}</span></span>`).join("")}</div><div class="learning-status">${state.learningNotes[s.name]?"Learning recorded":"No learning record yet"}${state.skillUpdated[s.name]?` · Updated ${relativeDate(state.skillUpdated[s.name])}`:""}</div>${state.learningNotes[s.name]?`<p class="learning-preview">${escapeHtml(state.learningNotes[s.name])}</p>`:""}<div class="skill-actions"><button class="small-btn" onclick="showSkill('${s.name}')">${state.learningNotes[s.name]?"View or update record":"Record learning & evidence"}</button></div></div>`).join(""):"<div class=\"empty-state\">No skills match this search. Try another term or clear the filter.</div>";
}
function relativeDate(value){const days=Math.floor((Date.now()-new Date(value).getTime())/86400000);return days<=0?"today":days===1?"yesterday":`${days} days ago`}
function escapeHtml(value){return value.replace(/[&<>'"]/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[character]))}
function filterSkills(id,el){document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));el.classList.add("active");document.getElementById("skillList").dataset.category=id;renderSkillList(id)}
function updateSkillMatrix(){renderSkillList(document.getElementById("skillList").dataset.category||"core")}
function adjustSkill(name,delta){setSkill(name,delta===100?100:getSkillPct(name)+delta)}
function showSkill(name){openModal(`<span class="tag">Learning record · ${name}</span><h2>What did Gideon learn?</h2><p>Write the actual capability, concept, problem or project result he can now explain or demonstrate. This record is saved to the skill.</p><textarea id="skillNote" class="learning-input" placeholder="Example: I can write a SQL window function to rank loan defaults by customer segment...">${state.learningNotes[name]||""}</textarea><button class="primary" onclick="saveSkillNote('${name}')">Save learning record</button><div class="evidence-divider"><span>Evidence ladder</span></div><p>Check each stage only when the evidence is real.</p><div class="checklist">${STAGES.map((stage,i)=>`<label class="check-row"><input type="checkbox" onchange="recordStage('${name}',${i},this.checked)" ${state.stageChecks[name+"-"+i]?"checked":""}><span><b>${stage}</b><small>${stageHint(stage)}</small></span></label>`).join("")}</div><div class="modal-progress"><b>${stagePct(name)}% evidence progress</b><div class="bar"><i style="width:${stagePct(name)}%"></i></div></div>`)}
function stageHint(stage){return {Learn:"Explain the concept and its assumptions.",Practice:"Solve guided and independent exercises.",Build:"Use it in a financial or risk project.",Test:"Validate outputs, edge cases and failure modes.",Interview:"Answer a realistic question clearly.",Master:"Teach it or defend a decision using it."}[stage]}
function saveSkillNote(name){const note=document.getElementById("skillNote").value.trim();if(note){state.learningNotes[name]=note}else{delete state.learningNotes[name]}state.skillUpdated[name]=new Date().toISOString();touch();save();render();showSkill(name)}
function recordStage(name,i,v){state.stageChecks[name+"-"+i]=v;state.skills[name]=Math.max(getSkillPct(name),stagePct(name));state.skillUpdated[name]=new Date().toISOString();touch();save();render()}
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
 const checks=Object.values(state.checks).filter(Boolean).length, total=Object.keys(state.checks).length, records=allSkills().filter(skill=>state.learningNotes[skill.name]);
 document.getElementById("evidenceView").innerHTML=`<div class="section-head"><div><h3>Evidence & Mastery</h3><p>Review the records behind Gideon's growth, then continue the next stage.</p></div></div><div class="stats"><div class="stat"><small>LEARNING RECORDS</small><strong>${records.length}</strong><span>Skills with notes</span></div><div class="stat"><small>EVIDENCE CHECKS</small><strong>${checks}</strong><span>Confirmed demonstrations</span></div><div class="stat"><small>STREAK</small><strong>${state.streak}</strong><span>Active days</span></div><div class="stat"><small>OVERALL</small><strong>${avgSkill()}%</strong><span>Skill mastery</span></div></div><div class="section-head"><div><h3>What Gideon has learned</h3><p>These notes are saved locally in this browser.</p></div></div><div class="record-list">${records.length?records.map(skill=>`<article class="record-card"><div><span class="tag">${skill.name} · ${getSkillPct(skill.name)}%</span><p>${escapeHtml(state.learningNotes[skill.name])}</p><small>${state.skillUpdated[skill.name]?`Updated ${relativeDate(state.skillUpdated[skill.name])}`:"Learning recorded"}</small></div><button class="small-btn" onclick="showSkill('${skill.name}')">Open record</button></article>`).join(""):"<div class=\"panel empty-state\"><h4>No learning records yet</h4><p>Open a skill in the Skills Matrix and write what Gideon can now explain, solve, build, or demonstrate.</p></div>"}</div><div class="panel"><h4>Definition of "mastered"</h4><p>He should be able to explain it, solve a practical problem, build with it, debug it, and survive an interview question without copying a tutorial.</p></div>`;
}
function renderSettings(){
 document.getElementById("settingsView").innerHTML=`<div class="section-head"><div><h3>Settings</h3><p>Your data stays in this browser using localStorage.</p></div></div><div class="panel"><div class="setting"><b>Career target</b><p>Quantitative Risk & Financial Analytics — Python + SQL + Data Engineering + ML + AI.</p></div><div class="setting"><b>Current academic stage</b><p>Year 3.1</p></div><div class="setting"><b>Data</b><p>Progress is stored locally. Export/import can be added when you connect a backend.</p></div><button class="danger" onclick="resetAll()">Reset all progress</button></div>`;
}
function openModal(html){document.getElementById("modalBody").innerHTML=html;document.getElementById("modal").classList.remove("hidden")}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
function resetAll(){if(confirm("Reset all tracked progress?")){state={...defaultState,skills:{},projects:{},checks:{},stageChecks:{},learningNotes:{},skillUpdated:{}};save();render()}}
function render(){renderDashboard();renderRoadmap();renderSkills();renderProjects();renderInterview();renderEvidence();renderSettings();document.getElementById("streakValue").textContent=state.streak;document.body.classList.toggle("light",state.theme==="light")}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>view(b.dataset.view)));
document.getElementById("modalClose").onclick=closeModal;
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
document.getElementById("themeBtn").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";save();render()};
render();
