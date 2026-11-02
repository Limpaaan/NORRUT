import Phaser from 'phaser';
import {createArt,building} from './art';
import {modifiers,type Flight,type Save,type Controls} from './model';
export const landmarks=[{x:0,name:'Östbergs parkering',kind:'start'},{x:200,name:'Verket',kind:'industry'},{x:450,name:'Dalälven',kind:'river'},{x:720,name:'Gamla Byn',kind:'village'},{x:1100,name:'Dalahästen',kind:'horse'},{x:1800,name:'Mot Hedemora',kind:'village'}];
interface State {flight:Flight;save:Save;controls:Controls;flying:boolean;tick(delta:number):void}
export function createJourney(state:()=>State){return class Journey extends Phaser.Scene {
 sky!:Phaser.GameObjects.Image;layers:Phaser.GameObjects.TileSprite[]=[];g!:Phaser.GameObjects.Graphics;fx!:Phaser.GameObjects.Graphics;plane!:Phaser.GameObjects.Container;prop!:Phaser.GameObjects.Rectangle;labels:Phaser.GameObjects.Text[]=[];smoke:{x:number;y:number;life:number}[]=[];
 create(){createArt(this);this.sky=this.add.image(0,0,'morning').setOrigin(0);for(const key of ['ridges','woods0','woods1','woods2'])this.layers.push(this.add.tileSprite(0,0,1000,key==='ridges'?500:400,key).setOrigin(0));this.g=this.add.graphics();this.fx=this.add.graphics().setDepth(6);this.plane=this.add.container(200,300).setDepth(5);const image=this.add.image(0,0,'aircraft').setScale(.72);this.prop=this.add.rectangle(49,0,3,32,0xd7e0c3,.6);this.plane.add([image,this.prop]);for(const l of landmarks)this.labels.push(this.add.text(0,0,l.name,{fontFamily:'Arial',fontSize:'11px',color:'#f1ead3',backgroundColor:'#2a4745cc',padding:{x:8,y:5}}).setDepth(3));}
 update(time:number,delta:number){const stateNow=state();stateNow.tick(delta);const {flight:f,save:s,controls:c,flying}=state();const w=this.scale.width,h=this.scale.height,ground=h-88,scale=2.2,cam=Math.max(0,f.x*scale-170),rise=Math.max(0,f.y*2-(h*.49));
 this.sky.setDisplaySize(w,h);this.layers.forEach((layer,i)=>{layer.width=w;layer.setPosition(0,ground-(i===0?370:330)+i*17+rise*(.06+i*.08));layer.tilePositionX=cam*[.045,.13,.26,.43][i];layer.alpha=i===1?.75:1;});
 const g=this.g;g.clear();g.fillStyle(0x5f7562);g.fillRect(0,ground+rise,w,h);g.fillStyle(0xb4a77c);g.fillRect(0,ground+rise,w,5);g.fillStyle(0x80946d);g.fillRect(0,ground+rise+5,w,7);g.fillStyle(0x899783,.3);for(let i=0;i<w/27;i++)g.fillRect((i*47-cam*.8)%w,ground+rise+15+(i*17)%60,23,1);
 // A quiet river and small settlement sit beyond the near forest.
 g.fillStyle(0xa5bdb3,.45);g.fillEllipse(w*.67-cam*.06%w,ground-34+rise*.12,w*.6,18);
 for(let i=0;i<landmarks.length;i++){const l=landmarks[i],x=170+l.x*scale-cam,y=ground+rise;this.labels[i].setVisible(x>-120&&x<w+100&&y<h+20).setPosition(x-35,y-12-(l.kind==='industry'?155:l.kind==='horse'?140:l.kind==='river'?40:105));if(x< -400||x>w+400)continue;
 if(l.kind==='river'){g.fillStyle(0x89b3ae);g.fillRect(x-115,y-2,250,110);g.fillStyle(0xd5d2ab,.7);for(let j=0;j<7;j++)g.fillRect(x-95+(j*29)%170,y+14+j*9,30+(j%2)*30,1);g.fillStyle(0x485c4e);g.fillRect(x-125,y-4,15,17);g.fillRect(x+135,y-4,15,17);}
 else if(l.kind==='horse'){g.fillStyle(0xab593d);g.fillRoundedRect(x,y-95,65,38,6);g.fillPoints([{x:x+44,y:y-86},{x:x+52,y:y-133},{x:x+75,y:y-137},{x:x+82,y:y-116},{x:x+62,y:y-109},{x:x+61,y:y-75}],true);g.fillRect(x+8,y-62,11,62);g.fillRect(x+48,y-62,11,62);g.fillTriangle(x,y-86,x-16,y-115,x+7,y-95);g.lineStyle(4,0xdec68a);g.strokeRect(x+20,y-89,24,23);g.lineStyle(2,0x618d84);g.lineBetween(x+22,y-83,x+41,y-68);g.fillStyle(0x283c35);g.fillCircle(x+69,y-127,2);}
 else if(l.kind==='start'){building(g,x-100,y,150,72);g.fillStyle(0x77877a);g.fillRect(x-220,y,440,100);g.lineStyle(2,0xe3d5aa,.65);for(let j=0;j<8;j++)g.lineBetween(x-200+j*47,y+35,x-183+j*47,y+57);g.fillStyle(0x9b7d50);g.fillTriangle(x-12,y,x+95,y-32,x+95,y);g.lineStyle(3,0xd4bd83);g.lineBetween(x-12,y,x+95,y-32);g.lineStyle(2,0x465f4d);for(let j=0;j<4;j++)g.lineBetween(x+22+j*21,y-10-j*6,x+22+j*21,y);}
 else if(l.kind==='industry'){building(g,x-60,y,180,108,true);building(g,x+125,y,85,67);}
 else {building(g,x-100,y,90,70);building(g,x+5,y-3,75,59);building(g,x+95,y,62,62);}
 }
 const sx=170+f.x*scale-cam,sy=ground-f.y*2+rise-18;this.plane.setPosition(sx,sy).setRotation(-f.angle);this.plane.setScale(s.levels.engine>=10?1.1:1);this.prop.height=(flying&&c.thrust&&f.fuel>0)?40:26;this.prop.alpha=.35+Math.abs(Math.sin(time*.1))*.4;
 const fx=this.fx;fx.clear();const m=modifiers(f,s);const firing=flying&&(c.thrust&&f.fuel>0||c.boost&&f.boost>0);if(firing&&time%50<delta){this.smoke.push({x:f.x*scale-49*Math.cos(f.angle),y:f.y*2-16,life:1});}for(const puff of this.smoke){puff.life-=delta/2200;if(puff.life>0){fx.fillStyle(0xe8dfc0,puff.life*.3);fx.fillCircle(170+puff.x-cam,ground-puff.y+rise,4+(1-puff.life)*17);}}this.smoke=this.smoke.filter(p=>p.life>0).slice(-75);
 if(firing){const rearX=sx-52*Math.cos(f.angle),rearY=sy+52*Math.sin(f.angle);fx.fillStyle(c.boost?0xf5c56e:0xdbad66,.8);fx.fillTriangle(rearX,rearY-5,rearX-22*Math.cos(f.angle),rearY+22*Math.sin(f.angle),rearX+2,rearY+5);}
 if(f.sabotage==='horse'&&flying){fx.fillStyle(0xb25e42);fx.fillRect(sx-15,sy-34,25,13);fx.fillRect(sx+5,sy-45,8,20);fx.fillRect(sx-12,sy-23,5,10);fx.fillRect(sx+5,sy-23,5,10);}
 if(f.sabotage==='rocket'&&f.time<3&&flying){fx.fillStyle(0x6b7c68);fx.fillRoundedRect(sx-35-f.time*12,sy+20+f.time*f.time*15,18,8,3);}
 if(f.sabotage==='parachute'&&f.time>3){fx.fillStyle(0xd3b780,.9);fx.fillEllipse(sx-80,sy-45,60,24);fx.lineStyle(1,0xe4ddbd);fx.lineBetween(sx-108,sy-41,sx-32,sy);fx.lineBetween(sx-54,sy-41,sx-32,sy);}
 if(m.inverted&&flying){fx.lineStyle(2,0xe0a076,.65);fx.strokeCircle(sx,sy,45);}
 if(f.sabotage==='fika'&&f.time>1&&f.time<8){const bx=w*.7,by=h*.43;fx.fillStyle(0xb57b43);fx.fillEllipse(bx,by,130,105);fx.lineStyle(7,0x774d31);const points=[];for(let a=0;a<Math.PI*7;a+=.15)points.push(new Phaser.Math.Vector2(bx+Math.cos(a)*a*2.1,by+Math.sin(a)*a*1.7));fx.strokePoints(points);fx.fillStyle(0xebdbb0);for(let i=0;i<15;i++)fx.fillRect(bx-40+(i*31)%90,by-35+(i*17)%70,4,3);}
 }
};}
