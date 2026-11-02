import {fresh,type Save} from './model';
export interface SaveRepository {load():Save;save(s:Save):boolean}
export class LocalSaveRepository implements SaveRepository {
 private key:string;
 constructor(key='norrut.save.v1'){this.key=key;}
 load():Save {try {const p=JSON.parse(localStorage.getItem(this.key)||'null');if(p?.version!==1)return fresh();const s=fresh();for(const key of ['coins','best','runs'] as const)if(Number.isSafeInteger(p[key])&&p[key]>=0)s[key]=p[key];for(const key of ['engine','tank','wings'] as const)if(Number.isInteger(p.levels?.[key])&&p.levels[key]>=0&&p.levels[key]<=20)s.levels[key]=p.levels[key];return s;}catch{return fresh();}}
 save(s:Save) {try{localStorage.setItem(this.key,JSON.stringify(s));return true;}catch{return false;}}
}
