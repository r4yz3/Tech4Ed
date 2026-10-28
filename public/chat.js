// Tech4ED Helper: scripted assistant that answers only from the site's own data (programs, courses, people, FAQ).
// It never invents schedules, fees, eligibility or requirements; for those it hands off to the right office.
const chat=document.querySelector('#chat'),chatToggle=document.querySelector('#chat-toggle'),chatLog=document.querySelector('#chat-log'),chatForm=document.querySelector('#chat-form'),chatInput=document.querySelector('#chat-input'),chatChips=document.querySelector('#chat-chips');
const PLACE_LINE=`📍 ${T4E_PLACE}`;
const PESO_ACTION={label:'Message PESO on Facebook',href:PESO_FB};
const MPTVI_ACTIONS=[{label:'Call 0938-198-3735',href:'tel:'+MPTVI_TEL},{label:'Email MPTVI',href:'mailto:'+MPTVI_EMAIL}];
const store={get(){try{return JSON.parse(sessionStorage.getItem('t4e-chat')||'[]')}catch{return []}},set(v){try{sessionStorage.setItem('t4e-chat',JSON.stringify(v.slice(-30)))}catch{}}};

// ---------- Text matching ----------
const norm=t=>' '+t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9/+ -]/g,' ').replace(/\s+/g,' ').trim()+' ';
function lev(a,b){if(Math.abs(a.length-b.length)>1)return 2;const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length];}
function hits(t,key){const k=norm(key).trim();if(k.length<4)return t.includes(' '+k+' ')||t.includes(' '+k+'s ');if(t.includes(k))return true;if(k.includes(' ')||k.length<6)return false;return t.split(' ').some(w=>w.length>=5&&lev(w,k)<=1);}
const scoreKeys=(t,keys)=>keys.reduce((n,k)=>n+(hits(t,k)?Math.min(norm(k).trim().length,12):0),0);

// ---------- Rich reply building blocks ----------
const prog=code=>programs.find(p=>p.code===code);
const idx=p=>programs.indexOf(p);
const codesOf=g=>programs.filter(p=>p.group===g).map(p=>p.code);
const reply=(text,o={})=>({text,...o});
const programCards=codes=>codes.map(prog).filter(Boolean).map(idx);
const officeActions=p=>p.group==='PESO'?[p.link?{label:'View focal person',href:p.link}:PESO_ACTION]:p.group==='MPTVI'?MPTVI_ACTIONS:[];
const suggestFor=g=>({Tech4ED:['Free computer use','Government IDs online','ICT training','Talk to a person'],PESO:["I'm looking for work",'Student programs','Worker support','Talk to a person'],MPTVI:['TESDA courses','Assessment center','How to enroll','Talk to a person']}[g]||['Tech4ED services','PESO programs','MPTVI courses','Talk to a person']);
function programAnswer(code){const p=prog(code);const who=p.group==='PESO'?(p.label?`Contact the <strong>${esc(p.contact)}</strong> office.`:`Your focal person is <strong>${esc(p.contact)}</strong>, ${esc(p.role)}.`):p.group==='MPTVI'?`Contact the <strong>MPTVI Training Center</strong>.`:`Visit us at the <strong>${T4E_PLACE}</strong>.`;
  const items=p.items?`<ul class="msg-list">${p.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>`:'';
  return reply(`<strong>${esc(p.name)}</strong>${p.code!==p.name?` (${esc(p.code)})`:''}<br>${esc(p.desc)}${items}${who}`,{cards:[idx(p)],actions:officeActions(p),suggest:suggestFor(p.group)});}
function courseAnswer(short){const list=COURSES.filter(c=>c.short===short);const c=list[0];
  return reply(`<strong>${esc(c.name)}</strong> at MPTVI<ul class="msg-list">${list.map(x=>`<li><span class="nc">${x.level}</span> ${x.modes.join(' · ')}${x.trainers.length?` <span class="muted">· Trainer: ${x.trainers.map(esc).join(', ')}</span>`:''}</li>`).join('')}</ul>For schedules, slots and requirements, contact the <strong>MPTVI Training Center</strong>.`,{actions:MPTVI_ACTIONS,suggest:['Other TESDA courses','Assessment center','How to enroll','Talk to a person']});}
