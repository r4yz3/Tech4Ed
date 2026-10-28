// Scripted helper chat. Answers only from the program directory and FAQ; never invents schedules, eligibility, or requirements.
const FB='https://www.facebook.com/pesolgumagsaysay';
const chat=document.querySelector('#chat'),chatToggle=document.querySelector('#chat-toggle'),chatLog=document.querySelector('#chat-log'),chatForm=document.querySelector('#chat-form'),chatInput=document.querySelector('#chat-input'),chatChips=document.querySelector('#chat-chips');
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(href,text)=>`<a class="chat-link" href="${href}" target="_blank" rel="noopener noreferrer">${text} ↗</a>`;
const program=code=>programs.find(p=>p[0]===code);
function programReply(code){const p=program(code);return `<strong>${p[0]}</strong> is the ${p[1]}. ${p[5]}<br><br>Your focal person is <strong>${p[2]}</strong>. They can confirm if it's open right now and what you'll need.${link(p[7]||FB,p[7]?'View focal person':'Message PESO')}`;}
function programsReply(codes,intro){return `${intro}<ul>${codes.map(c=>{const p=program(c);return `<li><button class="chat-inline" data-ask="${p[0]}"><strong>${p[0]}</strong> · ${p[1]}</button></li>`;}).join('')}</ul>Tap one and I'll tell you more.`;}
const intents=[
{keys:['hi','hello','hey','kumusta','kamusta','musta','good morning','good afternoon','good evening','magandang'],reply:()=>`Hi there! 👋 Glad you dropped by. What kind of help are you looking for today: work, school, or support as a worker?`},
{keys:['thank','thanks','salamat','ty','tnx'],reply:()=>`You're very welcome! If anything else comes up, I'm right here. Good luck on your next step! 🌱`},
{keys:['bye','goodbye','paalam'],reply:()=>`Take care! Don't forget to follow the PESO Magsaysay page for new openings.${link(FB,'Follow PESO')}`},
{keys:['peis','employment information'],reply:()=>programReply('PEIS')},
{keys:['cdsp','career','guidance','career development'],reply:()=>programReply('CDSP')},
{keys:['spes','summer job','student job','working student'],reply:()=>programReply('SPES')},
{keys:['sena','single entry','complaint','dispute','labor case','illegal dismissal','unpaid','sahod','sweldo'],reply:()=>programReply('SEnA')},
{keys:['tupad','disadvantaged','displaced','emergency employment'],reply:()=>programReply('TUPAD')},
{keys:['sra/lra','sra','lra','job fair','recruitment','hiring','employer'],reply:()=>programReply('SRA/LRA')},
{keys:['rwa','rural','association','farmer','magsasaka'],reply:()=>programReply('RWA')},
{keys:['ofw','abroad','overseas','kasambahay','domestic helper','ibang bansa'],reply:()=>programReply('OFW')},
{keys:['lydo','youth council','youth development','kabataan'],reply:()=>programReply('LYDO')},
{keys:['job','work','trabaho','hanap','looking for work','vacancy','opening','apply job','employment'],reply:()=>programsReply(['PEIS','SRA/LRA','TUPAD'],`Let's find you some work! These are the programs that help job seekers:`)},
{keys:['student','estudyante','school','scholar','youth','graduate','ojt'],reply:()=>programsReply(['SPES','CDSP','LYDO'],`Nice, building your future! For students and young people, check these out:`)},
{keys:['worker','support','help','assist','tulong'],reply:()=>programsReply(['SEnA','TUPAD','RWA','OFW'],`I'm here to help. For workers who need support, PESO has these:`)},
{keys:['programs','services','list','all'],reply:()=>programsReply(programs.map(p=>p[0]),`PESO Magsaysay has nine programs:`)},
{keys:['apply','application','submit','register','mag-apply','sign up'],reply:()=>`Applications aren't submitted on this website. The PESO team handles them directly. Message them with the program name, and they'll tell you if it's open and how to apply.${link(FB,'Message PESO')}`},
{keys:['requirement','requirements','document','documents','papers','eligib','qualif','kailangan'],reply:()=>`Requirements depend on the program and can change, so I don't want to give you an outdated list. 🙏 The focal person for your program can confirm exactly what to prepare. Which program are you interested in?`},
{keys:['schedule','when','date','sched','kailan','announcement','news','update','latest'],reply:()=>`Schedules and announcements are posted on the official PESO Magsaysay Facebook page. You can also see the latest posts in the Updates section of this page.${link(FB,'Open Facebook page')}`},
{keys:['where','office','location','address','contact','number','phone','email','hours','open'],reply:()=>`The quickest way to reach PESO Magsaysay is through their official Facebook page. Send them a message there and ask about office hours and location.${link(FB,'Message PESO')}`},
{keys:['person','human','agent','staff','talk','real','tao'],reply:()=>`Sure! I'm an automated helper, so for a real person please message the PESO team on Facebook. They'll get back to you there.${link(FB,'Message PESO')}`},
{keys:['bot','robot','ai','are you'],reply:()=>`I'm an automated helper for this website, not a PESO staff member. I can point you to the right program and focal person. For anything official, the PESO team will confirm.`}
];
const fallback=()=>`Hmm, I'm not sure I got that. 😅 I can help with jobs, student programs, worker support, or how to contact PESO. You can also message the team directly.${link(FB,'Message PESO')}`;
function answer(text){const t=' '+text.toLowerCase().replace(/[^a-z0-9ñ/ -]/g,' ')+' ';let best=null,score=0;for(const intent of intents){const s=intent.keys.reduce((n,k)=>n+((k.length<4?t.includes(' '+k+' ')||t.includes(' '+k+'s '):t.includes(k))?1:0),0);if(s>score){score=s;best=intent;}}return best?best.reply():fallback();}
function addMessage(html,from){const div=document.createElement('div');div.className='msg '+from;div.innerHTML=html;chatLog.append(div);chatLog.scrollTop=chatLog.scrollHeight;}
function botSay(html){const typing=document.createElement('div');typing.className='msg bot typing';typing.setAttribute('aria-label','Helper is typing');typing.innerHTML='<span></span><span></span><span></span>';chatLog.append(typing);chatLog.scrollTop=chatLog.scrollHeight;const delay=Math.min(600+html.replace(/<[^>]+>/g,'').length*12,1800);setTimeout(()=>{typing.remove();addMessage(html,'bot');},matchMedia('(prefers-reduced-motion: reduce)').matches?150:delay);}
function ask(text){if(!text.trim())return;addMessage(esc(text),'user');botSay(answer(text));}
let greeted=false;
function setChat(open){chat.hidden=!open;chatToggle.setAttribute('aria-expanded',String(open));chatToggle.classList.toggle('is-open',open);if(open){if(!greeted){greeted=true;botSay(`Hi! I'm the PESO Magsaysay helper. 😊 I'm an automated assistant, and I can help you find the right program and who to contact. What brings you here today?`);}chatInput.focus();}}
chatToggle.addEventListener('click',()=>setChat(chat.hidden));
document.querySelector('#chat-close').addEventListener('click',()=>{setChat(false);chatToggle.focus();});
chatForm.addEventListener('submit',e=>{e.preventDefault();ask(chatInput.value);chatInput.value='';});
chatChips.addEventListener('click',e=>{const b=e.target.closest('button');if(b)ask(b.textContent);});
chatLog.addEventListener('click',e=>{const b=e.target.closest('[data-ask]');if(b)ask(b.dataset.ask);});
chat.addEventListener('keydown',e=>{if(e.key==='Escape'){setChat(false);chatToggle.focus();}});
