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
 {id:'fuel',name:'Extra bränsle',description:'+30 % bränsle under en runda.',price:24,icon:'◒'},
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
export interface Save {version:2;coins:number;best:number;busBest:number;runs:number;levels:Record<UpgradeId,number>;inventory:Record<BoosterId,number>;bus:Record<SabotageId,number>;tickets:number;crates:number;pending:Pending|null;received:number[];history:string[]}
export const fresh=():Save=>({version:2,coins:0,best:0,busBest:0,runs:0,levels:Object.fromEntries(upgrades.map(u=>[u.id,0])) as Record<UpgradeId,number>,inventory:{fuel:1,turbo:1,lift:1,nitro:0,light:0},bus:Object.fromEntries(sabotages.map(s=>[s.id,0])) as Record<SabotageId,number>,tickets:1,crates:1,pending:null,received:[],history:[]});
export function migrate(raw:unknown):Save {const s=fresh(),p=raw as Partial<Save>;if(!p||![1,2].includes(p.version as number))return s;
 for(const key of ['coins','best','busBest','runs','tickets','crates'] as const)if(Number.isSafeInteger(p[key])&&p[key]!>=0)s[key]=Math.min(1e12,p[key]!);
 for(const u of upgrades)if(Number.isInteger(p.levels?.[u.id]))s.levels[u.id]=Math.max(0,Math.min(u.max,p.levels![u.id]));
 for(const b of boosters){const n=p.inventory?.[b.id];if(Number.isSafeInteger(n)&&n!>=0)s.inventory[b.id]=Math.min(999,n!);}
 for(const b of sabotages){const n=p.bus?.[b.id];if(Number.isSafeInteger(n)&&n!>=0)s.bus[b.id]=Math.min(999,n!);}
 if(p.pending&&sabotages.some(b=>b.id===p.pending!.id)&&typeof p.pending.senderId==='string'&&typeof p.pending.senderName==='string'&&Number.isFinite(p.pending.expires))s.pending={...p.pending,senderName:p.pending.senderName.slice(0,24),anonymous:!!p.pending.anonymous};
 if(Array.isArray(p.received))s.received=p.received.filter(n=>Number.isFinite(n)).slice(-2);if(Array.isArray(p.history))s.history=p.history.filter(x=>typeof x==='string').map(x=>x.slice(0,200)).slice(-12);return s;}
export const cost=(level:number,id:UpgradeId='engine')=>Math.floor(upgrades.find(u=>u.id===id)!.base*1.48**level);
export function unlocked(s:Save,id:UpgradeId){const u=upgrades.find(u=>u.id===id)!;return !('requires' in u)||s.levels[u.requires]>=u.required;}
export function buy(s:Save,id:UpgradeId){const u=upgrades.find(u=>u.id===id)!,price=cost(s.levels[id],id);if(!unlocked(s,id)||s.coins<price||s.levels[id]>=u.max)return false;s.coins-=price;s.levels[id]++;return true;}
export function buyBooster(s:Save,id:BoosterId){const b=boosters.find(b=>b.id===id)!;if(s.coins<b.price||s.inventory[id]>=99)return false;s.coins-=b.price;s.inventory[id]++;return true;}
export function busCount(s:Save){return Object.values(s.bus).reduce((a,b)=>a+b,0);}
export function openCrate(s:Save,rng=Math.random){if(s.crates<1)return null;s.crates--;const b=boosters[Math.min(boosters.length-1,Math.floor(rng()*boosters.length))];s.inventory[b.id]=Math.min(999,s.inventory[b.id]+1);let found:SabotageId|null=null;if(rng()<.08&&busCount(s)<5){let roll=rng()*sabotages.reduce((a,b)=>a+b.weight,0);for(const item of sabotages){roll-=item.weight;if(roll<=0){found=item.id;s.bus[found]++;break;}}}return {booster:b.id,sabotage:found};}
export function sendBus(from:Save,to:Save,id:SabotageId,senderId:string,senderName:string,anonymous:boolean,now=Date.now()){
 if(to.pending&&to.pending.expires>now)return 'Piloten har redan ett väntande bus.';if(to.received.filter(n=>n>now-7*86400000).length>=2)return 'Piloten har redan fått två bus den senaste veckan.';
 if(from.bus[id]<1||from.tickets<1)return 'Du behöver ett busföremål och en busbiljett.';if(anonymous&&from.coins<50)return 'Anonymitet kostar 50 skrotmynt.';from.bus[id]--;from.tickets--;if(anonymous)from.coins-=50;to.pending={id,senderId,senderName,anonymous,expires:now+7*86400000};return null;}
