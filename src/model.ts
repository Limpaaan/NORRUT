import {vehicleEffect,wingLiftCoefficient} from './part-stats.ts';
import {researchEffects} from './research-effects.ts';
import {flightPay} from './economy.ts';
import {awardAchievements,achievements,blankLaunchpad,rampBonus,type Launchpad} from './career.ts';
import {mounted,strength,catalog,makePart,blankGear,syncGear,advanceResearch,type Gear} from './equipment.ts';
export const upgrades = [
 {id:'engine',name:'Motor',description:'Första köpet installerar en motor. Håll ↑ / W för dragkraft.',icon:'↗',base:40,max:20},
 {id:'tank',name:'Bränsletank',description:'+1,5 sekunders motortid per nivå.',icon:'◒',base:40,max:20},
 {id:'wings',name:'Glidvinge',description:'Första köpet ger riktig glidflykt. Rätt anfallsvinkel bevarar farten.',icon:'⌁',base:40,max:20},
 {id:'chassis',name:'Lättviktschassi',description:'Minskar vikten med 2 % per nivå.',icon:'◇',base:65,max:15},
 {id:'ramp',name:'Startramp',description:'+2 m/s i startfart per nivå.',icon:'∠',base:55,max:15},
 {id:'rockets',name:'Raketpaket',description:'Första köpet installerar en raket. Fler nivåer ger längre och starkare boost.',icon:'✦',base:65,max:15},
 {id:'efficiency',name:'Bränsleinsprutning',description:'2,5 % lägre förbrukning per nivå.',icon:'◴',base:65,max:15,requires:'tank',required:2},
 {id:'steering',name:'Styrkalibrering',description:'Snabbare styrning. Kortare omvänd styrning.',icon:'⌖',base:70,max:10,requires:'wings',required:2},
 {id:'reserve',name:'Reservmotor',description:'Mildrar tappad raket och motorhosta.',icon:'⚙',base:95,max:10,requires:'engine',required:3},
 {id:'cargo',name:'Lastkontroll',description:'Mildrar extra vikt och fripassagerare.',icon:'▣',base:85,max:10,requires:'chassis',required:2},
 {id:'lock',name:'Verkstadslås',description:'5 % chans per nivå att stoppa inkommande bus vid start.',icon:'⌂',base:100,max:10},
 {id:'return',name:'Returpaket',description:'10 % chans per nivå att återvinna ett använt bus.',icon:'↶',base:120,max:5,requires:'reserve',required:2},
] as const;
export type UpgradeId=typeof upgrades[number]['id'];
export const boosters=[
 {id:'fuel',name:'Extra bränsle',description:'+40 % bränsle under en runda.',price:24,icon:'◒'},
 {id:'turbo',name:'Turbo',description:'+20 % motorkraft under en runda.',price:36,icon:'↗'},
 {id:'lift',name:'Termikvingar',description:'+20 % lyft under en runda.',price:30,icon:'⌁'},
 {id:'nitro',name:'Raketskjuts',description:'+2 sekunder i boostreserven.',price:42,icon:'✦'},
 {id:'light',name:'Lätt last',description:'15 % lättare farkost under en runda.',price:32,icon:'◇'},
] as const;
export type BoosterId=typeof boosters[number]['id'];
export const sabotages=[
 {id:'reverse',name:'Omvända spakar',description:'Inverterad styrning i 10 sekunder.',rarity:'Ovanlig',weight:20},
 {id:'rocket',name:'Tappad raket',description:'Boostkraften minskar med 50 %.',rarity:'Sällsynt',weight:5},
 {id:'weight',name:'Bly i lasten',description:'20 % extra vikt under hela rundan.',rarity:'Ovanlig',weight:15},
 {id:'leak',name:'Läckande tank',description:'15 % högre bränsleförbrukning.',rarity:'Ovanlig',weight:15},
 {id:'horse',name:'Dalahäst som fripassagerare',description:'En häst på vingen ger 35 % mer luftmotstånd.',rarity:'Sällsynt',weight:8},
 {id:'compass',name:'Trasig kompass',description:'Höjd- och fartmätarna visar fel i 20 sekunder.',rarity:'Ovanlig',weight:12},
 {id:'magnet',name:'Magnetisk otur',description:'En pulserande kraft drar farkosten bakåt.',rarity:'Sällsynt',weight:7},
 {id:'cough',name:'Motorhosta',description:'Motorn tappar kraft en sekund av fyra.',rarity:'Sällsynt',weight:7},
 {id:'fika',name:'Fikapaus!',description:'En kanelbulle skymmer utsikten i 7 sekunder.',rarity:'Ovanlig',weight:12},
 {id:'wind',name:'Motvind från Mora',description:'Ihållande motvind bromsar färden.',rarity:'Sällsynt',weight:7},
 {id:'parachute',name:'För tidig fallskärm',description:'En bromsfallskärm fälls ut efter 3 sekunder.',rarity:'Episk',weight:3},
 {id:'krylbo',name:'Krylbo-specialen',description:'Ett slumpmässigt bus avslöjas först vid start.',rarity:'Episk',weight:3},
] as const;
export type SabotageId=typeof sabotages[number]['id'];
export type Mode='solo'|'friends'|'practice';
export interface Pending {id:SabotageId;senderId:string;senderName:string;anonymous:boolean;expires:number}
export interface Save {adminSeq?:number;gear?:Gear;achievements?:string[];launchpad?:Launchpad;version:2;coins:number;best:number;busBest:number;runs:number;levels:Record<UpgradeId,number>;inventory:Record<BoosterId,number>;bus:Record<SabotageId,number>;tickets:number;crates:number;pending:Pending|null;received:number[];history:string[]}
export const fresh=():Save=>({version:2,achievements:[],launchpad:blankLaunchpad(),coins:0,best:0,busBest:0,runs:0,levels:Object.fromEntries(upgrades.map(u=>[u.id,0])) as Record<UpgradeId,number>,inventory:{fuel:1,turbo:1,lift:1,nitro:0,light:0},bus:Object.fromEntries(sabotages.map(s=>[s.id,0])) as Record<SabotageId,number>,tickets:1,crates:1,pending:null,received:[],history:[]});
export function migrate(raw:unknown):Save {const s=fresh(),p=raw as Partial<Save>;if(!p||![1,2].includes(p.version as number))return s;
 for(const key of ['coins','best','busBest','runs','tickets','crates','adminSeq'] as const)if(Number.isSafeInteger(p[key])&&p[key]!>=0)s[key]=Math.min(Number.MAX_SAFE_INTEGER,p[key]!);
 for(const u of upgrades)if(Number.isFinite(p.levels?.[u.id]))s.levels[u.id]=Math.max(0,Math.min(u.max,p.levels![u.id]));
 for(const b of boosters){const n=p.inventory?.[b.id];if(Number.isSafeInteger(n)&&n!>=0)s.inventory[b.id]=Math.min(999,n!);}
 for(const b of sabotages){const n=p.bus?.[b.id];if(Number.isSafeInteger(n)&&n!>=0)s.bus[b.id]=Math.min(999,n!);}
 if(p.pending&&sabotages.some(b=>b.id===p.pending!.id)&&typeof p.pending.senderId==='string'&&typeof p.pending.senderName==='string'&&Number.isFinite(p.pending.expires))s.pending={...p.pending,senderName:p.pending.senderName.slice(0,24),anonymous:!!p.pending.anonymous};
 if(Array.isArray(p.received))s.received=p.received.filter(n=>Number.isFinite(n)).slice(-2);if(Array.isArray(p.history))s.history=p.history.filter(x=>typeof x==='string').map(x=>x.slice(0,200)).slice(-12);if(p.gear&&Array.isArray(p.gear.items)){s.gear=structuredClone(p.gear);s.gear.items=s.gear.items.filter(x=>catalog.some(c=>c.id===x.product)&&Number.isInteger(x.condition)&&x.condition>=0&&x.condition<7&&Number.isInteger(x.level)&&x.level>=0&&x.level<=10);for(const item of s.gear.items){item.condition=4;item.mod='standard';}syncGear(s);}s.achievements=Array.isArray(p.achievements)?p.achievements.filter(id=>achievements.some(a=>a.id===id)):[];if(p.launchpad)for(const key of ['height','length','assist'] as const)s.launchpad![key]=Math.max(0,Math.min(10,Math.floor(Number(p.launchpad[key])||0)));return s;}