const list=(intro,codes,g)=>reply(intro,{cards:programCards(codes),suggest:suggestFor(g)});

// ---------- People directory (focal persons, trainers, MPTVI admin) ----------
const PEOPLE=(()=>{const m=new Map();const add=(n,line)=>{if(!m.has(n))m.set(n,[]);if(!m.get(n).includes(line))m.get(n).push(line);};
  programs.filter(p=>p.group==='PESO'&&!p.label).forEach(p=>add(p.contact,`PESO · ${p.role}`));
  COURSES.forEach(c=>c.trainers.forEach(t=>add(t,`MPTVI trainer · ${c.name} ${c.level}`)));
  MPTVI_TEAM.forEach(([n,r])=>add(n,`MPTVI · ${r}`));return m;})();
function personAnswer(t){for(const [name,lines] of PEOPLE){const parts=norm(name).trim().split(' ').filter(w=>w.length>=4);if(parts.some(w=>t.includes(' '+w+' '))){const handled=programs.filter(p=>p.contact===name).map(p=>p.code);
  return reply(`<strong>${esc(name)}</strong><ul class="msg-list">${lines.map(l=>`<li>${esc(l)}</li>`).join('')}</ul>`,{cards:programCards(handled).slice(0,4),actions:lines.some(l=>l.startsWith('MPTVI'))?MPTVI_ACTIONS:[PESO_ACTION]});}}return null;}