export interface Flight {x:number;y:number;vx:number;vy:number;angle:number;fuel:number;maxFuel:number;boost:number;maxBoost:number;time:number;mode:Mode;boosterIds:BoosterId[];sabotage:SabotageId|null;blocked:boolean;sender:Pending|null;settled:boolean;seed:number;stalled:boolean}
export interface Controls {left:boolean;right:boolean;thrust:boolean;boost:boolean}
export function launch(s:Save,chosen:BoosterId[]=[],mode:Mode='solo',sabotage:SabotageId|null=null):Flight {const fuel=(3+s.levels.tank*1.5)*(chosen.includes('fuel')?1.3:1),boost=(s.levels.rockets>0?2+s.levels.rockets*.2:0)+(chosen.includes('nitro')?2:0);return {x:0,y:2,vx:19+s.levels.ramp*2,vy:10+s.levels.ramp*.5,angle:s.levels.wings>0?.12:.4,fuel,maxFuel:fuel,boost,maxBoost:boost,time:0,mode,boosterIds:[...chosen],sabotage,blocked:false,sender:null,settled:false,seed:1,stalled:false};}
export function practiceVehicle(s:Save):Save{return {...s,levels:{...s.levels,wings:Math.max(1,s.levels.wings),engine:Math.max(1,s.levels.engine),rockets:Math.max(1,s.levels.rockets)}};}
export function lockRun(s:Save,chosen:BoosterId[],mode:Mode,practiceBus:SabotageId|null=null,rng=Math.random,now=Date.now()):Flight|null {
 const ids=[...new Set(chosen)];if(ids.length>3||ids.some(id=>!boosters.some(b=>b.id===id)||(mode!=='practice'&&s.inventory[id]<1)))return null;let pending:Pending|null=null;
 if(mode==='friends'&&s.pending){if(s.pending.expires>now&&s.received.filter(n=>n>now-7*86400000).length<2)pending=s.pending;s.pending=null;}
 if(mode!=='practice')for(const id of ids)s.inventory[id]--;const f=launch(s,ids,mode,mode==='practice'?practiceBus:pending?.id||null);f.sender=pending;f.seed=Math.floor(rng()*1e8);
 if(pending){s.received=s.received.filter(n=>n>now-7*86400000);s.received.push(now);if(rng()<s.levels.lock*.05){f.blocked=true;f.sabotage=null;}}
 if(f.sabotage==='krylbo')f.sabotage=sabotages[Math.min(10,Math.floor(rng()*11))].id;return f;}
