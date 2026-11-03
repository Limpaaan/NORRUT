import {partFrameData} from './part-frame-data.ts';
import {slots,mounted,product,blankGear,catalog,makePart,type Slot,type Gear,type Part,type Product} from './equipment.ts';
export const PART_ATLASES=slots.map(slot=>({slot,key:`component-${slot}`,url:`art/components/${slot}.webp`}));
export const mounts:Record<Slot,{x:number;y:number;size:number;depth:number}>={
 chassis:{x:0,y:8,size:320,depth:30},wings:{x:0,y:-8,size:350,depth:10},
 engine:{x:-92,y:18,size:84,depth:38},tank:{x:-26,y:28,size:52,depth:39},
 rockets:{x:-67,y:72,size:100,depth:41},tail:{x:-142,y:18,size:100,depth:15},
 nose:{x:169,y:20,size:78,depth:42},instruments:{x:74,y:-10,size:48,depth:43}
};
export interface SpriteRect{x:number;y:number;w:number;h:number}
export interface PartVisual{width:number;height:number;rect:SpriteRect;slot:Slot;frame:number;key:string;url:string;x:number;y:number;size:number;depth:number;condition:number;level:number;mod:Part['mod'];name:string;fallback:boolean}
export function partFrame(p:Product){return {column:(p.tier-1)%4,row:Math.floor((p.tier-1)/4),frame:p.tier-1,key:`component-${p.slot}`,url:`art/components/${p.slot}.webp`};}
export function craftVisuals(gear:Gear|undefined):PartVisual[]{const g=gear||blankGear();const result:Omit<PartVisual,'width'|'height'|'rect'>[]=[];for(const slot of slots){const item=mounted(g,slot);if(!item){if(slot==='chassis')result.push({...mounts.chassis,slot,frame:15,key:'component-chassis',url:'art/components/chassis.webp',condition:4,level:0,mod:'standard',name:'Startchassi',fallback:true});else if(slot==='nose'&&mounted(g,'engine')){const et=product(mounted(g,'engine')!).tier;result.push({...mounts.nose,slot,frame:et>=9?8:0,key:'component-nose',url:'art/components/nose.webp',condition:4,level:0,mod:'standard',name:et>=9?'Enkel jetkon':'Grundpropeller',fallback:true});}continue;}const p=product(item);result.push({...mounts[slot],...partFrame(p),slot,size:mounts[slot].size*(1+item.level*.004),condition:item.condition,level:item.level,mod:item.mod,name:p.name,fallback:false});}return result.map(v=>{const rect=partFrameData[v.slot].frames[v.frame];let width=v.size,height=width*rect.h/rect.w,y=v.y,x=v.x;if(v.slot==='wings'||v.slot==='tail')y-=height/2;if(v.slot==='nose'&&v.frame>=8){width=102;height=width*rect.h/rect.w;}if(v.slot==='rockets'&&v.frame===0){width=85;height=width*rect.h/rect.w;x=-116;y=-140;}return {...v,width,height,x,y,rect};}).sort((a,b)=>a.depth-b.depth);}
export function previewGear(gear:Gear,candidate:Part){const copy=structuredClone(gear);if(!copy.items.some(p=>p.id===candidate.id))copy.items.push(structuredClone(candidate));copy.mounted[product(candidate).slot]=candidate.id;return copy;}
export function craftSignature(gear:Gear|undefined){return craftVisuals(gear).map(p=>`${p.slot}:${p.frame}:${p.condition}:${p.level}:${p.mod}`).join('|');}
export const conditionTints=[0x9d8b78,0xb2a28a,0xc7baa1,0xe0dac7,0xffffff,0xedffff,0xffe6ab];
export const conditionFilters=['sepia(.55) saturate(.65) brightness(.72)','sepia(.35) saturate(.8) brightness(.82)','sepia(.18) brightness(.9)','brightness(.97)','none','brightness(1.08) saturate(1.1)','brightness(1.13) saturate(1.1) drop-shadow(0 0 3px #f0ca68)'];

export function showcaseGear(stage:number){const gear=blankGear();for(const slot of slots){const item=makePart(catalog.find(p=>p.slot===slot&&p.tier===Math.max(1,Math.min(15,stage)))!,'legacy');gear.items.push(item);gear.mounted[slot]=item.id;}return gear;}
