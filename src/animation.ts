export type AnimationPhase='ready'|'countdown'|'flying';
export interface AnimationInput {phase:AnimationPhase;time:number;speed:number;throttle:boolean;boost:boolean;landedAgo:number;reduced:boolean}
export function flightAnimation(i:AnimationInput){
 const powered=i.throttle||i.boost,airborne=i.phase==='flying',impact=i.landedAgo>=0&&i.landedAgo<1?Math.sin(i.landedAgo*22)*Math.exp(-i.landedAgo*6):0;
 return {propellerRate:powered?42:airborne?7:0,pilotBob:i.reduced?0:Math.sin(i.time*2.8)*.8+impact*5,bodyBob:i.reduced?0:impact*4+(i.phase==='ready'?Math.sin(i.time*1.8)*.5:0),pilotAngle:i.reduced?0:Math.sin(i.time*1.7)*.015+impact*.03,wingFlex:i.reduced?1:1+Math.sin(i.time*(powered?15:3))*(powered?.006:.002),scarfAmplitude:i.reduced?0:Math.min(8,2+i.speed*.09),wheelRate:airborne?i.speed*.12:i.phase==='countdown'?4:0,wheelSquash:1-Math.abs(impact)*.14,flameScale:i.boost?1.7:1};
}