// ---------- Intents ----------
const P=(keys,code)=>({keys,run:()=>programAnswer(code)});
const C=(keys,short)=>({keys,run:()=>courseAnswer(short)});
const handoff=()=>reply(`Of course. I'm an automated assistant, so here's how to reach a real person:<ul class="msg-list"><li><strong>Tech4ED Center</strong>: visit us at ${T4E_PLACE}</li><li><strong>PESO Magsaysay</strong>: message the official Facebook page</li><li><strong>MPTVI Training Center</strong>: 0938-198-3735 · ${MPTVI_EMAIL}</li></ul>`,{actions:[PESO_ACTION,...MPTVI_ACTIONS],suggest:['Tech4ED services','PESO programs','MPTVI courses']});
const intents=[
{keys:['hi','hello','hey','kumusta','kamusta','musta','good morning','good afternoon','good evening','magandang','maayong'],run:()=>reply(`Magandang araw! 👋 How can I help you today? You can ask about digital skills, government services online, jobs, or TESDA courses.`,{suggest:suggestFor()})},
{keys:['thank','thanks','salamat','ty','tnx','daghang salamat'],run:()=>reply(`You're very welcome! Ready sa tech, ready sa life. 🌱 Anything else I can help with?`,{suggest:suggestFor()})},
{keys:['bye','goodbye','paalam'],run:()=>reply(`Take care! Drop by anytime.<br>${PLACE_LINE}`)},
{keys:['bot','robot','are you real','are you human','who are you'],run:()=>reply(`I'm the Tech4ED Magsaysay automated assistant. I can point you to the right program, office and contact person using this website's information. For anything official, the staff will confirm.`,{suggest:['Talk to a person','Tech4ED services']})},
{keys:['talk to a person','person','human','agent','staff','real person','tao','kausap'],run:handoff},
// Tech4ED services
P(['free','computer use','internet','wifi','print','printing','scan','scanning','encode','encoding','photocopy'],'Free Services'),
P(['philsys','national id','psa','nbi','sss','philhealth','pag-ibig','pagibig','egov','government id','government ids','birth certificate','clearance'],'eGov Help'),
P(['ict training','ict','computer class','computer training','excel','powerpoint','ms word','microsoft','canva','digital skills','email','online safety'],'ICT Training'),
P(['resume','cover letter','interview','job search','career support','online job'],'Career Support'),
P(['e-learning','elearning','online class','research','module','assignment'],'E-Learning'),
P(['senior','pwd','solo parent','women','out-of-school','osy','special sector'],'Special Sectors'),
P(['referral','refer','dict','partnership','partner'],'Referrals'),
// PESO programs
P(['peis','employment information'],'PEIS'),P(['sra','special recruitment'],'SRA'),P(['lra','local recruitment'],'LRA'),P(['pesla','pre-employment','seminar'],'PESLA'),
P(['lmi','labor market','in-demand'],'LMI'),P(['air','illegal recruit','scam','recruiter'],'AIR'),P(['jobs fair','job fair'],'Jobs Fair'),
P(['cdsp','career development','career guidance'],'CDSP'),P(['balik eskwela','scholarship','scholar'],'Balik Eskwela'),P(['gip','internship','intern'],'GIP'),
P(['tupad','disadvantaged','displaced','emergency employment'],'TUPAD'),P(['clpep','child labor'],'CLPEP'),
P(['sena','single entry','complaint','dispute','labor case','illegal dismissal','unpaid','sahod','sweldo','binayaran'],'SEnA'),
P(['rwa','rural workers','farmer','magsasaka','association'],'RWA'),P(['spes','summer job','student job','working student'],'SPES'),
P(['livelihood','negosyo','business'],'Livelihood'),P(['lydo','youth development','kabataan'],'LYDO'),
P(['bedo','barangay employment','employment desk'],'BEDO'),P(['tav','technical advisory','micro business','labor standards'],'TAV'),
P(['ofw','abroad','overseas','kasambahay','domestic helper','ibang bansa'],'OFW'),
// MPTVI courses
C(['smaw','welding','welder','hinang','welding course'],'SMAW'),C(['eim','eim course','electrical','electrician','wiring'],'EIM'),C(['heo','heavy equipment','excavator','backhoe'],'HEO'),
C(['driving','driver','drive','license'],'Driving'),C(['vgd','graphic design','visual graphic','layout'],'VGD'),C(['bookkeeping','bookkeeper','accounting'],'Bookkeeping'),C(['housekeeping','housekeeper','hotel'],'Housekeeping'),
{keys:['flower','arrangement','table skirting','skirting','soft skills','special training'],run:()=>reply(`MPTVI offers short special-training courses:<ul class="msg-list">${SPECIAL.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>Contact the MPTVI Training Center for the next batch.`,{actions:MPTVI_ACTIONS,suggest:['TESDA courses','How to enroll']})},
{keys:['assessment','assessment center','certification','certificate','national certificate','nc ii','nc2','competency'],run:()=>reply(`MPTVI is an <strong>accredited assessment center for Electrical Installation and Maintenance NC II</strong>. You can be assessed and certified under TESDA standards there.`,{cards:programCards(['Assessment']),actions:MPTVI_ACTIONS,suggest:['EIM course','Other TESDA courses','How to enroll']})},
{keys:['enroll','enrollment','enrol','how to enroll','registrar','cashier'],run:()=>reply(`To enroll in an MPTVI course, contact the <strong>MPTVI Training Center</strong>. The Registrar is <strong>Crisan Pauner</strong> and the Cashier is <strong>Bonnivie Tadle</strong>. They'll confirm schedules, slots and requirements.`,{actions:MPTVI_ACTIONS,suggest:['TESDA courses','Assessment center']})},
// Overviews
{keys:['mptvi','tesda','tesda courses','other tesda courses','vocational','tech-voc','techvoc','skills training','pellerin','mptvi courses'],run:()=>reply(`<strong>MPTVI</strong> (Maximino Pellerin Sr. Technical and Vocational Institute) offers these TESDA courses:<ul class="msg-list">${COURSES.map(c=>`<li><span class="nc">${c.level}</span> ${esc(c.name)} <span class="muted">· ${c.modes.join(', ')}</span></li>`).join('')}</ul>Ask me about any course to see its trainer.`,{actions:MPTVI_ACTIONS,suggest:['Welding course','Driving','Assessment center','How to enroll']})},
{keys:['tech4ed','tech4ed services','center services','services'],run:()=>list(`Here's what the <strong>Tech4ED Center</strong> offers. Tap a card for details.`,codesOf('Tech4ED'),'Tech4ED')},
{keys:['peso','peso programs'],run:()=>list(`<strong>PESO Magsaysay</strong> has ${codesOf('PESO').length} programs. Here are the most asked about:`,['PEIS','SRA','Jobs Fair','SPES','TUPAD','OFW'],'PESO')},
{keys:['job','jobs','work','trabaho','hanap','looking for work','vacancy','opening','hiring','employer','employment'],run:()=>list(`Let's find you work. These can help job seekers:`,['PEIS','SRA','LRA','Jobs Fair','Career Support','PESLA'],'PESO')},
{keys:['student','students','student programs','estudyante','school','youth','graduate','ojt'],run:()=>list(`For students and young people:`,['SPES','GIP','Balik Eskwela','CDSP','LYDO','E-Learning'],'PESO')},
{keys:['worker','worker support','workers','assist','tulong'],run:()=>list(`Support for workers:`,['TUPAD','SEnA','Livelihood','OFW','AIR','RWA'],'PESO')},
{keys:['programs','all programs','list','everything'],run:()=>reply(`This site lists <strong>${codesOf('Tech4ED').length} Tech4ED services</strong>, <strong>${codesOf('PESO').length} PESO programs</strong> and <strong>${COURSES.length} MPTVI TESDA courses</strong>. Which would you like to see?`,{suggest:['Tech4ED services','PESO programs','MPTVI courses']})},
// Practical questions
{keys:['apply','application','submit','mag-apply','sign up'],run:()=>reply(`Applications aren't submitted on this website. Here's where to go:<ul class="msg-list"><li><strong>Tech4ED services</strong>: visit the center</li><li><strong>PESO programs</strong>: message PESO with the program name</li><li><strong>MPTVI courses</strong>: call or email the training center</li></ul>`,{actions:[PESO_ACTION,...MPTVI_ACTIONS]})},
{keys:['requirement','requirements','document','documents','papers','eligible','eligibility','qualify','kailangan','fee','fees','bayad','price','magkano'],run:()=>reply(`Requirements and fees depend on the program and can change, so I won't guess. 🙏 The office handling your program will confirm exactly what to prepare. Which program are you interested in?`,{suggest:['Tech4ED services','PESO programs','MPTVI courses']})},
{keys:['schedule','when','date','sched','kailan','announcement','news','update','latest'],run:()=>reply(`Announcements are posted on the official PESO Magsaysay Facebook page, and the latest posts appear in this site's Updates section. For course batches, contact MPTVI. For Tech4ED schedules, ask at the center.`,{actions:[PESO_ACTION,...MPTVI_ACTIONS]})},
{keys:['where','location','address','office','contact','contacts','number','phone','hours','open','asa','saan'],run:handoff},
];
const fallback=()=>reply(`I'm not sure I got that. 😅 Try a topic below, or ask about a program, course or person by name.`,{suggest:['Tech4ED services','PESO programs','MPTVI courses','Talk to a person']});

