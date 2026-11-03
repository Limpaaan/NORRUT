import {catalog,product,slots,makePart,highestAcquiredTier,type Gear,type Slot} from './equipment.ts';
export const IVANE_PRICE=50000;
export const purchasedFinal=(g:Gear,slot:Slot)=>(g.shopSteps?.[slot]||0)>=15||g.items.some(p=>product(p)?.slot===slot&&product(p).tier===15&&p.source!=='find');
export const missingIvaneParts=(g:Gear)=>slots.filter(slot=>!purchasedFinal(g,slot));
export const ivaneActive=(g:Gear|undefined)=>!!g?.cosmetics?.ivane&&g.cosmetics.active==='ivane';
export function buyIvane(s:{coins:number;gear?:Gear}){const g=s.gear;if(!g||g.cosmetics?.ivane||missingIvaneParts(g).length||s.coins<IVANE_PRICE)return false;s.coins-=IVANE_PRICE;g.cosmetics={ivane:true,active:'ivane'};return true;}
export function equipIvane(g:Gear,active:boolean){if(!g.cosmetics?.ivane)return false;g.cosmetics.active=active?'ivane':null;return true;}
export function buyFoundFinal(s:{coins:number;gear?:Gear},slot:Slot){const g=s.gear,p=catalog.find(p=>p.slot===slot&&p.tier===15)!;if(!g||purchasedFinal(g,slot)||highestAcquiredTier(g,slot)<15||s.coins<p.price)return false;const item=makePart(p);s.coins-=p.price;g.items.push(item);g.mounted[slot]=item.id;(g.shopSteps||(g.shopSteps={}))[slot]=15;return true;}
