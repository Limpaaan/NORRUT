import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validSave} from '../src/accounts.ts';
import {fresh} from '../src/model.ts';
test('cloud saves reject malformed balances and upgrade levels',()=>{assert.ok(validSave(fresh()));assert.equal(validSave(null),false);assert.equal(validSave({...fresh(),coins:-1}),false);assert.equal(validSave({...fresh(),coins:1.2}),false);assert.equal(validSave({...fresh(),levels:{engine:21,tank:0,wings:0}}),false);});