export const cost=(level:number,id:UpgradeId='engine')=>Math.floor(upgrades.find(u=>u.id===id)!.base*1.48**level);
export function unlocked(s:Save,id:UpgradeId){const u=upgrades.find(u=>u.id===id)!;return !('requires' in u)||s.levels[u.requires]>=u.required;}
export function buy(s:Save,id:UpgradeId){const u=upgrades.find(u=>u.id===id)!,price=cost(s.levels[id],id);if(!unlocked(s,id)||s.coins<price||s.levels[id]>=u.max)return false;s.coins-=price;s.levels[id]++;return true;}
export function buyBooster(s:Save,id:BoosterId){const b=boosters.find(b=>b.id===id)!;if(s.coins<b.price||s.inventory[id]>=99)return false;s.coins-=b.price;s.inventory[id]++;return true;}
export function busCount(s:Save){return Object.values(s.bus).reduce((a,b)=>a+b,0);}
export function openCrate(s:Save,rng=Math.random){if(s.crates<1)return null;s.crates--;const b=boosters[Math.min(boosters.length-1,Math.floor(rng()*boosters.length))];s.inventory[b.id]=Math.min(999,s.inventory[b.id]+1);let found:SabotageId|null=null;if(rng()<.08&&busCount(s)<5){let roll=rng()*sabotages.reduce((a,b)=>a+b.weight,0);for(const item of sabotages){roll-=item.weight;if(roll<=0){found=item.id;s.bus[found]++;break;}}}return {booster:b.id,sabotage:found};}
export function sendBus(from:Save,to:Save,id:SabotageId,senderId:string,senderName:string,anonymous:boolean,now=Date.now()){
 if(to.pending&&to.pending.expires>now)return 'Piloten har redan ett väntande bus.';if(to.received.filter(n=>n>now-7*86400000).length>=2)return 'Piloten har redan fått två bus den senaste veckan.';
 if(from.bus[id]<1||from.tickets<1)return 'Du behöver ett busföremål och en busbiljett.';if(anonymous&&from.coins<50)return 'Anonymitet kostar 50 skrotmynt.';from.bus[id]--;from.tickets--;if(anonymous)from.coins-=50;to.pending={id,senderId,senderName,anonymous,expires:now+7*86400000};return null;}
