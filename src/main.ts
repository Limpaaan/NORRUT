import {installPlayerServices} from './player-services';
import {installRouteHud} from './route';
import './route.css';
import {installInstruments} from './instrument-ui';
import {syncGear,product} from './equipment';
import {installProgression,ensureGear} from './progression';
import Phaser from 'phaser';
import './style.css';
import './shell.css';
import './orientation.css';
import {MAX_FLIGHT_SECONDS,buy,buyBooster,cost,unlocked,launch,lockRun,settle,step,practiceVehicle,upgrades,boosters,sabotages,busCount,openCrate,sendBus,type Flight,type Controls,type BoosterId,type SabotageId,type Mode} from './model';
import {LocalSaveRepository,pilots,addPilot,pilotKey} from './storage';
import {installHotkeys} from './hotkeys';
import {installAccounts} from './accounts';
import {createJourney,landmarks} from './journey';
import {installShell} from './shell';
const el=(id:string)=>document.getElementById(id)!;
const select=(id:string)=>el(id) as HTMLSelectElement;
let pilotId='default',cloudUser:string|null=null,repo=new LocalSaveRepository();
const save=repo.load();ensureGear(save);const controls:Controls={left:false,right:false,thrust:false,boost:false};
let activeVehicle=save;
let phase:'ready'|'countdown'|'flying'='ready',flight:Flight=launch(save),accumulator=0,countdown=0,revealed=false,accountPaused=false;
const shell=installShell({isPlaying:()=>phase!=='ready',release});const instruments=installInstruments();const routeHud=installRouteHud();
let accounts:ReturnType<typeof installAccounts>|undefined;let progression:ReturnType<typeof installProgression>|undefined;const chosen=new Set<BoosterId>();
const busy=()=>phase!=='ready'||accountPaused;
const notice=(text:string)=>{el('shop-notice').textContent=text;};
function persist(){const okay=repo.save(save);el('save-status').textContent=okay?'Sparat på den här enheten':'Kunde inte spara lokalt';accounts?.save(save);return okay;}
function release(){for(const k of Object.keys(controls) as (keyof Controls)[])controls[k]=false;accumulator=0;}
function mode(){return select('run-mode').value as Mode;}
function render(){
 ensureGear(save);
 el('wallet').textContent=`◈ ${save.coins.toLocaleString('sv-SE')} skrotmynt`;el('record').textContent=`${save.best.toLocaleString('sv-SE')} m`;el('bus-record').textContent=`Lokalt busläge: ${save.busBest} m`;
 el('vehicle-name').textContent=`${save.levels.engine>=14?'NORDSTJÄRNAN · RAKET':save.levels.engine>=9?'TURBOJET':save.levels.engine>=4?'PROPELLERFLYGAREN':'SKROTFLYGAREN'} · MK ${1+Math.floor(save.levels.engine/3)}`;
 el('launch').toggleAttribute('disabled',busy());select('run-mode').disabled=busy();select('practice-bus').disabled=busy();select('pilot-select').disabled=busy()||!!cloudUser;el('practice-options').hidden=mode()!=='practice';
 document.querySelector<HTMLButtonElement>('[data-control="thrust"]')!.disabled=mode()!=='practice'&&save.levels.engine===0;document.querySelector<HTMLButtonElement>('[data-control="boost"]')!.disabled=mode()!=='practice'&&(phase==='ready'?save:activeVehicle).levels.rockets===0&&!flight.boosterIds.includes('nitro');
 el('mode-info').textContent=mode()==='practice'?'Provflygning lånar glidvinge, motor och raket. Boosters är gratis. Inga belöningar eller rekord sparas.':mode()==='friends'?'Lokalt kompisläge: eventuellt bus avslöjas under nedräkningen. Boosters förbrukas redan när rundan låses.':'Ensampilot: inga sabotage. Eget rekord. Valda engångsboosters förbrukas vid start.';
 el('loadout').replaceChildren();for(const b of boosters){const label=document.createElement('label');label.className='booster-chip';const input=document.createElement('input');input.type='checkbox';input.checked=chosen.has(b.id);input.disabled=busy()||(mode()!=='practice'&&save.inventory[b.id]<1);input.onchange=()=>{if(input.checked&&chosen.size>=3){input.checked=false;notice('Välj högst tre boosters per runda.');return;}if(input.checked)chosen.add(b.id);else chosen.delete(b.id);};label.append(input,document.createTextNode(`${b.icon} ${b.name} · ${mode()==='practice'?'gratis':save.inventory[b.id]+' st'}`));el('loadout').append(label);}
 progression?.render();
 el('boosters').replaceChildren();for(const b of boosters){const card=document.createElement('article');card.innerHTML=`<div class="upgrade-icon">${b.icon}</div><small>ENGÅNGSBOOSTER · ${save.inventory[b.id]} I LAGRET</small><h3>${b.name}</h3><p>${b.description}</p>`;const btn=document.createElement('button');btn.textContent=`Köp · ◈ ${b.price}`;btn.disabled=busy()||save.coins<b.price||save.inventory[b.id]>=99;btn.onclick=()=>{if(!busy()&&buyBooster(save,b.id)){persist();render();}};card.append(btn);el('boosters').append(card);}
 el('crate-count').textContent=`${save.crates} verkstadslådor · ${save.tickets} busbiljetter · ${busCount(save)} / 5 busföremål. En ny låda var femte flygning och en biljett var tionde.`;el('open-crate').toggleAttribute('disabled',busy()||save.crates<1);
 el('bus-cards').replaceChildren();for(const b of sabotages){const card=document.createElement('article');card.innerHTML=`<small>${b.rarity.toLocaleUpperCase()} · ${save.bus[b.id]} I LAGRET</small><h3>${b.name}</h3><p>${b.description}</p>`;const buttons=document.createElement('div');buttons.className='card-actions';const test=document.createElement('button');test.textContent='Provflyg';test.disabled=busy();test.onclick=()=>{select('run-mode').value='practice';select('practice-bus').value=b.id;resetOverlay();shell.ready();render();shell.closeMenus();};const send=document.createElement('button');send.textContent='Skicka lokalt';send.disabled=busy()||!!cloudUser||save.bus[b.id]<1||save.tickets<1||pilots().length<2;send.onclick=()=>openSend(b.id);buttons.append(test,send);card.append(buttons);el('bus-cards').append(card);}
 const current=select('pilot-select');current.replaceChildren();for(const p of pilots()){const option=new Option(p.name,p.id);current.append(option);}current.value=pilotId;
 el('history').replaceChildren();for(const entry of [...save.history].reverse()){const li=document.createElement('li');li.textContent=entry;el('history').append(li);}if(!save.history.length)el('history').textContent='Din första berättelse väntar på startplattan.';
}
function setTab(id:string){document.getElementById('progression')!.hidden=true;for(const tab of ['upgrades','boosters','sabotage','pilots'])el(tab).hidden=tab!==id;document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===id)));}
document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab!));
for(const b of sabotages)select('practice-bus').append(new Option(b.name,b.id));select('run-mode').onchange=()=>{chosen.clear();render();};
el('open-crate').onclick=()=>{if(busy())return;const result=openCrate(save);if(!result)return;persist();notice(`Lådan innehöll ${boosters.find(b=>b.id===result.booster)!.name}${result.sabotage?' och '+sabotages.find(b=>b.id===result.sabotage)!.name:'!'}`);render();};
select('pilot-select').onchange=()=>{if(busy()||cloudUser)return;persist();pilotId=select('pilot-select').value;repo=new LocalSaveRepository(pilotKey(pilotId));Object.assign(save,{gear:undefined,achievements:[],launchpad:undefined},repo.load());chosen.clear();activeVehicle=save;flight=launch(save);resetOverlay();render();};
el('new-pilot').onsubmit=e=>{e.preventDefault();if(busy()||cloudUser)return;const input=el('pilot-name') as HTMLInputElement;const p=addPilot(input.value);if(!p){notice('Välj ett unikt namn. Högst åtta lokala piloter stöds.');return;}input.value='';notice(`Piloten ${p.name} skapades. Välj piloten i listan för att spela.`);render();};
let sending:SabotageId|null=null;const sendDialog=el('send-dialog') as HTMLDialogElement;
function openSend(id:SabotageId){if(busy()||cloudUser)return;sending=id;select('recipient').replaceChildren();for(const p of pilots().filter(p=>p.id!==pilotId))select('recipient').append(new Option(p.name,p.id));el('send-name').textContent=sabotages.find(b=>b.id===id)!.name;el('send-status').textContent='';sendDialog.showModal();}
el('close-send').onclick=()=>sendDialog.close();el('send-form').onsubmit=e=>{e.preventDefault();if(!sending||busy()||cloudUser)return;const id=select('recipient').value;if(!pilots().some(p=>p.id===id)||id===pilotId)return;const otherRepo=new LocalSaveRepository(pilotKey(id)),other=otherRepo.load(),before=structuredClone(save);const error=sendBus(save,other,sending,pilotId,pilots().find(p=>p.id===pilotId)!.name,(el('anonymous') as HTMLInputElement).checked);if(error){el('send-status').textContent=error;return;}if(!repo.save(save)){Object.assign(save,before);el('send-status').textContent='Kunde inte spara. Inget bus skickades.';return;}if(!otherRepo.save(other)){Object.assign(save,before);repo.save(save);el('send-status').textContent='Kunde inte spara mottagarens bus. Resurserna återställdes.';return;}sendDialog.close();notice('Buset skickades till den lokala piloten. Det avslöjas först efter att nästa kompisrunda låsts.');render();};
function resetOverlay(){el('overlay').style.display='block';el('overlay').querySelector('h2')!.textContent='Vi ses bortom trädtopparna.';el('message').textContent='Välj utrustning och starta nästa flygning.';el('launch').textContent='Starta flygningen ↗';el('flight-status').textContent='';}
el('launch').onclick=()=>{if(busy())return;activeVehicle=mode()==='practice'?practiceVehicle(save):structuredClone(save);const before=structuredClone(save),locked=lockRun(mode()==='practice'?activeVehicle:save,[...chosen],mode(),select('practice-bus').value as SabotageId||null);if(!locked){notice('En vald booster saknas. Välj utrustning igen.');chosen.clear();render();return;}if(mode()!=='practice'&&save.gear?.mounted.rockets){const id=save.gear.mounted.rockets;const part=save.gear.items.find(p=>p.id===id);if(part)(save.gear.shopSteps||(save.gear.shopSteps={})).rockets=Math.max(save.gear.shopSteps?.rockets||0,product(part).tier);save.gear.items=save.gear.items.filter(p=>p.id!==id);delete save.gear.mounted.rockets;syncGear(save);}
 if(!repo.save(save)){Object.assign(save,before);notice('Kunde inte låsa rundan i lagringen. Starten avbröts utan att förbruka boosters.');return;}accounts?.save(save);flight=locked;phase='countdown';countdown=3000;revealed=false;release();chosen.clear();shell.beginRun();el('overlay').style.display='none';el('flight-status').textContent='3 · Utrustningen är låst';el('launch').blur();render();};
