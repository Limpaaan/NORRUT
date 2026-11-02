import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh,launch,step,settle,buy} from '../src/model.ts';
const neutral={left:false,right:false,thrust:false,boost:false};
test('an unpowered starter makes a short ramp flight and earns a repeatable reward',()=>{const s=fresh(),f=launch(s);while(f.y>0&&f.time<120)step(f,neutral,s,1/120);assert.ok(f.y<=0);assert.ok(f.x>20&&f.x<60);const r=settle(s,f);assert.equal(s.coins,r.reward);assert.equal(s.runs,1);assert.equal(s.best,Math.floor(f.x));});
test('fuel and boost cannot become negative; powered run terminates',()=>{const s=fresh();s.levels.engine=1;s.levels.rockets=1;const f=launch(s);for(let i=0;i<24000&&f.y>0;i++)step(f,{...neutral,thrust:true,boost:true},s,1/120);assert.ok(f.fuel>=0&&f.boost>=0);assert.equal(f.fuel,0);assert.equal(f.boost,0);assert.ok(f.y<=0);assert.ok(Number.isFinite(f.x));});
test('purchase debits once and insufficient funds do not change levels',()=>{const s=fresh();assert.equal(buy(s,'tank'),false);s.coins=40;assert.equal(buy(s,'tank'),true);assert.equal(s.coins,0);assert.equal(s.levels.tank,1);assert.equal(buy(s,'tank'),false);assert.equal(launch(s).fuel,4.5);});
test('fixed stepping yields the same distance across render rates',()=>{const run=(fps:number)=>{const s=fresh(),f=launch(s);let remainder=0;for(let frame=0;frame<fps*3;frame++){remainder+=1/fps;while(remainder>=1/120){step(f,neutral,s,1/120);remainder-=1/120;}}return f.x;};assert.ok(Math.abs(run(30)-run(120))<0.3);});
