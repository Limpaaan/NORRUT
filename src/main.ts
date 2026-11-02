import Phaser from 'phaser';
import './style.css';
import {buy,cost,launch,settle,step,upgrades,type Flight,type Controls} from './model';
import {LocalSaveRepository} from './storage';
import {installHotkeys} from './hotkeys';
import {installAccounts} from './accounts';
let repo=new LocalSaveRepository();const save=repo.load();let accountPaused=false;
const el=(id:string)=>document.getElementById(id)!;
const controls:Controls={left:false,right:false,thrust:false,boost:false};
let active=false,flight:Flight=launch(save),accumulator=0;
function persist(){el('save-status').textContent=repo.save(save)?'Sparat på den här enheten':'Kunde inte spara · framsteg finns kvar tills sidan stängs';accounts.save(save);}
function shop(){el('wallet').textContent=`◈ ${save.coins.toLocaleString('sv-SE')} skrotmynt`;el('record').textContent=`${save.best.toLocaleString('sv-SE')} m`;el('upgrades').replaceChildren();for(const u of upgrades){const card=document.createElement('article');card.innerHTML=`<div class="upgrade-icon">${u.icon}</div><small>NIVÅ ${save.levels[u.id]} / 20</small><h3>${u.name}</h3><p>${u.description}</p><button ${active||accountPaused||save.coins<cost(save.levels[u.id])||save.levels[u.id]>=20?'disabled':''}>${save.levels[u.id]>=20?'Fullt uppgraderad':`Uppgradera · ◈ ${cost(save.levels[u.id])}`}</button>`;card.querySelector('button')!.onclick=()=>{if(!active&&!accountPaused&&buy(save,u.id)){persist();shop();}};el('upgrades').append(card);}}
const landmarks=[{x:0,name:'Östbergs parkering',kind:'start'},{x:200,name:'Verket',kind:'industry'},{x:450,name:'Dalälven',kind:'river'},{x:720,name:'Gamla Byn',kind:'village'},{x:1100,name:'Dalahästen',kind:'horse'},{x:1800,name:'Mot Hedemora',kind:'village'}];
class Journey extends Phaser.Scene {
 g!:Phaser.GameObjects.Graphics; craft!:Phaser.GameObjects.Container; labels:Phaser.GameObjects.Text[]=[];
 create(){this.g=this.add.graphics();const shape=this.add.graphics();shape.fillStyle(0xd9ddcd);shape.fillPoints([{x:-27,y:4},{x:28,y:0},{x:7,y:-12},{x:-19,y:-10}],true);shape.fillStyle(0x425c5d);shape.fillTriangle(-8,0,5,23,15,0);shape.fillStyle(0xdea554);shape.fillRect(-24,-8,9,13);shape.fillStyle(0x88b7bd);shape.fillEllipse(8,-6,15,8);shape.lineStyle(2,0x273c3c);shape.lineBetween(-24,10,17,10);this.craft=this.add.container(245,400,[shape]);this.craft.setDepth(5);for(const l of landmarks)this.labels.push(this.add.text(0,0,l.name,{fontFamily:'Arial',fontSize:'14px',color:'#f4eddb',backgroundColor:'#263e3de0',padding:{x:9,y:6}}).setDepth(4));}
 update(_time:number,delta:number){if(active){accumulator+=Math.min(delta/1000,0.1);while(accumulator>=1/120&&active){step(flight,controls,save,1/120);accumulator-=1/120;if(flight.y<=0&&flight.time>0.2){flight.y=0;active=false;const result=settle(save,flight);persist();shop();el('overlay').style.display='block';el('overlay').querySelector('h2')!.textContent=result.soft?'Mjuk landning. Snyggt flugit!':'Skrotet höll nästan hela vägen.';el('message').textContent=`${Math.floor(flight.x)} meter norrut · +${result.reward} skrotmynt${result.soft?' · inklusive 20 i landningsbonus':''}. Uppgradera i verkstaden och försök igen.`;el('launch').textContent='Tillbaka till start ↗';}}}
 const w=this.scale.width,h=this.scale.height,ground=h-72,cam=Math.max(0,flight.x*3-200),rise=Math.max(0,flight.y*2-(h*0.52));const g=this.g;g.clear();
 // Wide blocks of warm mist and three independently scrolling forest layers.
 g.fillGradientStyle(0x7dabad,0x97b6b0,0xe8d9b6,0xe8d9b6,1);g.fillRect(0,0,w,h);g.fillStyle(0xf5dfaa,0.8);g.fillCircle(w*0.76,105+rise*0.05,45);
 for(let layer=0;layer<3;layer++){const colors=[0x8da7a0,0x698c82,0x365f56];g.fillStyle(colors[layer],1);const spacing=layer===2?43:70;const offset=(cam*(0.09+layer*0.12))%spacing;for(let i=-1;i<w/spacing+2;i++){const x=i*spacing-offset;const noise=Math.sin((i+Math.floor(cam*(0.09+layer*0.12)/spacing))*2.7)*25;const base=ground-25+layer*12+rise*(0.08+layer*0.1);const height=80+layer*24+noise;g.fillTriangle(x,base-height,x-35,base+10,x+35,base+10);g.fillRect(x-3,base,6,20);}}
 g.fillStyle(0x334b43);g.fillRect(0,ground+rise,w,h);g.fillStyle(0x9b9c83);g.fillRect(0,ground+rise,w,7);
 for(let i=0;i<landmarks.length;i++){const l=landmarks[i],x=190+l.x*3-cam,y=ground+rise;this.labels[i].setPosition(x-20,y+16).setVisible(x>-220&&x<w+100&&y<h-10);if(x < -400||x>w+400)continue;
 if(l.kind==='river'){g.fillStyle(0x75a9ac);g.fillRect(x-90,y,210,72);g.lineStyle(2,0xc8d8c4,0.7);for(let j=0;j<5;j++)g.lineBetween(x-70+j*20,y+19+j*8,x+10+j*20,y+19+j*8);}
 else if(l.kind==='horse'){g.fillStyle(0xb95539);g.fillRoundedRect(x,y-82,67,32,5);g.fillRect(x+49,y-111,19,45);g.fillTriangle(x+48,y-110,x+80,y-105,x+64,y-89);g.fillRect(x+6,y-55,10,55);g.fillRect(x+49,y-55,10,55);g.lineStyle(3,0xeacb83);g.strokeRect(x+17,y-75,27,17);}
 else {const start=l.kind==='start',industry=l.kind==='industry';g.fillStyle(start?0x6b7974:0x975c48);g.fillRect(x-60,y-65,145,65);g.fillStyle(0x394d4b);g.fillTriangle(x-72,y-65,x+10,y-99,x+96,y-65);if(industry){g.fillStyle(0x7c5547);g.fillRect(x+90,y-152,18,152);}g.fillStyle(0xe5d09a);for(let j=0;j<4;j++)g.fillRect(x-42+j*30,y-49,13,23);if(start){g.fillStyle(0x63726b);g.fillRect(x-180,y,340,72);g.lineStyle(2,0xd3c9a9);for(let j=0;j<7;j++)g.lineBetween(x-160+j*45,y+28,x-145+j*45,y+51);g.fillStyle(0xd4c39c);g.fillTriangle(x-10,y,x+70,y-25,x+70,y);}}
 }
 const sx=190+flight.x*3-cam,sy=ground-flight.y*2+rise-12;this.craft.setPosition(sx,sy).setRotation(-flight.angle);if(active&&(controls.thrust&&flight.fuel>0||controls.boost&&flight.boost>0)){g.fillStyle(controls.boost?0xf8ce70:0xe49b54);g.fillTriangle(sx-24,sy+7,sx-60-Math.sin(_time)*10,sy+22,sx-27,sy-2);}
 el('distance').textContent=`${Math.floor(flight.x)} m`;el('altitude').textContent=`${Math.floor(flight.y)} m höjd`;el('speed').textContent=`${Math.round(Math.hypot(flight.vx,flight.vy)*3.6)} km/h`;el('place').textContent=[...landmarks].reverse().find(l=>l.x<=flight.x)!.name;(el('fuel') as HTMLMeterElement).value=flight.fuel/(12+save.levels.tank*2.5)*100;(el('boost') as HTMLMeterElement).value=flight.boost/3*100;
 }
}
new Phaser.Game({type:Phaser.AUTO,parent:'game',backgroundColor:'#91afaa',scale:{mode:Phaser.Scale.RESIZE,width:'100%',height:'100%'},scene:Journey,render:{antialias:true},audio:{noAudio:true}});
el('launch').onclick=()=>{if(accountPaused)return;el('launch').blur();release();flight=launch(save);accumulator=0;active=true;el('overlay').style.display='none';shop();};
installHotkeys(controls,release);
function release(){for(const k of Object.keys(controls) as (keyof Controls)[])controls[k]=false;accumulator=0;}
window.addEventListener('blur',release);document.addEventListener('visibilitychange',release);
document.querySelectorAll<HTMLButtonElement>('[data-control]').forEach(b=>{const k=b.dataset.control as keyof Controls;b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);controls[k]=true;b.classList.add('held');};const up=()=>{controls[k]=false;b.classList.remove('held');};b.onpointerup=up;b.onpointercancel=up;b.onlostpointercapture=up;});
const accounts=installAccounts({isFlying:()=>active,replace:(data,userId)=>{repo=new LocalSaveRepository(userId?`norrut.account.${userId}`:'norrut.save.v1');Object.assign(save,userId?data:repo.load());repo.save(save);flight=launch(save);shop();},pause:value=>{accountPaused=value;el('launch').toggleAttribute('disabled',value);shop();}});shop();

