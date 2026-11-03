import {ivaneFrames,IVANE_ATLASES} from './ivane-art';
import {landmarkAssets} from './landmark-assets';
import {ContinuousLandscape} from './continuous-landscape';
import {PART_ATLASES,craftVisuals,craftSignature,conditionTints,type PartVisual} from './part-visuals';
import {partFrameData} from './part-frame-data';
import type {Slot} from './equipment';
import {milestones,sceneryAt,atlasFrames} from './route';
import {mounted,product,tier} from './equipment';
import Phaser from 'phaser';
import {modifiers,type Flight,type Save,type Controls} from './model';
import {flightAnimation,type AnimationPhase} from './animation';
export const landmarks=milestones;
interface State {flight:Flight;save:Save;controls:Controls;flying:boolean;phase:AnimationPhase;paused:boolean;reduced:boolean;tick(delta:number):void}
interface Puff {x:number;y:number;life:number;kind:'smoke'|'dust'}
export function createJourney(state:()=>State){return class Journey extends Phaser.Scene {
 landscape!:ContinuousLandscape;background!:Phaser.GameObjects.Image;backgroundNext!:Phaser.GameObjects.Image;road!:Phaser.GameObjects.TileSprite;canopy!:Phaser.GameObjects.Image;leaves!:Phaser.GameObjects.Image;shadow!:Phaser.GameObjects.Ellipse;
 g!:Phaser.GameObjects.Graphics;fx!:Phaser.GameObjects.Graphics;cloth!:Phaser.GameObjects.Graphics;partsOverlay!:Phaser.GameObjects.Graphics;plane!:Phaser.GameObjects.Container;
 liveryText!:Phaser.GameObjects.Text;wing!:Phaser.GameObjects.Image;pilot!:Phaser.GameObjects.Image;prop!:Phaser.GameObjects.Image;rear!:Phaser.GameObjects.Image;front!:Phaser.GameObjects.Image;
 componentSprites=new Map<Slot,Phaser.GameObjects.Image>();visuals:PartVisual[]=[];visualSignature='';droppedRocket!:Phaser.GameObjects.Image;sign!:Phaser.GameObjects.Text;elapsed=0;rotor=0;wheel=0;landingAt=-100;lastFlight:Flight|null=null;wasSettled=false;emit=0;smoke:Puff[]=[];
 preload(){this.load.on('progress',(value:number)=>{const loader=document.getElementById('asset-loading');if(loader)loader.textContent=`Verkstaden vaknar… ${Math.round(value*100)} %`;});for(const name of ['landscape','parts'])this.load.image(name,'art/'+name+'.webp');this.load.image('panorama-08','art/panorama-08.webp');this.load.image('birch-canopy-08','art/birch-canopy-08.webp');for(const a of [...PART_ATLASES,...landmarkAssets,...IVANE_ATLASES])this.load.image(a.key,a.url);}
 create(){
 document.getElementById('asset-loading')?.setAttribute('hidden','');
 const parts=this.textures.get('parts');parts.add('lower',0,0,300,900,320);parts.add('wing',0,0,0,900,300);parts.add('pilot',0,930,130,320,480);parts.add('wheel',0,95,695,470,460);parts.add('propeller',0,885,625,150,620);
 const bg=this.textures.get('landscape');bg.add('asphalt',0,0,791,1672,150);
 this.landscape=new ContinuousLandscape(this);
 this.road=this.add.tileSprite(0,0,1200,100,'landscape','asphalt').setOrigin(0);
 this.g=this.add.graphics();this.shadow=this.add.ellipse(0,0,320,30,0x283322,.3);this.fx=this.add.graphics().setDepth(6);
 this.plane=this.add.container(300,400).setDepth(5);
 for(const asset of PART_ATLASES){const texture=this.textures.get(asset.key);partFrameData[asset.slot].frames.forEach((r,i)=>texture.add(String(i),0,r.x,r.y,r.w,r.h));const image=this.add.image(0,0,asset.key,'0').setVisible(false);this.componentSprites.set(asset.slot,image);this.plane.add(image);}
 this.wing=this.componentSprites.get('wings')!;this.prop=this.componentSprites.get('nose')!;
 for(const [slot,meta]of Object.entries(ivaneFrames)){const r=meta.rect;this.textures.get(meta.key).add(slot,0,r.x,r.y,r.w,r.h);}this.liveryText=this.add.text(50,36,'Ivane<3',{fontFamily:'Arial',fontStyle:'bold italic',fontSize:'19px',color:'#ffffff',stroke:'#142533',strokeThickness:3}).setOrigin(.5).setDepth(44).setVisible(false);this.plane.add(this.liveryText);
 this.pilot=this.add.image(35,-21,'parts','pilot').setOrigin(.5,.65).setDisplaySize(95,142.5).setDepth(25);
 this.cloth=this.add.graphics().setDepth(24);this.rear=this.add.image(-105,86,'parts','wheel').setDisplaySize(53,52).setDepth(45);this.front=this.add.image(122,86,'parts','wheel').setDisplaySize(45,44).setDepth(45);
 this.partsOverlay=this.add.graphics().setDepth(46);this.plane.add([this.cloth,this.pilot,this.rear,this.front,this.partsOverlay]);this.plane.sort('depth');
 this.droppedRocket=this.add.image(0,0,'component-rockets','5').setVisible(false).setDepth(6);
 this.leaves=this.add.image(0,0,'birch-canopy-08').setOrigin(0).setDepth(7);this.canopy=this.add.image(0,0,'birch-canopy-08').setOrigin(0).setDepth(7);
 this.sign=this.add.text(0,0,'P\nÖstbergs\nparkering\nAvesta',{fontFamily:'Arial',fontSize:'14px',fontStyle:'bold',color:'#f9f4df',backgroundColor:'#274c67',align:'center',padding:{x:10,y:10},stroke:'#23405a',strokeThickness:1}).setDepth(4);
 }
 update(_time:number,delta:number){
 state().tick(delta);const {flight:f,save:s,controls:c,flying,phase,paused,reduced}=state();const dt=Math.min(delta/1000,.1);if(!paused)this.elapsed+=dt;
 if(this.lastFlight!==f){this.lastFlight=f;this.wasSettled=false;this.smoke=[];this.landingAt=-100;}
 if(f.settled&&!this.wasSettled){this.landingAt=this.elapsed;this.wasSettled=true;if(!reduced)this.cameras.main.shake(180,Math.abs(f.vy)<10?.001:.003);for(let i=0;i<15;i++)this.smoke.push({x:f.x+(i-7)*1.5,y:0,life:1,kind:'dust'});}
 const w=this.scale.width,h=this.scale.height,{ground,px,verticalScale,home,cam,rise,artScale,craftScale,sx,sy}=this.landscape.update(f.x,f.y,w,h,this.elapsed,reduced);
 this.road.setPosition(0,ground).setSize(w,h-ground+20).setTileScale(artScale).setAlpha(1);this.road.tilePositionX=f.x*px/artScale;
 const canopyWidth=Math.min(w*.8,950),canopyHeight=canopyWidth*1024/1536,span=Math.max(w*1.6,1600),leafTravel=f.x*px*1.3,leafOffset=leafTravel%span;for(const [i,leaf] of [this.leaves,this.canopy].entries()){const xx=-leafOffset+i*span;leaf.setPosition(xx,-h*.04+(reduced?0:Math.sin(this.elapsed*.7+i)*3)).setDisplaySize(canopyWidth,canopyHeight).setAlpha(.88*Math.exp(-Math.max(0,f.y)/85)).setRotation(reduced?0:Math.sin(this.elapsed*.65+i)*.008).setVisible(xx>-canopyWidth&&xx<w&&f.y<300);}
 const m=modifiers(f,s),throttle=flying&&(f.engineOn??c.thrust)&&f.fuel>0&&s.levels.engine>0,boost=flying&&c.boost&&f.boost>0;
 const a=flightAnimation({phase,time:this.elapsed,speed:Math.hypot(f.vx,f.vy),throttle:throttle||phase==='countdown'&&s.levels.engine>0,boost,landedAgo:this.elapsed-this.landingAt,reduced});

 const rampAngle=Math.atan2(15+(s.launchpad?.height||0)*4,330+(s.launchpad?.length||0)*10);
 this.plane.setPosition(sx+(throttle&&!reduced?Math.sin(this.elapsed*55)*.5:0),sy+a.bodyBob*craftScale).setScale(craftScale).setRotation(flying?-f.angle:f.settled?-.015:-rampAngle);
 const signature=craftSignature(s.gear);if(signature!==this.visualSignature){this.visualSignature=signature;this.visuals=craftVisuals(s.gear);for(const image of this.componentSprites.values())image.setVisible(false);for(const v of this.visuals){const image=this.componentSprites.get(v.slot)!;image.setTexture(v.key,v.textureFrame||String(v.frame)).setDisplaySize(v.width,v.height).setPosition(v.x,v.y).setDepth(v.depth).setRotation(0).setTint(conditionTints[v.condition]).setVisible(true);}this.plane.sort('depth');this.liveryText.setVisible(this.visuals.some(v=>v.slot==='chassis'&&v.skin==='ivane'));}
 this.pilot.y=-21+a.pilotBob;this.pilot.rotation=a.pilotAngle;
 if(!paused){this.rotor+=a.propellerRate*dt;this.wheel+=a.wheelRate*dt;}this.rear.rotation=this.wheel;this.front.rotation=this.wheel*1.18;this.rear.setScale(53/470,52/460*a.wheelSquash);this.front.setScale(45/470,44/460*a.wheelSquash);
 for(const v of this.visuals){const image=this.componentSprites.get(v.slot)!;let width=v.width,height=v.height;image.setPosition(v.x,v.y).setAlpha(1);if(v.slot==='wings')height*=a.wingFlex;if(v.slot==='nose'&&v.frame<8&&(throttle||flying))height*=.35+.65*Math.abs(Math.cos(this.rotor));if(v.slot==='engine'&&throttle&&!reduced)image.x+=Math.sin(this.elapsed*55)*.6;if(v.slot==='rockets'&&v.frame===0&&!reduced){image.y+=Math.sin(this.elapsed*2)*2;image.rotation=Math.sin(this.elapsed*2)*.025;}if(v.frame>=13&&!reduced)image.setAlpha(.92+.08*Math.sin(this.elapsed*7));image.setDisplaySize(width,height);}
 const pg=this.partsOverlay;pg.clear();for(const v of this.visuals){if(v.slot==='rockets'&&v.frame===0){pg.lineStyle(1,0xa08f69);pg.lineBetween(v.x,v.y+v.height*.42,-100,24);}if(v.level>0){pg.fillStyle(v.level>=10?0xf1d27a:0xbfcac5);for(let i=0;i<Math.ceil(v.level/3);i++)pg.fillCircle(v.x-8+i*5,v.y+v.height*.27,1.5);}if(v.mod==='hobby'){pg.lineStyle(2,0xb77e43,.85);pg.lineBetween(v.x-v.width*.18,v.y+v.height*.25,v.x+v.width*.18,v.y+v.height*.25);}else if(v.mod==='overclock'){pg.lineStyle(1.5,0x82d3e9);pg.lineBetween(v.x-v.width*.16,v.y+v.height*.22,v.x+v.width*.16,v.y+v.height*.22);}}
 this.shadow.setPosition(sx,ground+1).setScale(craftScale*Math.max(.4,1-f.y/500),1).setAlpha(Math.max(.04,.25*Math.exp(-f.y/160)));
 const cloth=this.cloth;cloth.clear();cloth.fillStyle(0xa94934);const ribbon:Phaser.Math.Vector2[]=[];for(let i=0;i<9;i++)ribbon.push(new Phaser.Math.Vector2(15-i*8,-77+Math.sin(this.elapsed*8-i*.8)*a.scarfAmplitude+i*.45));for(let i=8;i>=0;i--)ribbon.push(new Phaser.Math.Vector2(15-i*8,-70+Math.sin(this.elapsed*8-i*.8)*a.scarfAmplitude+i*.45));cloth.fillPoints(ribbon,true);
 const g=this.g;g.clear();const launchpad=s.launchpad||{height:0,length:0,assist:0},rampLength=(330+launchpad.length*10)*craftScale,rampHeight=(15+launchpad.height*4)*craftScale,rampX=home-cam-rampLength*.55,ry=ground;
 if(rampX>-500){g.fillStyle(0x543c2b,.25);g.fillEllipse(rampX+rampLength/2,ry+4,rampLength,18*craftScale);g.fillStyle(0x8d633d);g.fillPoints([{x:rampX,y:ry},{x:rampX+rampLength,y:ry-rampHeight},{x:rampX+rampLength,y:ry+6},{x:rampX,y:ry+6}],true);g.lineStyle(3,0xc59e68);g.lineBetween(rampX,ry-2,rampX+rampLength,ry-rampHeight-2);for(let i=1;i<10;i++){const xx=rampX+rampLength*i/10;g.lineStyle(3,0x523b29);g.lineBetween(xx,ry-rampHeight*i/10,xx,ry+5);}if(launchpad.assist>0&&f.time<1.5){g.lineStyle(launchpad.assist<4?4:2,launchpad.assist<4?0xaf7042:launchpad.assist<7?0xb6bfbd:0x88d5d5);g.lineBetween(rampX+20,ry-8,sx-90*craftScale,sy+30*craftScale);}}
 this.sign.setPosition(home-cam-240*craftScale,ground+rise-145*craftScale).setScale(Math.max(.65,craftScale)).setVisible(cam<w*.5);
 const fx=this.fx;fx.clear();if(!reduced&&flying){const speed=Math.hypot(f.vx,f.vy),path=-Math.atan2(f.vy,f.vx),intensity=Math.max(0,Math.min(1,(speed-25)/180));fx.lineStyle(1,0xf4f0dd,.16*intensity);for(let i=0;i<28;i++){const xx=((i*131-f.x*px*.5)%w+w)%w,yy=(i*59+this.elapsed*5)%h,length=(12+i%4*8)*intensity;fx.lineBetween(xx,yy,xx+Math.cos(path)*length,yy+Math.sin(path)*length);}if(f.y<100)for(let i=0;i<7;i++){const xx=((i*173-f.x*px*1.4+this.elapsed*17)%w+w)%w,yy=(i*67+this.elapsed*13)%h;fx.fillStyle(i%2?0xd1b74e:0x759b44,.45*Math.exp(-f.y/70));fx.fillEllipse(xx,yy,4,2);}}
 if(!paused){this.emit+=dt;if((throttle||boost)&&this.emit>.05){this.emit=0;this.smoke.push({x:f.x+(this.visuals.find(v=>v.slot===(boost?'rockets':'engine'))?.x||-100)*craftScale/px,y:f.y+(105-(this.visuals.find(v=>v.slot===(boost?'rockets':'engine'))?.y||18))*craftScale/verticalScale,life:1,kind:'smoke'});}for(const p of this.smoke){p.life-=dt/(p.kind==='dust'?.8:2);if(p.kind==='dust')p.y+=dt*4;}}
 for(const p of this.smoke){if(p.life<=0)continue;fx.fillStyle(p.kind==='smoke'?0xe9dfcb:0xb7a788,p.life*(p.kind==='smoke'?.38:.5));fx.fillCircle(home+p.x*px-cam,ground-p.y*verticalScale,craftScale*(3+(1-p.life)*19));}this.smoke=this.smoke.filter(p=>p.life>0).slice(-70);
 const exhaust=this.visuals.find(v=>v.slot===(boost?'rockets':'engine'));if((boost&&exhaust?.frame!==0)||(throttle&&exhaust&&exhaust.frame>=9)){const x=(exhaust?.x||-92)-(exhaust?.width||84)*.45,y=exhaust?.y||18,rotation=this.plane.rotation,world=(lx:number,ly:number)=>({x:this.plane.x+(Math.cos(rotation)*lx-Math.sin(rotation)*ly)*craftScale,y:this.plane.y+(Math.sin(rotation)*lx+Math.cos(rotation)*ly)*craftScale}),p=world(x,y-6),q=world(x-(boost?55:30)-(reduced?0:Math.sin(this.elapsed*70)*8),y),r=world(x,y+6),color=(exhaust?.frame||0)>=14?0xc68af4:(exhaust?.frame||0)>=13?0x6bdcf0:0xf9d176;fx.fillStyle(color,.85);fx.fillTriangle(p.x,p.y,q.x,q.y,r.x,r.y);}
 const dropped=flying&&f.sabotage==='rocket'&&f.time<3;this.droppedRocket.setVisible(dropped);if(dropped){const rocket=this.visuals.find(v=>v.slot==='rockets');this.droppedRocket.setFrame(String(rocket?.frame||5)).setDisplaySize(65*craftScale,40*craftScale).setPosition(sx-90-f.time*15,sy+75+f.time*f.time*18).setRotation(f.time*2);}
 if(f.sabotage==='parachute'&&f.time>3){const sway=reduced?0:Math.sin(this.elapsed*3)*9;fx.fillStyle(0xe2c997,.95);fx.fillEllipse(sx-160+sway,sy-45,100,40);fx.lineStyle(2,0xeee7d0);fx.lineBetween(sx-205+sway,sy-40,sx-60,sy+25);fx.lineBetween(sx-115+sway,sy-40,sx-60,sy+25);}
 if(flying&&f.sabotage==='horse'){fx.fillStyle(0xac5437);fx.fillRoundedRect(sx-18,sy-155*craftScale,34,18,3);fx.fillRect(sx+8,sy-175*craftScale,9,30);fx.fillRect(sx-13,sy-138*craftScale,5,12);fx.fillRect(sx+10,sy-138*craftScale,5,12);}
 if(flying&&f.sabotage==='fika'&&f.time>1&&f.time<8){const bx=w*.7,by=h*.4;fx.fillStyle(0xb77e41);fx.fillEllipse(bx,by,120,100);fx.lineStyle(6,0x79502e);const points=[];for(let t=0;t<22;t+=.1)points.push(new Phaser.Math.Vector2(bx+Math.cos(t)*t*2,by+Math.sin(t)*t*1.7));fx.strokePoints(points);}
 }
};}
