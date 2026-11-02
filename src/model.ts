export type UpgradeId = 'engine' | 'tank' | 'wings';
export interface Save { version: 1; coins: number; best: number; runs: number; levels: Record<UpgradeId, number> }
export const fresh = (): Save => ({version:1,coins:0,best:0,runs:0,levels:{engine:0,tank:0,wings:0}});
export const upgrades: {id:UpgradeId;name:string;description:string;icon:string}[] = [
 {id:'engine',name:'Motor',description:'Mer dragkraft. Lite mindre skrothög.',icon:'↗'},
 {id:'tank',name:'Bränsletank',description:'Mer bränsle till nästa horisont.',icon:'◒'},
 {id:'wings',name:'Vingar',description:'Bättre lyft och lägre luftmotstånd.',icon:'⌁'}];
export const cost = (level:number) => Math.floor(40 * 1.65 ** level);
export function buy(s:Save,id:UpgradeId):boolean { const price=cost(s.levels[id]); if(s.coins<price||s.levels[id]>=20)return false; s.coins-=price;s.levels[id]++;return true; }
export interface Flight {x:number;y:number;vx:number;vy:number;angle:number;fuel:number;boost:number;time:number}
export interface Controls {left:boolean;right:boolean;thrust:boolean;boost:boolean}
export function launch(s:Save):Flight {return {x:0,y:3,vx:23,vy:22,angle:0.58,fuel:12+s.levels.tank*2.5,boost:3,time:0};}
export function step(f:Flight,c:Controls,s:Save,dt:number) {
 f.time+=dt; f.angle=Math.max(-0.65,Math.min(1.35,f.angle+(Number(c.right)-Number(c.left))*1.3*dt));
 const motor=c.thrust&&f.fuel>0; const boost=c.boost&&f.boost>0;
 if(motor) f.fuel=Math.max(0,f.fuel-dt); if(boost)f.boost=Math.max(0,f.boost-dt);
 const thrust=(motor?14+s.levels.engine*2.4:0)+(boost?25:0);
 const drag=0.011/(1+s.levels.wings*0.09);
 f.vx+=(Math.cos(f.angle)*thrust-drag*f.vx*Math.abs(f.vx))*dt;
 f.vy+=(Math.sin(f.angle)*thrust-9.81+Math.min(7,f.vx*f.vx*0.003*(1+s.levels.wings*0.1))-0.07*f.vy)*dt;
 f.x+=Math.max(0,f.vx)*dt; f.y+=f.vy*dt;
}
export function settle(s:Save,f:Flight) { const soft=Math.abs(f.vy)<10&&Math.abs(f.angle)<0.4;const reward=15+Math.floor(f.x/8)+(soft?20:0);s.coins+=reward;s.best=Math.max(s.best,Math.floor(f.x));s.runs++;return {soft,reward}; }