function tick(delta:number){
 if(!shell.canSimulate())return;
 if(phase==='countdown'){countdown-=Math.min(delta,100);if(countdown<=1600&&!revealed){revealed=true;el('flight-status').textContent=flight.blocked?'Verkstadslåset stoppade ett bus!':flight.sabotage?`${sabotages.find(b=>b.id===flight.sabotage)!.name}! ${flight.sender?flight.sender.anonymous?'Från en hemlig uppfinnare':`Från ${flight.sender.senderName}`:'Provflygning'}`:'Alla system klara · 2… 1…';}if(countdown<=0){phase='flying';if(!flight.sabotage&&!flight.blocked)el('flight-status').textContent='';render();}}
 if(phase==='flying'){accumulator+=Math.min(delta/1000,.1);while(accumulator>=1/120&&phase==='flying'){step(flight,controls,activeVehicle,1/120);accumulator-=1/120;if((flight.y<=0&&flight.time>.2)||flight.time>=MAX_FLIGHT_SECONDS){flight.y=Math.max(0,flight.y);const result=settle(save,flight);phase='ready';shell.endRound();el('flight-status').textContent='';persist();el('overlay').style.display='block';el('overlay').querySelector('h2')!.textContent=flight.mode==='practice'?'Provflygningen är klar.':flight.y>0?'Tio minuter. Dags för bärgning.':result.soft?'Mjukt ner. Längre nästa gång.':'En historia till för verkstaden.';el('message').textContent=`${Math.floor(flight.x)} meter norrut${flight.mode==='practice'?' · inga föremål eller mynt förbrukades.':` · +${result.reward} skrotmynt.${result.achievementReward?' +'+result.achievementReward+' i prestationsbonus!':''}${result.crate?' Ny verkstadslåda!':''}${result.recovered?' Ett bus återvanns!':''}`}`;el('launch').textContent='En flygning till ↗';render();}}}
 el('distance').textContent=`${Math.floor(flight.x)} m`;
 const compass=flight.sabotage==='compass'&&flight.time<20&&phase==='flying';
 el('altitude').textContent=`${phase!=='flying'&&!flight.settled?0:Math.floor(compass?flight.y+Math.sin(flight.time*4)*45:flight.y)} m${compass?' ?':''}`;
 el('speed').textContent=`${phase!=='flying'&&!flight.settled?0:Math.round(Math.hypot(flight.vx,flight.vy)*3.6+(compass?Math.cos(flight.time*3)*70:0))} km/h${compass?' ?':''}`;
 el('place').textContent=[...landmarks].reverse().find(l=>l.x<=flight.x)!.name;
 (el('fuel') as HTMLMeterElement).value=activeVehicle.levels.engine>0?flight.fuel/flight.maxFuel*100:0;
 (el('boost') as HTMLMeterElement).value=flight.maxBoost>0?flight.boost/flight.maxBoost*100:0;
 el('flight-advice').textContent=phase==='flying'?(flight.stalled?'STALL · sänk nosen och bygg fart':save.levels.wings===0&&save.levels.engine===0&&save.levels.rockets===0?'Rampstart · köp en glidvinge, motor eller raket i Butiken':'Dyk för fart · ta upp mjukt och behåll energin'):'';
 routeHud.update(flight.x);
 instruments.update(flight,activeVehicle,phase==='flying');
 el('run-tag').textContent=flight.mode==='practice'?'PROVFLYGNING · UTAN BELÖNINGAR':flight.mode==='friends'?'LOKALT KOMPISLÄGE':'ENSAMPILOT · UTAN SABOTAGE';
}
new Phaser.Game({type:Phaser.AUTO,parent:'game',backgroundColor:'#91b9cd',scale:{mode:Phaser.Scale.RESIZE,width:'100%',height:'100%'},scene:createJourney(()=>({flight,save:activeVehicle,controls,flying:phase==='flying',phase,paused:!shell.canSimulate(),reduced:shell.reducedMotion(),tick})),render:{antialias:true},audio:{noAudio:true}});
installHotkeys(controls,release);window.addEventListener('blur',release);document.addEventListener('visibilitychange',release);
document.querySelectorAll<HTMLButtonElement>('[data-control]').forEach(b=>{const k=b.dataset.control as keyof Controls;b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);controls[k]=true;b.classList.add('held');};const up=()=>{controls[k]=false;b.classList.remove('held');};b.onpointerup=up;b.onpointercancel=up;b.onlostpointercapture=up;});
accounts=installAccounts({isFlying:()=>phase!=='ready',replace:(data,userId)=>{cloudUser=userId;repo=new LocalSaveRepository(userId?`norrut.account.${userId}`:pilotKey(pilotId));Object.assign(save,{gear:undefined,adminSeq:0,achievements:[],launchpad:undefined},userId?data:repo.load());repo.save(save);chosen.clear();activeVehicle=save;flight=launch(save);render();},pause:value=>{accountPaused=value;render();}});progression=installProgression({save,busy,changed(){activeVehicle=save;flight=launch(save);persist();render();},market(name,args){if(['scrap_buy','scrap_search'].includes(name))accounts!.save(save);return accounts!.market(name,args);}});installPlayerServices({save,loggedIn:()=>accounts!.loggedIn(),busy,pilotId:()=>pilotId,rpc:(name,args)=>accounts!.market(name,args),apply(data){if(!repo.save(data))return;Object.assign(save,{gear:undefined,launchpad:undefined,achievements:[]},data);activeVehicle=save;flight=launch(save);render();}});shell.finishSetup();render();


