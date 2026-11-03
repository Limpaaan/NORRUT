export const ENGINE_PRICES=[100,750,2200,4500,8000,13000,20000,30000,44000,63000,90000,125000,170000,230000,310000] as const;
export const PRICE_FACTORS={engine:1,wings:.8,tank:.6,rockets:.1,chassis:.9,tail:.7,nose:.65,instruments:.35} as const;
export function productPrice(slot:keyof typeof PRICE_FACTORS,tier:number){return Math.max(5,Math.round(ENGINE_PRICES[Math.max(0,Math.min(14,tier-1))]*PRICE_FACTORS[slot]));}
export function workshopStepCost(price:number,nextPrice:number|undefined,level:number){const budget=Math.min(price*5.5,nextPrice?Math.max(55,(nextPrice-price)*.9):price*1.2);return Math.max(1,Math.floor(budget*(level+1)/55));}
export function flightPay(distance:number,previousBest:number,soft:boolean){const d=Math.max(0,Math.min(500000,distance)),improvement=Math.max(0,d-previousBest);return Math.min(80000,10+Math.floor(1.6*Math.sqrt(d)+10*(d/1000)**1.55)+(soft?10:0)+Math.min(20,Math.floor(Math.sqrt(improvement))));}
export function scrapSearchCost(highestMountedTier:number){return Math.max(5,Math.round(5+productPrice('engine',Math.max(1,highestMountedTier))*.018));}
export type ScrapOutcome='nothing'|'money'|'part'|'better';
export const SCRAP_ODDS={nothing:.35,money:.35,part:.2,better:.1} as const;
export function scrapOutcome(roll:number):ScrapOutcome{return roll<.35?'nothing':roll<.7?'money':roll<.9?'part':'better';}
