import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defaults,validateBindings,keyLabel} from '../src/hotkeys.ts';
test('defaults support arrows, WASD and space without collisions',()=>{const b=defaults();assert.ok(validateBindings(b));assert.ok(b.boost.includes('KeyS'));assert.ok(b.boost.includes('ArrowDown'));assert.equal(keyLabel('KeyW'),'W');});
test('reject conflicting or incomplete saved settings',()=>{const b=defaults();b.thrust[1]='KeyA';assert.equal(validateBindings(b),false);assert.equal(validateBindings({left:[]}),false);assert.equal(validateBindings(null),false);});