export const GRAVITY=21.6;
export const MAX_FLIGHT_SECONDS=60;
export interface Flight {engineOn?:boolean;peakHeight?:number;peakSpeed?:number;x:number;y:number;vx:number;vy:number;angle:number;fuel:number;maxFuel:number;boost:number;maxBoost:number;time:number;mode:Mode;boosterIds:BoosterId[];sabotage:SabotageId|null;blocked:boolean;sender:Pending|null;settled:boolean;seed:number;stalled:boolean}
export interface Controls {left:boolean;right:boolean;thrust:boolean;boost:boolean}
export function launch(s:Save,chosen:BoosterId[]=[],mode:Mode='solo',sabotage:SabotageId|null=null):Flight {const r=researchEffects(s.gear?.research.done||[]),v=s.gear?vehicleEffect(s.gear):null,ramp=rampBonus(s.launchpad||blankLaunchpad());const fuel=(3+(v?v.reserve:s.levels.tank*1.5))*r.capacity*(chosen.includes('fuel')?1.4:1),boost=(v?v.boostTime:s.levels.rockets>0?2+s.levels.rockets*.2:0)+(chosen.includes('nitro')?2:0),finalBoost=boost*r.boostTime;return {x:0,y:2+ramp.height,vx:24+s.levels.ramp*2.5+ramp.speed,vy:12.3+s.levels.ramp*.65+ramp.vertical,angle:s.levels.wings>0?.12:.4,fuel,maxFuel:fuel,boost:finalBoost,maxBoost:finalBoost,time:0,mode,boosterIds:[...chosen],sabotage,blocked:false,sender:null,settled:false,seed:1,stalled:false};}
export function practiceVehicle(s:Save):Save{const gear=structuredClone(s.gear||blankGear());for(const slot of ['engine','wings','rockets'] as const)if(!mounted(gear,slot)){const item=makePart(catalog.find(p=>p.id===slot+'-1')!,'legacy');gear.items.push(item);gear.mounted[slot]=item.id;}return {...s,gear,levels:{...s.levels,wings:Math.max(1,s.levels.wings),engine:Math.max(1,s.levels.engine),rockets:Math.max(1,s.levels.rockets)}};}
export function lockRun(s:Save,chosen:BoosterId[],mode:Mode,practiceBus:SabotageId|null=null,rng=Math.random,now=Date.now()):Flight|null {
 const ids=[...new Set(chosen)];if(ids.length>3||ids.some(id=>!boosters.some(b=>b.id===id)||(mode!=='practice'&&s.inventory[id]<1)))return null;let pending:Pending|null=null;
 if(mode==='friends'&&s.pending){if(s.pending.expires>now&&s.received.filter(n=>n>now-7*86400000).length<2)pending=s.pending;s.pending=null;}
 if(mode!=='practice')for(const id of ids)s.inventory[id]--;const f=launch(s,ids,mode,mode==='practice'?practiceBus:pending?.id||null);f.engineOn=s.levels.engine>0;f.sender=pending;f.seed=Math.floor(rng()*1e8);
 if(pending){s.received=s.received.filter(n=>n>now-7*86400000);s.received.push(now);if(rng()<s.levels.lock*.05){f.blocked=true;f.sabotage=null;}}
 if(f.sabotage==='krylbo')f.sabotage=sabotages[Math.min(10,Math.floor(rng()*11))].id;return f;}
