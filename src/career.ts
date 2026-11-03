export const achievements=[{id:'first-flight',name:'Första försöket',meters:1,reward:5},{id:'verket',name:'Förbi Verket',meters:300,reward:20},{id:'horse',name:'Förbi Dalahästen',meters:1500,reward:40},{id:'hedemora',name:'Hej Hedemora!',meters:3000,reward:800},{id:'sater',name:'Nästa stopp: Säter',meters:5000,reward:1500},{id:'borlange',name:'Borlänge i sikte',meters:7500,reward:3000},{id:'falun',name:'Hela vägen till Falun',meters:10000,reward:5000}] as const;
export function awardAchievements(distance:number,claimed:string[]){const earned=achievements.filter(a=>distance>=a.meters&&!claimed.includes(a.id));return {earned,reward:earned.reduce((sum,a)=>sum+a.reward,0),claimed:[...new Set([...claimed,...earned.map(a=>a.id)])]};}
export interface Launchpad{height:number;length:number;assist:number}
export const blankLaunchpad=():Launchpad=>({height:0,length:0,assist:0});
export const rampNames={height:'Ramphöjd',length:'Ramplängd',assist:'Starthjälp'} as const;
export function rampCost(ramp:Launchpad,key:keyof Launchpad){return Math.round(({height:35,length:30,assist:90}[key])*(ramp[key]+1)**1.65);}
export function assistName(level:number){return level===0?'Ingen starthjälp':level<4?'Gummiband':level<7?'Stålvajer':level<10?'Hydraulisk katapult':'Elektromagnetisk katapult';}
export function rampBonus(ramp:Launchpad){return {height:ramp.height*.8,speed:ramp.length*.8+ramp.assist*1.8,vertical:ramp.height*.65+ramp.length*.12+ramp.assist*.2};}
export function buyRamp(s:{coins:number;launchpad?:Launchpad},key:keyof Launchpad){const ramp=s.launchpad??(s.launchpad=blankLaunchpad()),price=rampCost(ramp,key);if(ramp[key]>=10||s.coins<price||key==='assist'&&(ramp.height<3||ramp.length<3))return false;s.coins-=price;ramp[key]++;return true;}
