import {milestones,sceneryAt,atlasFrames} from './route';
import {mounted,product,tier} from './equipment';
import Phaser from 'phaser';
import {modifiers,type Flight,type Save,type Controls} from './model';
import {flightAnimation,type AnimationPhase} from './animation';
export const landmarks=milestones;
interface State {flight:Flight;save:Save;controls:Controls;flying:boolean;phase:AnimationPhase;paused:boolean;reduced:boolean;tick(delta:number):void}
interface Puff {x:number;y:number;life:number;kind:'smoke'|'dust'}
export function createJourney(state:()=>State){return class Journey extends Phaser.Scene {
 background!:Phaser.GameObjects.Image;backgroundNext!:Phaser.GameObjects.Image;road!:Phaser.GameObjects.TileSprite;leaves!:Phaser.GameObjects.Image;shadow!:Phaser.GameObjects.Ellipse;
 g!:Phaser.GameObjects.Graphics;fx!:Phaser.GameObjects.Graphics;cloth!:Phaser.GameObjects.Graphics;partsOverlay!:Phaser.GameObjects.Graphics;plane!:Phaser.GameObjects.Container;
 wing!:Phaser.GameObjects.Image;pilot!:Phaser.GameObjects.Image;prop!:Phaser.GameObjects.Image;rear!:Phaser.GameObjects.Image;front!:Phaser.GameObjects.Image;
 sign!:Phaser.GameObjects.Text;elapsed=0;rotor=0;wheel=0;landingAt=-100;lastFlight:Flight|null=null;wasSettled=false;emit=0;smoke:Puff[]=[];
 preload(){this.load.on('progress',(value:number)=>{const loader=document.getElementById('asset-loading');if(loader)loader.textContent=`Verkstaden vaknar… ${Math.round(value*100)} %`;});for(const name of ['landscape','parts','foliage','route-atlas'])this.load.image(name,'art/'+name+'.webp');}
 create(){
 document.getElementById('asset-loading')?.setAttribute('hidden','');
 const parts=this.textures.get('parts');parts.add('lower',0,0,300,900,320);parts.add('wing',0,0,0,900,300);parts.add('pilot',0,930,130,320,480);parts.add('wheel',0,95,695,470,460);parts.add('propeller',0,885,625,150,620);
 const bg=this.textures.get('landscape');bg.add('asphalt',0,0,791,1672,150);
 const atlas=this.textures.get('route-atlas'),source=atlas.getSourceImage() as HTMLImageElement;for(let i=0;i<8;i++){const x=Math.round(i%2*source.width/2),y=Math.round(Math.floor(i/2)*source.height/4),right=Math.round((i%2+1)*source.width/2),bottom=Math.round((Math.floor(i/2)+1)*source.height/4);atlas.add(atlasFrames[i],0,x,y,right-x,bottom-y);}
 this.background=this.add.image(0,0,'landscape','__BASE');this.backgroundNext=this.add.image(0,0,'landscape','__BASE');
 this.road=this.add.tileSprite(0,0,1200,100,'landscape','asphalt').setOrigin(0);
 this.g=this.add.graphics();this.shadow=this.add.ellipse(0,0,320,30,0x283322,.3);this.fx=this.add.graphics().setDepth(6);
 this.plane=this.add.container(300,400).setDepth(5);
 this.wing=this.add.image(0,0,'parts','wing').setOrigin(.5,1.405).setDisplaySize(340,113.33);
 this.pilot=this.add.image(52,9,'parts','pilot').setOrigin(.5,.65).setDisplaySize(95,142.5);
 const chassis=this.add.image(0,0,'parts','lower').setOrigin(.5,.38).setDisplaySize(340,120.89);
 this.cloth=this.add.graphics();this.rear=this.add.image(-99,80,'parts','wheel').setDisplaySize(53,52);this.front=this.add.image(125,80,'parts','wheel').setDisplaySize(45,44);
 this.prop=this.add.image(-157,10,'parts','propeller').setDisplaySize(20,90);
 this.partsOverlay=this.add.graphics();this.plane.add([this.wing,this.cloth,this.pilot,chassis,this.rear,this.front,this.prop,this.partsOverlay]);
 this.leaves=this.add.image(0,0,'foliage').setOrigin(0).setDepth(7);
 this.sign=this.add.text(0,0,'P\nÖstbergs\nparkering\nAvesta',{fontFamily:'Arial',fontSize:'14px',fontStyle:'bold',color:'#f9f4df',backgroundColor:'#274c67',align:'center',padding:{x:10,y:10},stroke:'#23405a',strokeThickness:1}).setDepth(4);
 }
 update(_time:number,delta:number){
 state().tick(delta);const {flight:f,save:s,controls:c,flying,phase,paused,reduced}=state();const dt=Math.min(delta/1000,.1);if(!paused)this.elapsed+=dt;
 if(this.lastFlight!==f){this.lastFlight=f;this.wasSettled=false;this.smoke=[];this.landingAt=-100;}
 if(f.settled&&!this.wasSettled){this.landingAt=this.elapsed;this.wasSettled=true;if(!reduced)this.cameras.main.shake(180,Math.abs(f.vy)<10?.001:.003);for(let i=0;i<15;i++)this.smoke.push({x:f.x*4+(i-7)*5,y:2,life:1,kind:'dust'});}
 const w=this.scale.width,h=this.scale.height,ground=h*.835,px=Math.max(2.5,Math.min(4.5,w/350)),home=w*.265,cam=Math.max(0,f.x*px-w*.14),rise=Math.max(0,f.y*px-h*.38),artScale=Math.max(w/1672,h/941);
 const scene=sceneryAt(f.x),opacity=Math.max(.04,1-rise/(h*2.5));for(const [image,frame,alpha] of [[this.background,scene.previous,1],[this.backgroundNext,scene.current,scene.blend]] as const){image.setTexture(frame==='start'?'landscape':'route-atlas',frame==='start'?'__BASE':frame);const fw=image.frame.realWidth,fh=image.frame.realHeight,scale=Math.max(w/fw,h/fh)*1.1;image.setDisplaySize(fw*scale,fh*scale).setPosition(w/2-(scene.pan-.5)*w*.08,h/2+Math.min(h*.24,rise*.13)).setAlpha(alpha*opacity);}
 this.road.setPosition(0,ground+rise).setSize(w,h*.3).setTileScale(artScale).setAlpha(Math.max(0,1-f.x/220));this.road.tilePositionX=cam/artScale;
 this.leaves.setDisplaySize(1672*artScale*1.025,941*artScale*1.025).setPosition(-w*.01-cam*.13,Math.min(h,rise*.65)).setVisible(w>=h&&f.x<260);this.leaves.rotation=reduced?0:Math.sin(this.elapsed*.55)*.0018;
 const m=modifiers(f,s),throttle=flying&&c.thrust&&f.fuel>0&&s.levels.engine>0,boost=flying&&c.boost&&f.boost>0;
 const a=flightAnimation({phase,time:this.elapsed,speed:Math.hypot(f.vx,f.vy),throttle:throttle||phase==='countdown'&&s.levels.engine>0,boost,landedAgo:this.elapsed-this.landingAt,reduced});
 const craftScale=Math.max(.48,Math.min(1.25,w/1350,h/640)),sx=home+f.x*px-cam,sy=ground-f.y*px+rise-105*craftScale;
 this.plane.setPosition(sx+(throttle&&!reduced?Math.sin(this.elapsed*55)*.5:0),sy+a.bodyBob*craftScale).setScale(craftScale).setRotation(flying?-f.angle:f.settled?-.015:-.08);
 this.wing.setVisible(s.levels.wings>0).setScale(340/900,113.33/300*a.wingFlex);this.pilot.y=9+a.pilotBob;this.pilot.rotation=a.pilotAngle;
 if(!paused){this.rotor+=a.propellerRate*dt;this.wheel+=a.wheelRate*dt;}this.prop.setVisible(s.levels.engine>0&&(!s.gear||tier(s.gear,'engine')<9));this.prop.setDisplaySize(18,90*Math.max(.12,Math.abs(Math.cos(this.rotor))));this.rear.rotation=this.wheel;this.front.rotation=this.wheel*1.18;this.rear.setScale(53/470,52/460*a.wheelSquash);this.front.setScale(45/470,44/460*a.wheelSquash);
 const pg=this.partsOverlay;pg.clear();if(s.gear){const gear=s.gear;const color=(slot:any)=>{const p=mounted(gear,slot);return p?[0x77533a,0x92806a,0xa59678,0xa9b2a3,0xc9d3cb,0x9ccbd0,0xefc66a][p.condition]:0x8d806a;};const et=tier(gear,'engine'),wt=tier(gear,'wings'),bt=tier(gear,'chassis'),tt=tier(gear,'tank'),tail=tier(gear,'tail'),nt=tier(gear,'nose'),rt=tier(gear,'rockets');this.wing.setTint(color('wings'));this.wing.setScale((340+wt*3)/900,113.33/300*a.wingFlex);if(bt){pg.fillStyle(color('chassis'),.8);pg.fillRoundedRect(-35,25,115+bt*2,36,5);pg.lineStyle(2,0x4c4e43);pg.strokeRoundedRect(-35,25,115+bt*2,36,5);}if(et){pg.fillStyle(color('engine'));pg.fillRoundedRect(-139,-2,26+et*2,27+et,4);pg.lineStyle(2,0x333c3f);for(let i=0;i<Math.min(8,et);i++)pg.lineBetween(-134+i*5,1,-134+i*5,24);if(et>=9){pg.fillStyle(et>=14?0x62cdeb:0xa8b8b5);pg.fillTriangle(116,-3,150+et,24,116,48);}}if(tt){pg.fillStyle(color('tank'));pg.fillRoundedRect(-60,15,20+tt*2,25,4);pg.lineStyle(3,0x6b4b34);pg.lineBetween(-53,15,-53,40);}if(tail){pg.fillStyle(color('tail'));pg.fillTriangle(-110,32,-125-tail*2,-14-tail*3,-80,30);}if(nt){pg.fillStyle(color('nose'));if(et<9)pg.fillEllipse(-151,11,12+nt,22+nt*3);else pg.fillTriangle(120,-5-nt,158+nt*2,23,120,49+nt);}const instruments=tier(gear,'instruments');if(instruments){pg.fillStyle(0x393d37);pg.fillRoundedRect(76,-15,25,19,3);pg.fillStyle(instruments>=7?0x81d7b4:0xe1caa0);if(instruments>=7){pg.fillRect(80,-11,17,10);}else{pg.fillCircle(84,-6,5);pg.fillCircle(94,-6,4);}}if(rt){pg.fillStyle(color('rockets'));for(let i=0;i<Math.min(3,Math.ceil(rt/5));i++)pg.fillRoundedRect(-80,55+i*13,48+rt*2,11,4);}}
 this.shadow.setPosition(sx+f.y*.15,ground+rise+1).setScale(craftScale*(1+f.y*.002),1).setAlpha(.25*Math.exp(-f.y/40));
 const cloth=this.cloth;cloth.clear();cloth.fillStyle(0xa94934);const ribbon:Phaser.Math.Vector2[]=[];for(let i=0;i<9;i++)ribbon.push(new Phaser.Math.Vector2(32-i*8,-47+Math.sin(this.elapsed*8-i*.8)*a.scarfAmplitude+i*.45));for(let i=8;i>=0;i--)ribbon.push(new Phaser.Math.Vector2(32-i*8,-40+Math.sin(this.elapsed*8-i*.8)*a.scarfAmplitude+i*.45));cloth.fillPoints(ribbon,true);
 const g=this.g;g.clear();const rampX=home-cam-155*craftScale,ry=ground+rise;
 if(rampX>-500){g.fillStyle(0x3e3b29,.25);g.fillEllipse(rampX+130,ry+5,340*craftScale,25*craftScale);g.fillStyle(0x765237);g.fillPoints([{x:rampX,y:ry},{x:rampX+330*craftScale,y:ry-52*craftScale},{x:rampX+330*craftScale,y:ry+6},{x:rampX,y:ry+6}],true);g.lineStyle(3,0xbf9562);g.lineBetween(rampX,ry-2,rampX+330*craftScale,ry-54*craftScale);g.lineStyle(1,0x4c3c2b);for(let i=0;i<16;i++){const xx=rampX+i*21*craftScale;g.lineBetween(xx,ry-i*3.3*craftScale,xx+9,ry+4);}g.fillStyle(0x543c2c);for(let i=1;i<5;i++)g.fillRect(rampX+i*63*craftScale,ry-40*craftScale,9*craftScale,43*craftScale);}
 this.sign.setPosition(home-cam-240*craftScale,ground+rise-145*craftScale).setScale(Math.max(.65,craftScale)).setVisible(cam<w*.5);
 const fx=this.fx;fx.clear();if(!reduced&&rise<h){fx.lineStyle(1,0xfff4d4,.2);for(let i=0;i<22;i++){const xx=(i*83+Math.sin(this.elapsed*.6+i)*15-cam*.14)%w;fx.lineBetween(xx,h*.64+i%5*8+rise*.13,xx+18+i%3*12,h*.64+i%5*8+rise*.13);}}
 if(!paused){this.emit+=dt;if((throttle||boost)&&this.emit>.05){this.emit=0;this.smoke.push({x:f.x*px-130*craftScale,y:f.y*px+45*craftScale,life:1,kind:'smoke'});}for(const p of this.smoke){p.life-=dt/(p.kind==='dust'?.8:2);if(p.kind==='dust')p.y+=dt*18;}}
 for(const p of this.smoke){if(p.life<=0)continue;fx.fillStyle(p.kind==='smoke'?0xe9dfcb:0xb7a788,p.life*(p.kind==='smoke'?.38:.5));fx.fillCircle(home+p.x-cam,ground-p.y+rise,craftScale*(3+(1-p.life)*19));}this.smoke=this.smoke.filter(p=>p.life>0).slice(-70);
 if(boost){fx.fillStyle(0xf9d176,.8);fx.fillTriangle(sx-160*craftScale,sy+30*craftScale,sx-(205+Math.sin(this.elapsed*80)*15)*craftScale,sy+35*craftScale,sx-155*craftScale,sy+48*craftScale);fx.fillStyle(0xfff1c7);fx.fillCircle(sx-160*craftScale,sy+38*craftScale,7*craftScale);}
 if(s.levels.rockets>0){fx.fillStyle(0x65756e);fx.fillRoundedRect(sx-85*craftScale,sy+60*craftScale,65*craftScale,14*craftScale,4);}
 if(flying&&f.sabotage==='rocket'&&f.time<3){fx.fillStyle(0x68766b);fx.fillRoundedRect(sx-90-f.time*15,sy+75+f.time*f.time*18,42,12,4);}
 if(f.sabotage==='parachute'&&f.time>3){const sway=reduced?0:Math.sin(this.elapsed*3)*9;fx.fillStyle(0xe2c997,.95);fx.fillEllipse(sx-160+sway,sy-45,100,40);fx.lineStyle(2,0xeee7d0);fx.lineBetween(sx-205+sway,sy-40,sx-60,sy+25);fx.lineBetween(sx-115+sway,sy-40,sx-60,sy+25);}
 if(flying&&f.sabotage==='horse'){fx.fillStyle(0xac5437);fx.fillRoundedRect(sx-18,sy-155*craftScale,34,18,3);fx.fillRect(sx+8,sy-175*craftScale,9,30);fx.fillRect(sx-13,sy-138*craftScale,5,12);fx.fillRect(sx+10,sy-138*craftScale,5,12);}
 if(flying&&f.sabotage==='fika'&&f.time>1&&f.time<8){const bx=w*.7,by=h*.4;fx.fillStyle(0xb77e41);fx.fillEllipse(bx,by,120,100);fx.lineStyle(6,0x79502e);const points=[];for(let t=0;t<22;t+=.1)points.push(new Phaser.Math.Vector2(bx+Math.cos(t)*t*2,by+Math.sin(t)*t*1.7));fx.strokePoints(points);}
 }
};}
