import {product,type Part} from './equipment.ts';
export function instrumentLevel(p:Part|undefined){return p?Math.min(15,product(p).tier+Math.floor(p.level/2)):0;}
export function instrumentDescription(level:number){return level===0?'Inga instrument':`${level>=7?'Digital flygdator':'Analog panel'} · fart och höjd${level>=2?' · stig/sjunk':''}${level>=3?' · nosvinkel':''}${level>=4?' · anfallsvinkel och stall':''}${level>=5?' · vind':''}${level>=6?' · luftmotstånd':''}${level>=8?' · flygtid':''}${level>=9?' · energi':''}${level>=10?' · glidtal':''}`;}