export function modifiers(f:Flight,s:Save){const r=researchEffects(s.gear?.research.done||[]),v=s.gear?vehicleEffect(s.gear):null,b=f.sabotage,def=s.levels.cargo*.08,reserve=s.levels.reserve*.07;return {mass:r.mass*(v?v.mass/100:1-s.levels.chassis*.02)*(f.boosterIds.includes('light')?.85:1)*(b==='weight'?1+.2*(1-def):1),drag:r.drag*(b==='horse'?1+.35*(1-def):1)*(b==='parachute'&&f.time>3?2.8:1),motor:r.motor*(v?v.driveFactor:1)*(f.boosterIds.includes('turbo')?1.2:1)*(b==='cough'&&f.time%4<1?.25+reserve*.75:1),boost:r.boost*(b==='rocket'?.5+reserve*.5:1),consumption:r.fuel*(v?v.fuel:1-s.levels.efficiency*.025)*(b==='leak'?1.15:1),lift:r.lift*(f.boosterIds.includes('lift')?1.2:1),turn:r.turn,inverted:b==='reverse'&&f.time<10*(1-s.levels.steering*.06)*r.reverse,wind:b==='wind'?4:b==='magnet'?2+Math.sin(f.time*3+f.seed)*2:0};}
export function aerodynamics(f:Flight,s:Save,powered=(f.engineOn??false)&&f.fuel>0){
 const speed=Math.max(.01,Math.hypot(f.vx,f.vy)),path=Math.atan2(f.vy,f.vx),aoa=Math.atan2(Math.sin(f.angle-path),Math.cos(f.angle-path)),v=s.gear?vehicleEffect(s.gear):null,area=v?v.area:s.levels.wings>0?.052+s.levels.wings*.003:.0005,m=modifiers(f,s),density=Math.max(.1,Math.exp(-Math.max(0,f.y)/6000));
 const stallLimit=.36+researchEffects(s.gear?.research.done||[]).stallMargin,stallSpeed=Math.max(!powered&&s.levels.engine>0?24:0,Math.sqrt(GRAVITY*m.mass/Math.max(.001,area*1.4*m.lift*density))*.9),stalled=s.levels.wings>0&&(Math.abs(aoa)>stallLimit||speed<stallSpeed),cl=wingLiftCoefficient(aoa,stalled);
 const rawLift=area*speed*speed*cl*m.lift*density/m.mass*(stalled&&!powered?.2:1),lift=Math.max(-GRAVITY*6,Math.min(GRAVITY*6,rawLift));
 // A stalled airframe loses lift; it must not become a parachute. Gliding still spends height.
 const cd=.045+.12*cl*cl+(stalled?.12*Math.sin(aoa)**2:0),body=.0023*(v?v.dragFactor:1)+(!powered&&s.levels.wings>0?(s.levels.engine>0?.014:.001)*Math.cos(path)**4:0),wing=area*cd*(v?v.profileDrag:1),drag=(body+wing)*speed*speed*m.drag*density/m.mass+(!powered&&s.levels.engine>0?Math.abs(lift)*.55:0);
 const sideSpeed=-Math.sin(f.angle)*f.vx+Math.cos(f.angle)*f.vy,crossflow=(.004+(s.levels.wings>0?.004:0))*Math.abs(sideSpeed)*density/m.mass*(!powered&&stalled?.06:1);
 return {speed,path,aoa,stalled,stallSpeed,lift,drag,crossflow,sideSpeed};
}
export function step(f:Flight,c:Controls,s:Save,dt:number){
 f.time+=dt;const m=modifiers(f,s);f.angle=Math.max(-1.52,Math.min(1.52,f.angle+(Number(c.right)-Number(c.left))*(m.inverted?-1:1)*(s.gear?vehicleEffect(s.gear).turn:1.8+s.levels.steering*.05)*m.turn*dt));
 const motor=(f.engineOn??c.thrust)&&f.fuel>0&&s.levels.engine>0,boost=c.boost&&f.boost>0;if(motor)f.fuel=Math.max(0,f.fuel-dt*m.consumption);if(boost)f.boost=Math.max(0,f.boost-dt);
 const v=s.gear?vehicleEffect(s.gear):null,motorForce=motor?(v?v.thrust/100:12+s.levels.engine*1.8)*m.motor:0,boostForce=boost?(v&&v.boostForce>0?v.boostForce/100:20+s.levels.rockets*1.5)*m.boost:0,thrust=(motorForce+(v?.balloon?0:boostForce))/m.mass;
 f.vx+=Math.cos(f.angle)*thrust*dt-m.wind*dt;f.vy+=(Math.sin(f.angle)*thrust+(v?.balloon?boostForce/m.mass:0)-GRAVITY)*dt;
 const a=aerodynamics(f,s,motor||boost);f.stalled=a.stalled;const rotation=a.lift/a.speed*dt,cs=Math.cos(rotation),sn=Math.sin(rotation),vx=f.vx,vy=f.vy;
 // Lift rotates momentum without adding energy. Drag and sideways airflow only remove it.
 f.vx=(vx*cs-vy*sn);f.vy=(vx*sn+vy*cs);
 const damping=Math.exp(-a.drag/a.speed*dt);f.vx*=damping;f.vy*=!motor&&!boost&&a.stalled&&f.vy<0?Math.exp(-Math.min(a.drag/a.speed,.0025*Math.abs(f.vy))*dt):damping;
 const along=Math.cos(f.angle)*f.vx+Math.sin(f.angle)*f.vy,side=(-Math.sin(f.angle)*f.vx+Math.cos(f.angle)*f.vy)*Math.exp(-a.crossflow*dt);
 f.vx=Math.max(0,Math.cos(f.angle)*along-Math.sin(f.angle)*side);f.vy=Math.sin(f.angle)*along+Math.cos(f.angle)*side;
 f.x+=f.vx*dt;f.y+=f.vy*dt;f.peakHeight=Math.max(f.peakHeight||0,f.y);f.peakSpeed=Math.max(f.peakSpeed||0,Math.hypot(f.vx,f.vy));
}
export function settle(s:Save,f:Flight,rng=Math.random){if(f.settled)return {soft:false,reward:0,crate:false,recovered:false,achievementReward:0};f.settled=true;const soft=f.y<=0&&Math.abs(f.vy)<10&&Math.abs(f.angle)<.4,reward=f.mode==='practice'?0:flightPay(f.x,f.mode==='solo'?s.best:s.busBest,soft);let crate=false,recovered=false,achievementReward=0;if(f.mode!=='practice'){if(s.gear)advanceResearch(s.gear,Math.floor(f.x));const unlocked=awardAchievements(f.x,s.achievements||[]);s.achievements=unlocked.claimed;achievementReward=unlocked.reward;s.coins=Math.min(Number.MAX_SAFE_INTEGER,s.coins+reward+unlocked.reward);if(unlocked.earned.length)s.history.push('Prestation: '+unlocked.earned.map(a=>a.name).join(', ')+' · +'+unlocked.reward+' skrot');s.runs++;if(f.mode==='solo')s.best=Math.max(s.best,Math.floor(f.x));else s.busBest=Math.max(s.busBest,Math.floor(f.x));if(s.runs%5===0){s.crates++;crate=true;}if(s.runs%10===0)s.tickets=Math.min(3,s.tickets+1);if(f.sender&&s.levels.return>0&&busCount(s)<5&&rng()<s.levels.return*.1){s.bus[f.sender.id]++;recovered=true;}s.history.push(`${Math.floor(f.x)} m · +${reward} skrot · ${f.sabotage?sabotages.find(b=>b.id===f.sabotage)!.name:f.blocked?'Bus stoppat':'Ingen störning'}`);s.history=s.history.slice(-12);}return {soft,reward,crate,recovered,achievementReward};}











