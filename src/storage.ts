import {fresh,migrate,type Save} from './model.ts';
export interface SaveRepository {load():Save;save(s:Save):boolean}
export class LocalSaveRepository implements SaveRepository {
 private key:string;
 constructor(key='norrut.save.v1'){this.key=key;}
 load():Save {try{return migrate(JSON.parse(localStorage.getItem(this.key)||'null'));}catch{return fresh();}}
 save(s:Save) {try{localStorage.setItem(this.key,JSON.stringify(s));return true;}catch{return false;}}
}
export interface Pilot {id:string;name:string}
export function pilots():Pilot[]{try{const stored=JSON.parse(localStorage.getItem('norrut.pilots')||'[]');if(Array.isArray(stored))return [{id:'default',name:'Min pilot'},...stored.filter(p=>p&&typeof p.id==='string'&&/^pilot-[0-9a-f-]+$/.test(p.id)&&typeof p.name==='string').slice(0,7)];}catch{}return [{id:'default',name:'Min pilot'}];}
export function addPilot(name:string):Pilot|null {const list=pilots();name=name.trim().slice(0,24);if(!name||list.length>=8||list.some(p=>p.name.toLocaleLowerCase()===name.toLocaleLowerCase()))return null;const p={id:'pilot-'+crypto.randomUUID(),name};list.push(p);try{localStorage.setItem('norrut.pilots',JSON.stringify(list.filter(x=>x.id!=='default')));return p;}catch{return null;}}
export const pilotKey=(id:string)=>id==='default'?'norrut.save.v1':`norrut.local.${id}`;
