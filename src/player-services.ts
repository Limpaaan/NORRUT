import {installAdminUI} from './admin-ui.ts';
import {fresh,type Save} from './model.ts';
type Command={seq:number;kind:'reset'|'grant';amount:number};
export function applyGuestCommands(save:Save,commands:Command[]):Save{let next=structuredClone(save);for(const c of [...commands].sort((a,b)=>a.seq-b.seq)){if(!Number.isSafeInteger(c.seq)||c.seq<=(next.adminSeq||0))continue;if(c.kind==='reset')next=fresh();else if(c.kind==='grant'&&Number.isSafeInteger(c.amount)&&c.amount>=0)next.coins=Math.min(1e9,next.coins+c.amount);else continue;next.adminSeq=c.seq;}return next;}
interface Hooks{loggedIn():boolean;busy():boolean;save:Save;pilotId():string;apply(data:Save):void;rpc(name:string,args:unknown):Promise<any>}
export function installPlayerServices(h:Hooks){
 let config:{url:string;publishableKey:string}|null=null,syncing=false;
 void fetch(new URL('account-config.json',location.href)).then(r=>r.json()).then(c=>{config=c;}).catch(()=>{});
 async function syncGuest(){if(syncing||h.loggedIn()||h.busy()||!config)return;syncing=true;const pilot=h.pilotId();try{const key='norrut.guest.secret.'+pilot;let secret=localStorage.getItem(key);if(!secret){secret=Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join('');localStorage.setItem(key,secret);}const res=await fetch(config.url+'/rest/v1/rpc/guest_sync',{method:'POST',headers:{apikey:config.publishableKey,'Content-Type':'application/json'},body:JSON.stringify({secret,stats:{coins:h.save.coins,best:h.save.best,runs:h.save.runs},after_seq:h.save.adminSeq||0}),signal:AbortSignal.timeout(10000)});if(!res.ok)return;const commands=await res.json();if(h.loggedIn()||h.busy()||h.pilotId()!==pilot)return;if(Array.isArray(commands)&&commands.length)h.apply(applyGuestCommands(h.save,commands));}catch{}finally{syncing=false;}}
 setInterval(()=>void syncGuest(),10000);setTimeout(()=>void syncGuest(),1500);
 installAdminUI(h);
}
