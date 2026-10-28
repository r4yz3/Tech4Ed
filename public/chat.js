// Scripted helper chat. Answers only from the program directory and FAQ; never invents schedules, eligibility, or requirements.
const chat=document.querySelector('#chat'),chatToggle=document.querySelector('#chat-toggle'),chatLog=document.querySelector('#chat-log'),chatForm=document.querySelector('#chat-form'),chatInput=document.querySelector('#chat-input'),chatChips=document.querySelector('#chat-chips');
const link=(href,text)=>`<a class="chat-link" href="${href}" target="_blank" rel="noopener noreferrer">${text} ↗</a>`;
const visit=`<br><br>📍 Visit us at the <strong>${T4E_PLACE}</strong>.`;
const program=code=>programs.find(p=>p.code===code);
const codesOf=g=>programs.filter(p=>p.group===g).map(p=>p.code);
function programReply(code){const p=program(code);if(p.group!=='PESO')return `<strong>${esc(p.name)}</strong>: ${esc(p.desc)}<ul>${p.items.map(i=>`<li>• ${esc(i)}</li>`).join('')}</ul>Ask the staff if it's available today and what to bring.${visit}`;return `<strong>${esc(p.code)}</strong> is the ${esc(p.name)}. ${esc(p.desc)}<br><br>Your focal person is <strong>${esc(p.contact)}</strong> (${esc(p.role)}). They can confirm if it's open right now and what you'll need.${link(p.link||PESO_FB,p.link?'View focal person':'Message PESO')}`;}
function programsReply(codes,intro){return `${intro}<ul>${codes.map(c=>{const p=program(c);return `<li><button class="chat-inline" data-ask="${esc(p.code)}"><strong>${esc(p.code)}</strong> · ${esc(p.name)}</button></li>`;}).join('')}</ul>Tap one and I'll tell you more.`;}
const one=(keys,code)=>({keys,reply:()=>programReply(code)});
const intents=[
{keys:['hi','hello','hey','kumusta','kamusta','musta','good morning','good afternoon','good evening','magandang'],reply:()=>`Hi there! 👋 Glad you dropped by. Are you looking for digital skills, help with online government services, work, or training?`},
{keys:['thank','thanks','salamat','ty','tnx'],reply:()=>`You're very welcome! If anything else comes up, I'm right here. Ready sa tech, ready sa life! 🌱`},
{keys:['bye','goodbye','paalam'],reply:()=>`Take care! Drop by the Tech4ED Center anytime.${visit}`},
one(['free','computer','internet','wifi','print','printing','scan','scanning','encode','encoding','photocopy'],'Free Services'),
one(['philsys','national id','psa','nbi','sss','philhealth','pag-ibig','pagibig','egov','government','id','birth certificate','clearance'],'eGov Help'),
one(['ict','training','excel','word','powerpoint','canva','computer class','digital skills','email','online safety'],'ICT Training'),
one(['resume','cover letter','interview','job search','career support','online job'],'Career Support'),
one(['e-learning','elearning','online class','research','module','assignment'],'E-Learning'),
one(['senior','pwd','solo parent','women','out-of-school','osy','special sector'],'Special Sectors'),
one(['referral','refer','tesda','dict','partnership','partner'],'Referrals'),
one(['peis','employment information'],'PEIS'),
one(['sra','special recruitment'],'SRA'),
one(['lra','local recruitment'],'LRA'),
one(['lmi','labor market','in-demand'],'LMI'),
one(['air','illegal recruit','scam','recruiter'],'AIR'),
one(['jobs fair','job fair'],'Jobs Fair'),
one(['cdsp','career development','guidance'],'CDSP'),
one(['balik eskwela','scholarship','scholar'],'Balik Eskwela'),
one(['gip','internship','intern'],'GIP'),
one(['tupad','disadvantaged','displaced','emergency employment'],'TUPAD'),
one(['clpep','child labor'],'CLPEP'),
one(['spes','summer job','student job','working student'],'SPES'),
one(['livelihood','negosyo','business'],'Livelihood'),
one(['lydo','youth development','kabataan'],'LYDO'),
one(['bedo','barangay employment','employment desk','barangay'],'BEDO'),
one(['tav','technical advisory','micro','labor standards','compliance'],'TAV'),
one(['pesla','pre-employment','seminar'],'PESLA'),
one(['ofw','abroad','overseas','kasambahay','domestic helper','ibang bansa'],'OFW'),
{keys:['mptvi','vocational','tech-voc','techvoc','skills training','nc ii'],reply:()=>`MPTVI programs will be listed on this site soon. In the meantime, the Tech4ED Center can refer you to MPTVI and TESDA for technical-vocational training.${visit}`},
{keys:['job','work','trabaho','hanap','looking for work','vacancy','opening','apply job','employment','hiring','employer'],reply:()=>programsReply(['PEIS','SRA','LRA','Jobs Fair','Career Support'],`Let's find you some work! These can help job seekers:`)},
{keys:['student','estudyante','school','youth','graduate','ojt'],reply:()=>programsReply(['SPES','GIP','Balik Eskwela','CDSP','LYDO','E-Learning'],`Nice, building your future! For students and young people, check these out:`)},
{keys:['worker','support','assist','tulong'],reply:()=>programsReply(['TUPAD','Livelihood','OFW','AIR','CLPEP'],`I'm here to help. For workers who need support, PESO has these:`)},
{keys:['tech4ed','center','services'],reply:()=>programsReply(codesOf('Tech4ED'),`Here's what the Tech4ED Center offers:`)},
{keys:['peso'],reply:()=>programsReply(codesOf('PESO'),`PESO Magsaysay programs:`)},
{keys:['programs','list','all'],reply:()=>`We have <strong>${codesOf('Tech4ED').length} Tech4ED services</strong> and <strong>${codesOf('PESO').length} PESO programs</strong>, with MPTVI programs coming soon. Ask me about "Tech4ED" or "PESO" to see the list.`},
{keys:['apply','application','submit','register','mag-apply','sign up'],reply:()=>`Applications aren't submitted on this website. For Tech4ED services, visit the center. For PESO programs, message PESO with the program name and they'll tell you how to apply.${link(PESO_FB,'Message PESO')}${visit}`},
{keys:['requirement','requirements','document','documents','papers','eligib','qualif','kailangan'],reply:()=>`Requirements depend on the program and can change, so I don't want to give you an outdated list. 🙏 The staff or focal person can confirm exactly what to prepare. Which program are you interested in?`},
{keys:['schedule','when','date','sched','kailan','announcement','news','update','latest'],reply:()=>`Announcements are posted on the official PESO Magsaysay Facebook page, and you can see the latest posts in the Updates section. For Tech4ED schedules, ask at the center.${link(PESO_FB,'Open Facebook page')}${visit}`},
{keys:['where','office','location','address','contact','number','phone','hours','open'],reply:()=>`You'll find us at the ${T4E_PLACE}. For PESO programs, you can also message PESO Magsaysay on Facebook.${link(PESO_FB,'Message PESO')}`},
{keys:['person','human','agent','staff','talk','real','tao'],reply:()=>`Sure! I'm an automated helper. To talk to a real person, visit the Tech4ED Center or message the PESO team on Facebook.${link(PESO_FB,'Message PESO')}${visit}`},
{keys:['bot','robot','ai','are you'],reply:()=>`I'm an automated helper for this website, not a staff member. I can point you to the right Tech4ED or PESO program. For anything official, the staff will confirm.`}
];
const fallback=()=>`Hmm, I'm not sure I got that. 😅 I can help with digital skills, online government services, free computer use, jobs, and student programs. You can also ask the staff directly.${visit}`;
function answer(text){const t=' '+text.toLowerCase().replace(/[^a-z0-9ñ/ -]/g,' ')+' ';let best=null,score=0;for(const intent of intents){const s=intent.keys.reduce((n,k)=>n+((k.length<4?t.includes(' '+k+' ')||t.includes(' '+k+'s '):t.includes(k))?1:0),0);if(s>score){score=s;best=intent;}}return best?best.reply():fallback();}
function addMessage(html,from){const div=document.createElement('div');div.className='msg '+from;div.innerHTML=html;chatLog.append(div);chatLog.scrollTop=chatLog.scrollHeight;}
function botSay(html){const typing=document.createElement('div');typing.className='msg bot typing';typing.setAttribute('aria-label','Helper is typing');typing.innerHTML='<span></span><span></span><span></span>';chatLog.append(typing);chatLog.scrollTop=chatLog.scrollHeight;const delay=Math.min(600+html.replace(/<[^>]+>/g,'').length*12,1800);setTimeout(()=>{typing.remove();addMessage(html,'bot');},matchMedia('(prefers-reduced-motion: reduce)').matches?150:delay);}
function ask(text){if(!text.trim())return;addMessage(esc(text),'user');botSay(answer(text));}
let greeted=false;
function setChat(open){chat.hidden=!open;chatToggle.setAttribute('aria-expanded',String(open));chatToggle.classList.toggle('is-open',open);if(open){if(!greeted){greeted=true;botSay(`Hi! I'm the Tech4ED Magsaysay helper. 😊 I'm an automated assistant, and I can help you find the right Tech4ED, PESO or MPTVI program and where to go. What brings you here today?`);}chatInput.focus();}}
chatToggle.addEventListener('click',()=>setChat(chat.hidden));
document.querySelector('#chat-close').addEventListener('click',()=>{setChat(false);chatToggle.focus();});
chatForm.addEventListener('submit',e=>{e.preventDefault();ask(chatInput.value);chatInput.value='';});
chatChips.addEventListener('click',e=>{const b=e.target.closest('button');if(b)ask(b.textContent);});
chatLog.addEventListener('click',e=>{const b=e.target.closest('[data-ask]');if(b)ask(b.dataset.ask);});
chat.addEventListener('keydown',e=>{if(e.key==='Escape'){setChat(false);chatToggle.focus();}});