// Search the directory when no intent matches.
function searchAnswer(t){const words=t.trim().split(' ').filter(w=>w.length>=4);if(!words.length)return null;
  const scored=programs.map(p=>({p,s:words.filter(w=>[p.code,p.name,p.desc,p.tag,...(p.items||[])].join(' ').toLowerCase().includes(w)).length})).filter(x=>x.s).sort((a,b)=>b.s-a.s).slice(0,3);
  return scored.length?reply(`Here's what I found:`,{cards:scored.map(x=>idx(x.p)),suggest:['Talk to a person']}):null;}
function answer(text){const t=norm(text);const person=personAnswer(t);let best=null,score=0;for(const it of intents){const s=scoreKeys(t,it.keys);if(s>score){score=s;best=it;}}
  if(person&&score<8)return person;if(best)return best.run();return person||searchAnswer(t)||fallback();}

// ---------- Rendering ----------
const time=()=>new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
function cardHtml(i){const p=programs[i];return `<button type="button" class="chat-card" data-open="${i}" data-office="${p.group}"><span class="chat-card-icon" aria-hidden="true">${p.icon}</span><span class="chat-card-body"><small>${p.group} · ${esc(p.tag)}</small><strong>${esc(p.code===p.name?p.name:p.code+' · '+p.name)}</strong><em>${esc(p.contact||T4E_PLACE)}</em></span><span class="chat-card-go" aria-hidden="true">→</span></button>`;}
function render(r){return `${r.text}${r.cards&&r.cards.length?`<div class="chat-cards">${r.cards.map(cardHtml).join('')}</div>`:''}${r.actions&&r.actions.length?`<div class="chat-actions">${r.actions.map(a=>`<a class="chat-link" href="${a.href}"${a.href.startsWith('http')?' target="_blank" rel="noopener noreferrer"':''}>${esc(a.label)}</a>`).join('')}</div>`:''}`;}
function addRow(html,from){const row=document.createElement('div');row.className='msg-row '+from;row.innerHTML=(from==='bot'?'<img class="msg-avatar" src="/assets/tech4ed-mark-128.webp" alt="">':'')+`<div class="msg ${from}">${html}<span class="msg-time">${time()}</span></div>`;chatLog.append(row);chatLog.scrollTop=chatLog.scrollHeight;return row;}
function setSuggestions(list){chatChips.innerHTML=(list||[]).map(s=>`<button type="button">${esc(s)}</button>`).join('');}
function botSay(r,instant){if(instant){addRow(render(r),'bot');setSuggestions(r.suggest);return;}
  const typing=addRow('<span class="typing"><span></span><span></span><span></span></span>','bot');typing.querySelector('.msg-time').remove();typing.setAttribute('aria-label','Assistant is typing');setSuggestions([]);
  const len=r.text.replace(/<[^>]+>/g,'').length;const delay=matchMedia('(prefers-reduced-motion: reduce)').matches?100:Math.min(500+len*8,1500);
  setTimeout(()=>{typing.remove();addRow(render(r),'bot');setSuggestions(r.suggest);},delay);}