export function modifiers(f:Flight,s:Save){const b=f.sabotage,def=s.levels.cargo*.08,reserve=s.levels.reserve*.07;return {mass:(1-s.levels.chassis*.02)*(f.boosterIds.includes('light')?.85:1)*(b==='weight'?1+.2*(1-def):1),drag:(b==='horse'?1+.35*(1-def):1)*(b==='parachute'&&f.time>3?2.8:1),motor:(f.boosterIds.includes('turbo')?1.2:1)*(b==='cough'&&f.time%4<1?.25+reserve*.75:1),boost:b==='rocket'?.5+reserve*.5:1,consumption:(1-s.levels.efficiency*.025)*(b==='leak'?1.15:1),lift:f.boosterIds.includes('lift')?1.2:1,inverted:b==='reverse'&&f.time<10*(1-s.levels.steering*.06),wind:b==='wind'?4:b==='magnet'?2+Math.sin(f.time*3+f.seed)*2:0};}
export function aerodynamics(f:Flight,s:Save){
 const speed=Math.max(.01,Math.hypot(f.vx,f.vy)),path=Math.atan2(f.vy,f.vx),aoa=Math.atan2(Math.sin(f.angle-path),Math.cos(f.angle-path));
 const stalled=s.levels.wings>0&&(Math.abs(aoa)>.32||speed<8);
 const cl=Math.max(-1,Math.min(1.45,.22+4.8*aoa))*(stalled?Math.max(.12,1-(Math.abs(aoa)-.32)*2.5):1);
 const area=s.levels.wings>0?.052+s.levels.wings*.004:.0005;
 const m=modifiers(f,s),lift=area*speed*speed*cl*m.lift/m.mass;
 const cd=.028+.065*cl*cl+(stalled?Math.max(0,Math.abs(aoa)-.32)*.65:0);
 const drag=(.0028/(1+s.levels.wings*.03)+area*cd)*speed*speed*m.drag/m.mass;
 return {speed,path,aoa,stalled,lift,drag};
}
export function step(f:Flight,c:Controls,s:Save,dt:number){
 f.time+=dt;const m=modifiers(f,s);f.angle=Math.max(-.65,Math.min(1.35,f.angle+(Number(c.right)-Number(c.left))*(m.inverted?-1:1)*(1.3+s.levels.steering*.04)*dt));
 const motor=c.thrust&&f.fuel>0&&s.levels.engine>0,boost=c.boost&&f.boost>0;if(motor)f.fuel=Math.max(0,f.fuel-dt*m.consumption);if(boost)f.boost=Math.max(0,f.boost-dt);
 const thrust=((motor?(12+s.levels.engine*1.8)*m.motor:0)+(boost?(20+s.levels.rockets*1.5)*m.boost:0))/m.mass;
 const a=aerodynamics(f,s);f.stalled=a.stalled;const ux=f.vx/a.speed,uy=f.vy/a.speed;
 // Lift is perpendicular to motion, drag opposes it: changing pitch cannot add free energy.
 f.vx=Math.max(0,f.vx+(Math.cos(f.angle)*thrust-a.drag*ux-a.lift*uy-m.wind)*dt);
 f.vy+=(Math.sin(f.angle)*thrust-9.81-a.drag*uy+a.lift*ux)*dt;
 f.x+=f.vx*dt;f.y+=f.vy*dt;
}
export function settle(s:Save,f:Flight,rng=Math.random){if(f.settled)return {soft:false,reward:0,crate:false,recovered:false};f.settled=true;const soft=f.y<=0&&Math.abs(f.vy)<10&&Math.abs(f.angle)<.4,reward=f.mode==='practice'?0:15+Math.floor(f.x/8)+(soft?20:0);let crate=false,recovered=false;if(f.mode!=='practice'){s.coins+=reward;s.runs++;if(f.mode==='solo')s.best=Math.max(s.best,Math.floor(f.x));else s.busBest=Math.max(s.busBest,Math.floor(f.x));if(s.runs%5===0){s.crates++;crate=true;}if(s.runs%10===0)s.tickets=Math.min(3,s.tickets+1);if(f.sender&&s.levels.return>0&&busCount(s)<5&&rng()<s.levels.return*.1){s.bus[f.sender.id]++;recovered=true;}s.history.push(`${Math.floor(f.x)} m · +${reward} skrot · ${f.sabotage?sabotages.find(b=>b.id===f.sabotage)!.name:f.blocked?'Bus stoppat':'Ingen störning'}`);s.history=s.history.slice(-12);}return {soft,reward,crate,recovered};}