function ask(text,instant){text=text.trim();if(!text)return;addRow(esc(text),'user');botSay(answer(text),instant);}
function welcome(){chatLog.innerHTML=`<div class="chat-welcome"><img src="/assets/tech4ed-mark-128.webp" alt=""><strong>Magandang araw! 👋</strong><p>I'm the Tech4ED Magsaysay assistant. I can help you find the right service, program or contact person.</p><div class="topic-grid"><button type="button" data-ask="Tech4ED services" data-office="Tech4ED"><span aria-hidden="true">⌨</span>Tech4ED services<small>Training, eGov, free access</small></button><button type="button" data-ask="I'm looking for work" data-office="PESO"><span aria-hidden="true">↗</span>Find work<small>PESO programs</small></button><button type="button" data-ask="MPTVI courses" data-office="MPTVI"><span aria-hidden="true">✦</span>TESDA courses<small>MPTVI training</small></button><button type="button" data-ask="Talk to a person"><span aria-hidden="true">☎</span>Contact a person<small>All offices</small></button></div></div>`;setSuggestions(['Free computer use','Government IDs online','Welding course','How to enroll']);}
let started=false;
function start(){if(started)return;started=true;welcome();store.get().forEach(q=>ask(q,true));}
function send(text){if(!text.trim())return;const saved=store.get();saved.push(text.trim());store.set(saved);ask(text);}
const nudge=document.createElement('button');nudge.type='button';nudge.className='chat-nudge';nudge.hidden=true;nudge.textContent='Hi! 👋 Need help finding a service?';document.body.append(nudge);
function setChat(open){chat.hidden=!open;chatToggle.setAttribute('aria-expanded',String(open));chatToggle.classList.toggle('is-open',open);nudge.hidden=true;if(open){start();chatInput.focus();}}
nudge.addEventListener('click',()=>setChat(true));
try{if(!sessionStorage.getItem('t4e-nudged')){setTimeout(()=>{if(chat.hidden){nudge.hidden=false;sessionStorage.setItem('t4e-nudged','1');setTimeout(()=>nudge.hidden=true,9000);}},5000);}}catch{}
chatToggle.addEventListener('click',()=>setChat(chat.hidden));
document.querySelector('#chat-close').addEventListener('click',()=>{setChat(false);chatToggle.focus();});
document.querySelector('#chat-reset').addEventListener('click',()=>{store.set([]);welcome();chatInput.focus();});
chatForm.addEventListener('submit',e=>{e.preventDefault();send(chatInput.value);chatInput.value='';});
chatChips.addEventListener('click',e=>{const b=e.target.closest('button');if(b)send(b.textContent);});
chatLog.addEventListener('click',e=>{const o=e.target.closest('[data-open]');if(o){openProgram(Number(o.dataset.open));return;}const a=e.target.closest('[data-ask]');if(a)send(a.dataset.ask);});
chat.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.open){setChat(false);chatToggle.focus();}});
